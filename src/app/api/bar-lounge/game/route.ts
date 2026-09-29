import { z } from "zod";
import { clueRound, dailyPuzzle, gradeAnswer, gradeDaily, practiceRound } from "@/lib/bar-lounge/engine";
import { MYSTERIES, QUESTION_BANK } from "@/lib/bar-lounge/content";

export const runtime = "nodejs";
const headers = { "Cache-Control": "no-store" };
const answerSchema = z.object({ action: z.literal("answer"), id: z.string().max(80), answer: z.string().max(200).nullable() });
const dailySchema = z.object({ action: z.literal("daily_guess"), id: z.string().max(80), guess: z.string().regex(/^[A-Z]{5}$/), attempt: z.number().int().min(1).max(6) });

// Practice API: answer keys stay on the server. This is not a ranked competition
// endpoint. A real leaderboard requires authenticated, durable attempts and
// server-authoritative clocks, replay protection, rate limiting and scores.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode");
  const seen = (url.searchParams.get("seen") ?? "").split(",").slice(-200);
  if (mode === "daily") {
    const { id, day, clue, length, turns } = dailyPuzzle();
    return Response.json({ id, day, clue, length, turns }, { headers });
  }
  if (mode === "clues") return Response.json({ mysteries: clueRound(seen), bankSize: MYSTERIES.length }, { headers });
  if (mode === "practice") return Response.json({ questions: practiceRound(seen), bankSize: QUESTION_BANK.length }, { headers });
  return Response.json({ error: "Choose a game mode." }, { status: 400, headers });
}

export async function POST(request: Request) {
  let payload: unknown;
  try { payload = await request.json(); } catch { return Response.json({ error: "Invalid request." }, { status: 400, headers }); }
  const parsed = z.discriminatedUnion("action", [answerSchema, dailySchema]).safeParse(payload);
  if (!parsed.success) return Response.json({ error: "Check your answer and try again." }, { status: 400, headers });
  const body = parsed.data;
  const result = body.action === "answer" ? gradeAnswer(body.id, body.answer) : gradeDaily(body.id, body.guess, body.attempt);
  if (!result) return Response.json({ error: "This puzzle is no longer available. Start a fresh round." }, { status: 404, headers });
  return Response.json(result, { headers });
}
