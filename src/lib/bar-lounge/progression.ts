export const XP_TIERS = [
  { name: "On The Radio", xp: 0 }, { name: "In The Whip", xp: 1000 },
  { name: "On The Block", xp: 3000 }, { name: "In The Crates", xp: 7000 },
  { name: "Broadway's Floor", xp: 15000 },
];
export type GameMode = "practice" | "clues" | "daily";
export type PlayerStats = { xp: number; rounds: number; correct: number; total: number; best_streak: number; perfect_rounds: number; cipher_wins: number; modes: GameMode[] };
export type CompletedRound = { key: string; mode: GameMode; points: number; correct: number; total: number; best: number; won?: boolean };
export const EMPTY_STATS: PlayerStats = { xp: 0, rounds: 0, correct: 0, total: 0, best_streak: 0, perfect_rounds: 0, cipher_wins: 0, modes: [] };
export const BADGES = [
  { id: "first-round", title: "First On The Mic", note: "Finish your first round." },
  { id: "cipher", title: "Code Breaker", note: "Solve a Daily Cipher." },
  { id: "perfect", title: "No Skips", note: "Get every answer right in a full timed round." },
  { id: "streak", title: "Five On Fire", note: "Answer five questions correctly in a row." },
  { id: "range", title: "Full Rotation", note: "Complete all three modes." },
  { id: "regular", title: "Lounge Regular", note: "Complete ten rounds." },
  { id: "floor", title: "Broadway's Floor", note: "Reach 15,000 XP." },
];
export function earnedBadges(s: PlayerStats) {
  return BADGES.filter((b) => ({ "first-round": s.rounds > 0, cipher: s.cipher_wins > 0, perfect: s.perfect_rounds > 0, streak: s.best_streak >= 5, range: s.modes.length === 3, regular: s.rounds >= 10, floor: s.xp >= 15000 })[b.id]);
}
export function xpForRound(r: CompletedRound) { return 25 + Math.floor(r.points / 10); }
export function tierForXP(xp: number) { return XP_TIERS.reduce((level, t, i) => xp >= t.xp ? i : level, 0); }
export function addRound(s: PlayerStats, r: CompletedRound): PlayerStats {
  return { xp: s.xp + xpForRound(r), rounds: s.rounds + 1, correct: s.correct + r.correct, total: s.total + r.total,
    best_streak: Math.max(s.best_streak, r.best), perfect_rounds: s.perfect_rounds + (r.mode !== "daily" && r.correct === r.total ? 1 : 0),
    cipher_wins: s.cipher_wins + (r.mode === "daily" && r.won ? 1 : 0), modes: [...new Set([...s.modes, r.mode])] };
}
