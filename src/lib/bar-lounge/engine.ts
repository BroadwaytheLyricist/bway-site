import "server-only";
import { randomInt } from "node:crypto";
import { DAILY_WORDS, MYSTERIES, QUESTION_BANK } from "./content";
import type { TileState } from "./types";

function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function practiceRound(seen: string[]) {
  const history = new Set(seen);
  const pool = [...shuffle(QUESTION_BANK.filter((q) => !history.has(q.id))), ...shuffle(QUESTION_BANK.filter((q) => history.has(q.id)))];
  const picked: typeof QUESTION_BANK = [];
  const topics = new Set<string>();
  for (const entry of pool) {
    if (topics.has(entry.topic) || (entry.topic.startsWith("btl") && picked.some((p) => p.topic.startsWith("btl")))) continue;
    picked.push(entry); topics.add(entry.topic);
    if (picked.length === 8) break;
  }
  return picked.map(({ id, topic, kind, prompt, options, difficulty, sample }) => ({ id, topic, kind, prompt, options: shuffle(options), difficulty, sample }));
}

export function clueRound(seen: string[]) {
  const history = new Set(seen);
  return [...shuffle(MYSTERIES.filter((q) => !history.has(q.id))), ...shuffle(MYSTERIES.filter((q) => history.has(q.id)))].slice(0, 3).map(({ id, clues, category }) => ({ id, clues, category }));
}

export function normalize(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function gradeAnswer(id: string, answer: string | null) {
  const entry = QUESTION_BANK.find((q) => q.id === id);
  if (entry) return { correct: answer !== null && normalize(answer) === normalize(entry.answer), reveal: entry.reveal };
  const mystery = MYSTERIES.find((q) => q.id === id);
  if (mystery) return { correct: answer !== null && mystery.answers.some((a) => normalize(a) === normalize(answer)), reveal: mystery.reveal };
  return null;
}

export function dailyPuzzle(now = new Date()) {
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  const index = Math.floor(Date.parse(day + "T00:00:00Z") / 86400000) % DAILY_WORDS.length;
  return { ...DAILY_WORDS[index], id: `cipher-v1-${day}`, day, length: 5, turns: 6 };
}

export function gradeDaily(id: string, guess: string, attempt: number) {
  const puzzle = dailyPuzzle();
  if (puzzle.id !== id) return null;
  const remaining = puzzle.answer.split("");
  const states: TileState[] = Array(5).fill("miss");
  for (let i = 0; i < 5; i++) if (guess[i] === remaining[i]) { states[i] = "hit"; remaining[i] = ""; }
  for (let i = 0; i < 5; i++) if (states[i] !== "hit") {
    const other = remaining.indexOf(guess[i]);
    if (other >= 0) { states[i] = "near"; remaining[other] = ""; }
  }
  const solved = guess === puzzle.answer;
  return { states, solved, answer: solved || attempt >= 6 ? puzzle.answer : null };
}
