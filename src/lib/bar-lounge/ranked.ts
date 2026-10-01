import "server-only";
import { randomUUID } from "node:crypto";
import { currentPlayer, db } from "./storage";
import { gradeAnswer, gradeDaily } from "./engine";
import type { GameMode } from "./progression";
import type { Outcome, Reveal, TileState } from "./types";
type Grade = { correct: boolean; reveal: Reveal; points: number; outcome: Outcome; seconds: number };
type DailyGrade = { states: TileState[]; solved: boolean; answer: string | null };
type RunState = { mode: GameMode; ids: string[]; index: number; startedAt: number; awaiting: boolean; score: number; correct: number; total: number; streak: number; best: number; rows: { guess: string; states: TileState[] }[]; won: boolean; last?: Grade | DailyGrade; lastInput?: string };
type Run = { id: string; player_id: string; state: RunState; version: number; completed: boolean; created_at: string };

export async function startRanked(mode: GameMode, ids: string[], dailyKey?: string): Promise<Run | null> {
  const user = await currentPlayer();
  if (!user) return null;
  if (dailyKey) {
    const saved = await db<Run[]>(`lounge_runs?player_id=eq.${user.id}&daily_key=eq.${encodeURIComponent(dailyKey)}`);
    if (saved.length) return saved[0];
  }
  const since = encodeURIComponent(new Date(Date.now() - 3600000).toISOString());
  const recent = await db<{ id: string }[]>(`lounge_runs?player_id=eq.${user.id}&created_at=gte.${since}&select=id&limit=30`);
  if (recent.length >= 30) throw new Error("You've played 30 rounds this hour. Take a break and come back soon.");
  const state: RunState = { mode, ids, index: 0, startedAt: Date.now(), awaiting: false, score: 0, correct: 0, total: mode === "daily" ? 1 : ids.length, streak: 0, best: 0, rows: [], won: false };
  try { return (await db<Run[]>("lounge_runs", "POST", { id: randomUUID(), player_id: user.id, daily_key: dailyKey ?? null, state }))[0]; }
  catch (e) {
    if (dailyKey) { const saved = await db<Run[]>(`lounge_runs?player_id=eq.${user.id}&daily_key=eq.${encodeURIComponent(dailyKey)}`); if (saved.length) return saved[0]; }
    throw e;
  }
}
async function ownedRun(id: string) {
  const user = await currentPlayer();
  if (!user) throw new Error("Sign in again to continue this saved round.");
  const [run] = await db<Run[]>(`lounge_runs?id=eq.${id}&player_id=eq.${user.id}`);
  if (!run || Date.now() - Date.parse(run.created_at) > 24 * 3600000) throw new Error("This round has expired. Start a fresh round.");
  return run;
}
async function commit(run: Run, complete = false) {
  const saved = await db<boolean>("rpc/lounge_save_run", "POST", { p_id: run.id, p_player: run.player_id, p_version: run.version, p_state: run.state, p_complete: complete });
  if (!saved) throw new Error("This answer was already submitted. Please retry to load its result.");
}
export async function advanceRanked(runId: string, index: number) {
  const run = await ownedRun(runId), s = run.state;
  if (run.completed || s.mode === "daily") throw new Error("Start a new round.");
  if (s.index === index && !s.awaiting) return { ok: true };
  if (!s.awaiting || index !== s.index + 1 || index >= s.ids.length) throw new Error("Finish the current question first.");
  s.index = index; s.startedAt = Date.now(); s.awaiting = false; delete s.last; delete s.lastInput;
  await commit(run); return { ok: true };
}
export async function rankedClue(runId: string) {
  const run = await ownedRun(runId);
  if (run.completed || run.state.awaiting || run.state.mode !== "clues") throw new Error("No active mystery.");
  return { id: run.state.ids[run.state.index], clue: Math.min(4, Math.floor((Date.now() - run.state.startedAt) / 20000)) };
}
export async function answerRanked(runId: string, id: string, answer: string | null, reason: "answer" | "timeout" | "void") {
  const run = await ownedRun(runId), s = run.state;
  if (s.mode === "daily" || id !== s.ids[s.index]) throw new Error("Answer the current question.");
  if (s.awaiting && s.last) return s.last;
  if (run.completed) throw new Error("This round is complete.");
  const grade = gradeAnswer(id, answer);
  if (!grade) throw new Error("Question unavailable.");
  const elapsed = (Date.now() - s.startedAt) / 1000;
  const timeout = elapsed >= (s.mode === "practice" ? 10 : 100);
  const outcome: Outcome = reason === "void" ? "void" : reason === "timeout" || timeout ? "timeout" : grade.correct ? "correct" : "wrong";
  const points = outcome !== "correct" ? 0 : s.mode === "practice" ? 100 + Math.round(Math.max(0, 10 - elapsed) * 15) + (s.streak >= 2 ? 50 : 0) : (5 - Math.min(4, Math.floor(elapsed / 20))) * 200;
  s.score += points; s.correct += outcome === "correct" ? 1 : 0; s.streak = outcome === "correct" ? s.streak + 1 : 0; s.best = Math.max(s.best, s.streak); s.awaiting = true;
  s.last = { ...grade, correct: outcome === "correct", points, outcome, seconds: Math.min(s.mode === "practice" ? 10 : 100, elapsed) };
  await commit(run, s.index === s.ids.length - 1); return s.last;
}
export async function guessRanked(runId: string, id: string, guess: string, attempt: number) {
  const run = await ownedRun(runId), s = run.state;
  if (s.mode !== "daily" || s.ids[0] !== id) throw new Error("Choose today's cipher.");
  if (s.rows.length === attempt && s.lastInput === guess && s.last) return s.last;
  if (run.completed || attempt !== s.rows.length + 1) throw new Error("Reload the cipher to restore your saved guesses.");
  const grade = gradeDaily(id, guess, attempt);
  if (!grade) throw new Error("A new cipher is available. Reload to play today's puzzle.");
  s.rows.push({ guess, states: grade.states }); s.won = grade.solved; s.last = grade; s.lastInput = guess;
  const complete = grade.solved || attempt === 6;
  if (complete) { s.score = grade.solved ? (7 - attempt) * 100 : 0; s.correct = grade.solved ? 1 : 0; s.best = s.correct; }
  await commit(run, complete); return grade;
}
