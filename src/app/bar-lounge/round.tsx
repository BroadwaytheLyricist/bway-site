"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import HeroBackground from "@/components/sections/HeroBackground";
import type { DailyPuzzle, Mystery, Outcome, Question, Reveal, RoundResult, TileState } from "@/lib/bar-lounge/types";
import styles from "./lounge.module.css";
import LoungeLobby, { LoungeIcon } from "./lobby";
import { ProgressProvider, ProgressSummary, PlayerHub, Leaderboard, AwardRound } from "./progress";

const API = "/api/bar-lounge/game";
type Mode = "lobby" | "cipher" | "practice" | "clues" | "progress" | "leaderboard";
type Phase = "question" | "checking" | "feedback" | "reveal" | "result";
const kindLabel = { knowledge: "On the Record", finish_bar: "Finish the Bar", who_said_bar: "Who Said This Bar?" };
const outcomeLabel: Record<Outcome, string> = { correct: "Correct", wrong: "Incorrect", timeout: "No answer", void: "Question voided" };

async function api<T>(params: string | object): Promise<T> {
  const response = typeof params === "string"
    ? await fetch(API + params, { cache: "no-store" })
    : await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(params) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Unable to load the game.");
  return data as T;
}
function history(key: string): string[] {
  try { const value = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(value) ? value.filter((id) => typeof id === "string").slice(-24) : []; } catch { return []; }
}
function remember(key: string, ids: string[]) {
  try { localStorage.setItem(key, JSON.stringify([...history(key), ...ids].slice(-24))); } catch {}
}
function tierIndex(correct: number, total: number) {
  const ratio = total ? correct / total : 0;
  return ratio >= 0.9 ? 4 : ratio >= 0.7 ? 3 : ratio >= 0.5 ? 2 : ratio >= 0.3 ? 1 : 0;
}

export default function BarLoungeDemo() { return <ProgressProvider><BarLounge /></ProgressProvider>; }
function BarLounge() {
  const [mode, setMode] = useState<Mode>("lobby");
  return <section className={"relative isolate min-h-screen overflow-hidden px-4 pb-16 pt-24 sm:px-8 sm:pt-28 " + styles.stage}>
    <div className={styles.pageBackdrop}><HeroBackground showPortrait={false}/><div className={styles.pageScrim}/></div>
    <div className="relative z-10 mx-auto max-w-7xl">
      <div className={styles.loungeHeader}>
        <button className={styles.loungeBrand} onClick={() => setMode("lobby")} aria-label="The Bar Lounge home"><span>THE</span><strong>BAR <LoungeIcon name="mic"/></strong><strong>LOUNGE</strong><small>BY BROADWAY THE LYRICIST</small></button>
        <nav aria-label="Bar Lounge modes" className={styles.loungeNav}>{([["lobby", "The Lounge"], ["cipher", "Daily Cipher"], ["practice", "Raise the Bar"], ["clues", "Name That Legend"], ["progress", "My Record"], ["leaderboard", "Leaderboard"]] as const).map(([value, label]) => <button key={value} onClick={() => setMode(value)} aria-current={mode === value ? "page" : undefined} className={mode === value ? styles.navActive : undefined}>{label}</button>)}</nav>
        <span className={styles.previewBadge}>The Bar Lounge</span>
      </div>
      {mode === "lobby" && <><LoungeLobby onPlay={setMode} /><ProgressSummary onOpen={() => setMode("progress")} /></>}
      <div className={mode === "lobby" ? undefined : styles.playArea}>
      {mode === "progress" && <PlayerHub />}
      {mode === "leaderboard" && <Leaderboard />}
      {mode === "practice" && <PracticeGame onExit={() => setMode("lobby")} />}
      {mode === "clues" && <ClueGame onExit={() => setMode("lobby")} />}
      {mode === "cipher" && <DailyCipher onExit={() => setMode("lobby")} />}
      </div>
    </div>
  </section>;
}

function PracticeGame({ onExit }: { onExit: () => void }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [phase, setPhase] = useState<Phase>("question");
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(10);
  const [selected, setSelected] = useState<string | null>(null);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [error, setError] = useState("");
  const [bankSize, setBankSize] = useState(0);
  const deadline = useRef(0);
  const locked = useRef(true);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streakRef = useRef(0);
  const generation = useRef(0);
  const [runId, setRunId] = useState<string | undefined>(undefined);
  const [roundKey, setRoundKey] = useState("");
  const question = questions[index];
  const correct = results.filter((r) => r.outcome === "correct").length;
  const score = results.reduce((sum, r) => sum + r.points, 0);
  let streak = 0;
  for (const r of results) streak = r.outcome === "correct" ? streak + 1 : 0;
  const result = results[index];

  const load = useCallback(async () => {
    locked.current = true;
    const requestId = ++generation.current;
    try {
      const data = await api<{ questions: Question[]; bankSize: number; runId?: string; roundKey: string }>("?mode=practice&seen=" + encodeURIComponent(history("bar-lounge-seen").join(",")));
      if (requestId !== generation.current) return;
      setRunId(data.runId); setRoundKey(data.roundKey);
      remember("bar-lounge-seen", data.questions.map((q) => q.id));
      setQuestions(data.questions); setBankSize(data.bankSize); setIndex(0); setResults([]); setSelected(null); setSeconds(10); setPhase("question"); setError("");
      streakRef.current = 0; deadline.current = performance.now() + 10000; locked.current = false;
    } catch (e) { if (requestId === generation.current) setError(e instanceof Error ? e.message : "Unable to load the round."); }
  }, []);
  useEffect(() => { const life = generation; const initialLoad = setTimeout(() => { void load(); }, 0); return () => { clearTimeout(initialLoad); life.current++; if (revealTimer.current) clearTimeout(revealTimer.current); }; }, [load]);

  const settle = useCallback(async (reason: "answer" | "timeout" | "void", answer: string | null) => {
    if (locked.current || !question) return;
    locked.current = true; setPhase("checking"); setSelected(answer);
    const requestId = generation.current;
    const left = Math.max(0, (deadline.current - performance.now()) / 1000);
    try {
      const grade = await api<{ correct: boolean; reveal: Reveal; points?: number; outcome?: Outcome; seconds?: number }>({ action: "answer", id: question.id, answer, reason, runId: runId });
      if (requestId !== generation.current) return;
      const outcome: Outcome = grade.outcome ?? (reason === "answer" && left > 0 ? grade.correct ? "correct" : "wrong" : reason === "void" ? "void" : "timeout");
      const points = grade.points ?? (outcome === "correct" ? 100 + Math.round(left * 15) + (streakRef.current >= 2 ? 50 : 0) : 0);
      streakRef.current = outcome === "correct" ? streakRef.current + 1 : 0;
      setResults((list) => [...list, { id: question.id, prompt: question.prompt, outcome, submitted: answer, points, seconds: grade.seconds ?? Math.min(10, 10 - left), reveal: grade.reveal }]);
      setPhase("feedback");
      revealTimer.current = setTimeout(() => setPhase("reveal"), 1200);
    } catch (e) {
      if (requestId !== generation.current) return;
      setError(e instanceof Error ? e.message : "Connection failed. Try again.");
      deadline.current = performance.now() + Math.max(1, left) * 1000; locked.current = false; setPhase("question");
    }
  }, [question, runId]);

  useEffect(() => {
    if (!question || phase !== "question") return;
    const timer = setInterval(() => { const left = Math.max(0, (deadline.current - performance.now()) / 1000); setSeconds(left); if (left === 0) void settle("timeout", null); }, 100);
    return () => clearInterval(timer);
  }, [question, phase, settle]);
  useEffect(() => {
    if (!question || phase !== "question") return;
    const bail = () => { void settle("void", null); };
    const visibility = () => { if (document.hidden) bail(); };
    window.addEventListener("blur", bail); document.addEventListener("visibilitychange", visibility);
    return () => { window.removeEventListener("blur", bail); document.removeEventListener("visibilitychange", visibility); };
  }, [question, phase, settle]);

  const next = async () => {
    if (runId && index + 1 < questions.length) { try { await api({ action: "next", runId: runId, index: index + 1 }); } catch (e) { setError(e instanceof Error ? e.message : "Try again."); return; } }
    if (index + 1 >= questions.length) { setPhase("result"); return; }
    setIndex(index + 1); setSelected(null); setError(""); setSeconds(10); deadline.current = performance.now() + 10000; locked.current = false; setPhase("question");
  };
  if (phase === "result") return <Scorecard title="Raise the Bar" roundKey={roundKey} ranked={!!runId} results={results} onReplay={load} onExit={onExit} />;
  return <div className={styles.gamePanel + " mx-auto max-w-2xl"}>
    {!question ? <><p className="text-center text-slate-300">{error || "Building your fresh round…"}</p>{error && <button onClick={load} className="mt-5 text-accent">Retry →</button>}<Back onExit={onExit}/></> : <>
      <RisingBars level={tierIndex(correct, questions.length) + 1}/>
      <p className="kicker mb-4 text-center">{"Bar " + (index + 1) + " / " + questions.length + " · " + correct + " correct"}</p>
      <div className="mb-5 flex justify-between text-sm font-semibold"><span>{bankSize + " questions in the seed bank"}</span><span className="text-accent">{"🔥 " + streak + " · " + score + " pts"}</span></div>
      <Timer seconds={seconds} total={10}/>
      <p className="kicker mt-8">{kindLabel[question.kind]}{question.sample && <span className="ml-2 normal-case tracking-normal text-slate-400">/ original practice line</span>}</p>
      <h1 className="mt-3 min-h-24 text-2xl font-bold leading-snug sm:text-3xl">{question.prompt}</h1>
      <div className="mt-6 grid gap-3">{question.options.map((option) => {
        const right = phase === "reveal" && option === result?.reveal.title;
        const pickedCorrect = phase === "feedback" && result?.outcome === "correct" && option === selected;
        const wrong = (phase === "feedback" || phase === "reveal") && result?.outcome === "wrong" && option === selected;
        return <button key={option} onClick={() => { void settle("answer", option); }} disabled={phase !== "question"} className={"rounded-xl border px-5 py-4 text-left font-semibold transition-colors disabled:cursor-default " + (right || pickedCorrect ? "border-green-500 bg-green-950/70 text-green-200" : wrong ? "border-rose-500 bg-rose-950/70 text-rose-200" : "border-white/10 bg-[#211a14] hover:border-accent/60")}>{option}{right && " ✓"}{wrong && " ×"}</button>;
      })}</div>
      {phase === "checking" && <p role="status" className="mt-5 text-slate-300">Checking your answer…</p>}
      {(phase === "feedback" || phase === "reveal") && result && <Feedback result={result}/>}
      {phase === "reveal" && result && <><RevealCard reveal={result.reveal}/><button onClick={next} className="btn-accent mt-6 w-full rounded-lg px-6 py-4 font-bold text-[#0a0e17]">{index + 1 === questions.length ? "See My Scorecard →" : "Next Bar →"}</button></>}
      {error && <p role="alert" className="mt-4 text-rose-300">{error}</p>}
    </>}
  </div>;
}

function ClueGame({ onExit }: { onExit: () => void }) {
  const [mysteries, setMysteries] = useState<Mystery[]>([]);
  const [index, setIndex] = useState(0);
  const [clue, setClue] = useState(0);
  const [seconds, setSeconds] = useState(20);
  const [draft, setDraft] = useState("");
  const [phase, setPhase] = useState<Phase>("question");
  const [results, setResults] = useState<RoundResult[]>([]);
  const [error, setError] = useState("");
  const deadline = useRef(0);
  const locked = useRef(true);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generation = useRef(0);
  const [runId, setRunId] = useState<string | undefined>(undefined);
  const [roundKey, setRoundKey] = useState("");
  const mystery = mysteries[index], result = results[index];
  const clueLoading = useRef(false);
  const load = useCallback(async () => {
    locked.current = true;
    const requestId = ++generation.current;
    try {
      const data = await api<{ mysteries: Mystery[]; runId?: string; roundKey: string }>("?mode=clues&seen=" + encodeURIComponent(history("bar-lounge-clues-seen").join(",")));
      if (requestId !== generation.current) return;
      setRunId(data.runId); setRoundKey(data.roundKey);
      remember("bar-lounge-clues-seen", data.mysteries.map((m) => m.id));
      setMysteries(data.mysteries); setIndex(0); setClue(0); setDraft(""); setResults([]); setSeconds(20); setPhase("question"); setError(""); deadline.current = performance.now() + 20000; locked.current = false;
    } catch (e) { if (requestId === generation.current) setError(e instanceof Error ? e.message : "Unable to load the mysteries."); }
  }, []);
  useEffect(() => { const life = generation; const initialLoad = setTimeout(() => { void load(); }, 0); return () => { clearTimeout(initialLoad); life.current++; if (revealTimer.current) clearTimeout(revealTimer.current); }; }, [load]);
  const settle = useCallback(async (answer: string | null) => {
    if (!mystery || locked.current) return;
    locked.current = true; setPhase("checking");
    const requestId = generation.current;
    try {
      const grade = await api<{ correct: boolean; reveal: Reveal; points?: number; outcome?: Outcome; seconds?: number }>({ action: "answer", id: mystery.id, answer, runId: runId, reason: answer === null ? "timeout" : "answer" });
      if (requestId !== generation.current) return;
      const outcome: Outcome = grade.outcome ?? (answer === null ? "timeout" : grade.correct ? "correct" : "wrong");
      const points = grade.points ?? (grade.correct ? (5 - clue) * 200 : 0);
      setResults((list) => [...list, { id: mystery.id, prompt: mystery.category + " · solved from five clues", outcome, submitted: answer, points, seconds: grade.seconds ?? (clue * 20 + Math.max(0, 20 - (deadline.current - performance.now()) / 1000)), reveal: grade.reveal }]);
      setPhase("feedback"); revealTimer.current = setTimeout(() => setPhase("reveal"), 1200);
    } catch (e) { if (requestId !== generation.current) return; setError(e instanceof Error ? e.message : "Try again."); locked.current = false; deadline.current = performance.now() + 20000; setPhase("question"); }
  }, [mystery, clue, runId]);
  useEffect(() => {
    if (!mystery || phase !== "question") return;
    const timer = setInterval(() => {
      const left = Math.max(0, (deadline.current - performance.now()) / 1000); setSeconds(left);
      if (left === 0) {
        if (clue < 4) {
          if (!runId) { setClue(clue + 1); setSeconds(20); deadline.current = performance.now() + 20000; }
          else if (!clueLoading.current) {
            clueLoading.current = true;
            const requestId = generation.current;
            api<{ clue: number; clues: string[] }>({ action: "clue", runId: runId }).then((data) => {
              if (requestId !== generation.current) return;
              if (data.clue > clue) { setMysteries((list) => list.map((m, i) => i === index ? { ...m, clues: data.clues } : m)); setClue(data.clue); setSeconds(20); deadline.current = performance.now() + 20000; }
            }).catch((e) => { if (requestId === generation.current) setError(e.message); }).finally(() => { clueLoading.current = false; });
          }
        }
        else void settle(null);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [mystery, phase, clue, settle, index, runId]);
  const next = async () => {
    if (runId && index + 1 < mysteries.length) { try { await api({ action: "next", runId: runId, index: index + 1 }); } catch (e) { setError(e instanceof Error ? e.message : "Try again."); return; } }
    if (index + 1 === mysteries.length) { setPhase("result"); return; }
    setIndex(index + 1); setClue(0); setDraft(""); setSeconds(20); setError(""); locked.current = false; deadline.current = performance.now() + 20000; setPhase("question");
  };
  if (phase === "result") return <Scorecard title="Name That Legend" roundKey={roundKey} ranked={!!runId} results={results} onReplay={load} onExit={onExit}/>;
  return <div className={styles.gamePanel + " mx-auto max-w-2xl"}>
    <p className="kicker">Name That Legend</p><h1 className="font-display mt-3 text-5xl">READ THE <span className="text-accent">ROOM</span></h1>
    {!mystery ? <><p className="mt-5">{error || "Choosing your mysteries…"}</p>{error && <button onClick={load} className="mt-4 text-accent">Retry →</button>}</> : <>
      <p className="my-5 text-sm text-slate-300">{"Mystery " + (index + 1) + "/" + mysteries.length + ". One guess. Five clues. Earlier means more points."}</p>
      <Timer seconds={seconds} total={20}/>
      <ol className="mt-7 grid gap-3">{mystery.clues.slice(0, clue + 1).map((text, i) => <li key={i} className={"rounded-lg border p-4 " + (i === clue ? "border-accent/50 bg-accent/10" : "border-white/10 bg-white/5")}><span className="kicker">{"Clue " + (i + 1) + " / " + (5 - i) * 200 + " points"}</span><p className="mt-2">{text}</p></li>)}</ol>
      {phase === "question" && <form onSubmit={(e) => { e.preventDefault(); if (draft.trim()) void settle(draft.trim()); }} className="mt-6 flex gap-2"><input aria-label="Your one guess" value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={150} className="min-w-0 flex-1 rounded-lg border border-white/20 bg-[#17120e] px-4 py-3 outline-none focus:border-accent" placeholder={mystery.category}/><button disabled={!draft.trim()} className="rounded-lg bg-accent px-5 font-bold text-[#0a0e17] disabled:opacity-40">Lock In</button></form>}
      {phase === "checking" && <p role="status" className="mt-5">Checking your guess…</p>}
      {(phase === "feedback" || phase === "reveal") && result && <Feedback result={result}/>}
      {phase === "reveal" && result && <><RevealCard reveal={result.reveal}/><button onClick={next} className="btn-accent mt-6 w-full rounded-lg px-6 py-4 font-bold text-[#0a0e17]">{index + 1 === mysteries.length ? "See My Scorecard →" : "Next Mystery →"}</button></>}
      {error && <p role="alert" className="mt-4 text-rose-300">{error}</p>}
    </>}
    <Back onExit={onExit}/>
  </div>;
}

function DailyCipher({ onExit }: { onExit: () => void }) {
  const [puzzle, setPuzzle] = useState<DailyPuzzle | null>(null);
  const [runId, setRunId] = useState<string | undefined>(undefined);
  const [roundKey, setRoundKey] = useState("");
  const [rows, setRows] = useState<{ guess: string; states: TileState[] }[]>([]);
  const [draft, setDraft] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const finished = won || rows.length >= 6;
  useEffect(() => {
    let cancelled = false;
    api<DailyPuzzle & { runId?: string; roundKey: string; saved?: { rows: { guess: string; states: TileState[] }[]; won: boolean; answer: string | null } }>("?mode=daily").then((data) => {
      if (cancelled) return;
      setPuzzle(data); setRunId(data.runId); setRoundKey(data.roundKey);
      if (data.saved) { setRows(data.saved.rows); setWon(data.saved.won); setAnswer(data.saved.answer); return; }
      try {
        const saved = JSON.parse(localStorage.getItem("bar-lounge-daily-" + data.id) || "null");
        if (saved && Array.isArray(saved.rows) && saved.rows.length <= 6) { setRows(saved.rows); setWon(saved.won === true); setAnswer(typeof saved.answer === "string" ? saved.answer : null); }
      } catch {}
    }).catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : "Unable to load the daily puzzle."); });
    return () => { cancelled = true; };
  }, []);
  const send = async () => {
    if (!puzzle || finished || loading) return;
    if (draft.length !== 5) { setError("Enter five letters to lock in a guess."); return; }
    setLoading(true); setError("");
    try {
      const grade = await api<{ states: TileState[]; solved: boolean; answer: string | null }>({ action: "daily_guess", id: puzzle.id, guess: draft, attempt: rows.length + 1, runId: runId });
      const nextRows = [...rows, { guess: draft, states: grade.states }];
      setRows(nextRows); setWon(grade.solved); setAnswer(grade.answer); setDraft("");
      try { if (!runId) localStorage.setItem("bar-lounge-daily-" + puzzle.id, JSON.stringify({ rows: nextRows, won: grade.solved, answer: grade.answer })); } catch {}
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to check the guess."); }
    finally { setLoading(false); }
  };
  const share = async () => {
    const text = rows.map((row) => row.states.map((s) => s === "hit" ? "🟧" : s === "near" ? "🟦" : "⬛").join("")).join("\n");
    try { await navigator.clipboard.writeText("THE BAR LOUNGE — Daily Cipher " + puzzle?.day + " " + (won ? rows.length : "X") + "/6\n" + text); setCopied(true); } catch { setError("Copy is unavailable in this browser."); }
  };
  return <div className={styles.gamePanel + " mx-auto max-w-2xl text-center"}>
    <p className="kicker">The Daily Cipher</p><h1 className="font-display mt-3 text-5xl sm:text-7xl">CRACK THE <span className="text-accent">CODE</span></h1>
    <p className="mt-4 text-slate-200">Six guesses. Orange is the right spot; blue belongs elsewhere. A new puzzle arrives at midnight Eastern.</p>
    <p className="mt-5 text-sm font-semibold text-accent">{puzzle ? "Clue: " + puzzle.clue : "Loading today's puzzle…"}</p>
    <div className="mx-auto mt-8 grid max-w-[340px] gap-2" aria-label="Six-row word guess grid">{Array.from({ length: 6 }, (_, row) => {
      const word = rows[row]?.guess ?? (row === rows.length && !finished ? draft : "");
      return <div key={row} className="grid grid-cols-5 gap-2">{Array.from({ length: 5 }, (_, col) => {
        const tile = rows[row]?.states[col];
        return <span key={col} aria-label={(word[col] || "empty") + (tile ? ", " + tile : "")} className={styles.tile + " " + (tile === "hit" ? styles.tileHit : tile === "near" ? styles.tileNear : tile === "miss" ? styles.tileMiss : "")}>{word[col] || ""}</span>;
      })}</div>;
    })}</div>
    {!finished && <form onSubmit={(e) => { e.preventDefault(); void send(); }} className="mx-auto mt-7 flex max-w-[340px] gap-2"><input aria-label="Five-letter answer" autoComplete="off" autoCapitalize="characters" maxLength={5} value={draft} onChange={(e) => { setDraft(e.target.value.replace(/[^a-z]/gi, "").toUpperCase()); setError(""); }} disabled={!puzzle || loading} className="min-w-0 flex-1 rounded-lg border border-white/20 bg-[#17120e] px-4 py-3 text-center font-bold uppercase tracking-[0.24em] outline-none focus:border-accent" placeholder="TYPE A WORD"/><button disabled={!puzzle || loading} className="rounded-lg bg-accent px-5 font-bold text-[#0a0e17] disabled:opacity-40">{loading ? "…" : "Enter"}</button></form>}
    {error && <p role="alert" className="mt-3 text-sm text-rose-300">{error}</p>}
    {finished && <AwardRound ranked={!!runId} round={{ key: roundKey, mode: "daily", points: won ? (7 - rows.length) * 100 : 0, correct: won ? 1 : 0, total: 1, best: won ? 1 : 0, won }} />}
    {finished && <div role="status" className="mt-7"><RisingBars level={won ? 5 : 1}/><p className={"text-xl font-bold " + (won ? "text-green-300" : "text-rose-300")}>{won ? "Cipher cracked." : "No guesses left."}</p><p className="mt-3 font-display text-4xl text-accent">{answer}</p><div className="mt-5 grid grid-cols-2 gap-3 border-y border-white/15 py-5"><div className="text-2xl font-bold">{won ? (7 - rows.length) * 100 : 0}<span className="block text-xs font-normal text-slate-300">POINTS</span></div><div className="text-2xl font-bold">{rows.length + "/6"}<span className="block text-xs font-normal text-slate-300">GUESSES USED</span></div></div><button onClick={share} className="mt-6 rounded-lg bg-[#316ec3] px-6 py-3 font-bold">{copied ? "Copied ✓" : "Copy Your Scorecard"}</button></div>}
    <Back onExit={onExit}/>
  </div>;
}

function Timer({ seconds, total }: { seconds: number; total: number }) {
  const percent = Math.max(0, Math.min(100, seconds / total * 100));
  return <><div className="relative h-3 rounded-full bg-white/10" role="progressbar" aria-label="Time remaining" aria-valuenow={Math.ceil(seconds)} aria-valuemin={0} aria-valuemax={total}><div className={"h-full rounded-full transition-[width] duration-100 " + (percent > 60 ? "bg-accent" : percent > 30 ? "bg-amber-400" : "bg-rose-500")} style={{ width: percent + "%" }}/><Image src="/images/logo.png" alt="" width={34} height={34} className="absolute top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_0_8px_#ff5a1f]" style={{ left: Math.max(2, percent) + "%" }}/></div><div className="mt-2 flex justify-between text-xs font-semibold uppercase tracking-widest text-muted"><span>The Bar</span><span>{Math.ceil(seconds) + "s"}</span></div></>;
}
function Feedback({ result }: { result: RoundResult }) {
  return <div role="status" className={"mt-5 rounded-lg border p-4 text-center font-bold " + (result.outcome === "correct" ? "border-green-500/60 bg-green-950/70 text-green-200" : "border-rose-500/60 bg-rose-950/70 text-rose-200")}>{outcomeLabel[result.outcome]}{result.outcome === "correct" && <span className={"ml-3 inline-block " + styles.pointPop}>{"+" + result.points + " pts 🔥"}</span>}</div>;
}
function RevealCard({ reveal }: { reveal: Reveal }) {
  return <article className={"mt-6 overflow-hidden rounded-xl border border-white/15 bg-[#171310] " + styles.revealCard}>
    <div className="flex flex-col sm:flex-row">
      {reveal.image ? <div className="relative mx-auto aspect-square w-full max-w-[240px] shrink-0 sm:w-40"><Image src={reveal.image} alt={reveal.title + " artwork"} fill sizes="(min-width:640px) 160px, 240px" className="object-contain"/></div> : <div aria-hidden="true" className="flex w-full items-center justify-center bg-gradient-to-br from-[#5b351a] to-[#17120c] p-5 sm:w-32"><RisingBars level={5}/></div>}
      <div className="p-5"><p className="kicker">The Reveal</p><h2 className="mt-2 text-2xl font-bold text-accent">{reveal.title}</h2><p className="mt-3 text-sm leading-6 text-slate-200">{reveal.context}</p>{reveal.sourceUrl && <a href={reveal.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-xs font-semibold text-slate-300 underline decoration-accent underline-offset-4">{reveal.sourceLabel + " ↗"}</a>}</div>
    </div>
  </article>;
}
function Scorecard({ title, roundKey, ranked, results, onReplay, onExit }: { title: string; roundKey: string; ranked: boolean; results: RoundResult[]; onReplay: () => void; onExit: () => void }) {
  const [copied, setCopied] = useState(false);
  const points = results.reduce((sum, r) => sum + r.points, 0), correct = results.filter((r) => r.outcome === "correct").length;
  const tier = tierIndex(correct, results.length);
  let best = 0, current = 0;
  for (const r of results) { current = r.outcome === "correct" ? current + 1 : 0; best = Math.max(best, current); }
  const share = async () => { try { await navigator.clipboard.writeText("THE BAR LOUNGE — " + title + "\n" + correct + "/" + results.length + " · " + points + " pts\n" + results.map((r) => r.outcome === "correct" ? "🟧" : "🟥").join("")); setCopied(true); } catch { setCopied(false); } };
  return <div className={styles.gamePanel + " mx-auto max-w-3xl"}>
    <AwardRound ranked={ranked} round={{ key: roundKey, mode: title === "Raise the Bar" ? "practice" : "clues", points, correct, total: results.length, best }} />
    <div className="text-center"><RisingBars level={tier + 1}/><p className="kicker">{title + " / Your Scorecard"}</p><h1 className="font-display mt-3 text-5xl text-accent">{correct + "/" + results.length + " CORRECT"}</h1></div>
    <div className="my-8 grid grid-cols-3 gap-2 border-y border-white/15 py-6 text-center">{[[points, "POINTS"], [correct + "/" + results.length, "CORRECT"], [best, "BEST STREAK"]].map(([value, label]) => <div key={label}><strong className="block text-3xl">{value}</strong><span className="text-[10px] tracking-widest text-slate-300">{label}</span></div>)}</div>
    <div className="grid gap-3">{results.map((r, i) => <details key={r.id} className="rounded-lg border border-white/15 bg-[#171310] p-4"><summary className="cursor-pointer list-none"><div className="flex items-start justify-between gap-4"><div><span className={"text-xs font-bold " + (r.outcome === "correct" ? "text-green-300" : "text-rose-300")}>{"0" + (i + 1) + " / " + outcomeLabel[r.outcome]}</span><p className="mt-1 text-sm font-semibold">{r.prompt}</p></div><span className="shrink-0 text-sm font-bold text-accent">{r.points + " pts"}</span></div></summary><p className="mt-4 text-xs text-slate-300">{"Your answer: " + (r.submitted || "No answer") + " · " + r.seconds.toFixed(1) + "s"}</p><RevealCard reveal={r.reveal}/></details>)}</div>
    <button onClick={share} className="mt-7 w-full rounded-lg bg-[#316ec3] px-6 py-4 font-bold">{copied ? "Copied ✓" : "Copy My Scorecard"}</button><button onClick={onReplay} className="btn-accent mt-3 w-full rounded-lg px-6 py-4 font-bold text-[#0a0e17]">Play a Fresh Round →</button><Back onExit={onExit}/>
  </div>;
}
function Back({ onExit }: { onExit: () => void }) { return <div className="text-center"><button onClick={onExit} className="mt-8 text-sm text-slate-300 underline decoration-accent underline-offset-4">Back to The Bar Lounge</button></div>; }
function RisingBars({ level, hero = false }: { level: number; hero?: boolean }) {
  return <div aria-label={"Bar level " + level + " of 5"} className={styles.risingBars + (hero ? " " + styles.heroBars : "")}>{[1, 2, 3, 4, 5].map((bar) => <span key={bar} className={styles.risingBar + (bar <= level ? " " + styles.risingActive : "")} style={{ height: (23 + bar * 15) + "%", animationDelay: bar * 90 + "ms" }}/>)}</div>;
}
