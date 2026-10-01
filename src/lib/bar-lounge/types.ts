export type Outcome = "correct" | "wrong" | "timeout" | "void";
export type Reveal = { title: string; context: string; image?: string; sourceUrl?: string; sourceLabel?: string };
export type Question = { id: string; topic: string; kind: "knowledge" | "finish_bar" | "who_said_bar"; prompt: string; options: string[]; difficulty: number; sample?: boolean };
export type Mystery = { id: string; clues: string[]; category: string };
export type RoundResult = { id: string; prompt: string; outcome: Outcome; submitted: string | null; points: number; seconds: number; reveal: Reveal };
export type TileState = "hit" | "near" | "miss";
export type DailyPuzzle = { id: string; day: string; clue: string; length: number; turns: number };
