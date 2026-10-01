import { z } from "zod";
import { clueRound, dailyPuzzle, gradeAnswer, gradeDaily, practiceRound } from "@/lib/bar-lounge/engine";
import { MYSTERIES, QUESTION_BANK } from "@/lib/bar-lounge/content";
import { randomUUID } from "node:crypto";
import { advanceRanked, answerRanked, guessRanked, rankedClue, startRanked } from "@/lib/bar-lounge/ranked";
import { sameOrigin } from "@/lib/bar-lounge/storage";

export const runtime = "nodejs";
const headers = { "Cache-Control": "no-store" };
const runId = z.string().uuid().optional();
const answerSchema = z.object({ action: z.literal("answer"), id: z.string().max(80), answer: z.string().max(200).nullable(), runId, reason: z.enum(["answer", "timeout", "void"]).default("answer") });
const dailySchema = z.object({ action: z.literal("daily_guess"), id: z.string().max(80), guess: z.string().regex(/^[A-Z]{5}$/), attempt: z.number().int().min(1).max(6), runId });
const nextSchema = z.object({ action: z.literal("next"), runId: z.string().uuid(), index: z.number().int().min(1).max(7) });
const clueSchema = z.object({ action: z.literal("clue"), runId: z.string().uuid() });

// Guests practice freely. Verified players use durable, server-scored sessions.
export async function GET(request: Request) {
  try {
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode");
  const seen = (url.searchParams.get("seen") ?? "").split(",").slice(-200);
  if (mode === "daily") {
    const { id, day, clue, length, turns } = dailyPuzzle();
    const run = await startRanked("daily", [id], id);
    return Response.json({ id, day, clue, length, turns, runId: run?.id, roundKey: run?.id ?? id, saved: run ? { rows: run.state.rows, won: run.state.won, answer: run.state.last && "answer" in run.state.last ? run.state.last.answer : null } : null }, { headers });
  }
  if (mode === "clues") {
    const mysteries = clueRound(seen), run = await startRanked("clues", mysteries.map((m) => m.id));
    return Response.json({ mysteries: run ? mysteries.map((m) => ({ ...m, clues: m.clues.slice(0, 1) })) : mysteries, bankSize: MYSTERIES.length, runId: run?.id, roundKey: run?.id ?? randomUUID() }, { headers });
  }
  if (mode === "practice") {
    const questions = practiceRound(seen), run = await startRanked("practice", questions.map((q) => q.id));
    return Response.json({ questions, bankSize: QUESTION_BANK.length, runId: run?.id, roundKey: run?.id ?? randomUUID() }, { headers });
  }
  return Response.json({ error: "Choose a game mode." }, { status: 400, headers });
  } catch (e) { return Response.json({ error: e instanceof Error ? e.message : "Unable to load the game." }, { status: 503, headers }); }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Invalid origin." }, { status: 403, headers });
  let payload: unknown;
  try { payload = await request.json(); } catch { return Response.json({ error: "Invalid request." }, { status: 400, headers }); }
  const parsed = z.discriminatedUnion("action", [answerSchema, dailySchema, nextSchema, clueSchema]).safeParse(payload);
  if (!parsed.success) return Response.json({ error: "Check your answer and try again." }, { status: 400, headers });
  const body = parsed.data;
  try {
  if (body.action === "next") return Response.json(await advanceRanked(body.runId, body.index), { headers });
  if (body.action === "clue") {
    const { id, clue } = await rankedClue(body.runId);
    return Response.json({ clue, clues: MYSTERIES.find((m) => m.id === id)?.clues.slice(0, clue + 1) }, { headers });
  }
  if (body.runId) return Response.json(body.action === "answer" ? await answerRanked(body.runId, body.id, body.answer, body.reason) : await guessRanked(body.runId, body.id, body.guess, body.attempt), { headers });
  const result = body.action === "answer" ? gradeAnswer(body.id, body.answer) : gradeDaily(body.id, body.guess, body.attempt);
  if (!result) return Response.json({ error: "This puzzle is no longer available. Start a fresh round." }, { status: 404, headers });
  return Response.json(result, { headers });
  } catch (e) { return Response.json({ error: e instanceof Error ? e.message : "Unable to save your answer." }, { status: 409, headers }); }
}
