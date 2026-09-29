"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./lounge.module.css";

// This is the supplied client-side flow for review. Production rounds need
// server-owned questions, timing, answer validation, and persistent scores.
const QUESTIONS = [
  { type: "Finish the Bar", q: "From the corner to the stage, I brought the whole ___", options: ["block", "show", "crew", "beat"], answer: 0 },
  { type: "On the Record", q: "What year did Nas release his debut album, Illmatic?", options: ["1992", "1993", "1994", "1996"], answer: 2 },
  { q: "Which crew dropped Enter the Wu-Tang (36 Chambers) in 1993?", options: ["Mobb Deep", "Wu-Tang Clan", "EPMD", "Gang Starr"], answer: 1 },
  { q: "Madvillainy (2004) paired Madlib with which MC?", options: ["Quasimoto", "MF DOOM", "Guilty Simpson", "J Dilla"], answer: 1 },
  { q: "Run the Jewels is made up of Killer Mike and…", options: ["Big Boi", "El-P", "Mr. Muhammad", "Havoc"], answer: 1 },
  { q: "Pimp C and Bun B formed which Texas duo?", options: ["Geto Boys", "8Ball & MJG", "UGK", "Scarface"], answer: 2 },
  { q: "OutKast's Aquemini was released in what year?", options: ["1996", "1998", "2000", "1994"], answer: 1 },
  { q: "Who produced 'The World Is Yours' on Illmatic?", options: ["DJ Premier", "Pete Rock", "Large Professor", "Q-Tip"], answer: 1 },
] as const;

const TIERS = ["On The Radio", "The Mixtape", "Deep Cuts", "The Vault", "Broadway's Floor"];
type Outcome = "correct" | "wrong" | "void";
type Screen = "start" | "playing" | "result";

function tierFor(correct: number) {
  const ratio = correct / QUESTIONS.length;
  return TIERS[ratio >= 0.9 ? 4 : ratio >= 0.7 ? 3 : ratio >= 0.5 ? 2 : ratio >= 0.3 ? 1 : 0];
}

export default function BarLoungeDemo() {
  const [mode, setMode] = useState<"lobby" | "cipher" | "ranked">("lobby");
  const [screen, setScreen] = useState<Screen>("start");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [results, setResults] = useState<Outcome[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [remaining, setRemaining] = useState(10);
  const [copied, setCopied] = useState(false);
  const endAt = useRef(0);
  const lockedRef = useRef(false);
  const nextTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scoreRef = useRef(0);
  const streakRef = useRef(0);

  const startQuestion = useCallback((next: number) => {
    setIndex(next);
    setSelected(null);
    setLocked(false);
    lockedRef.current = false;
    endAt.current = performance.now() + 10000;
    setRemaining(10);
  }, []);

  const start = () => {
    setMode("ranked");
    if (nextTimer.current) clearTimeout(nextTimer.current);
    scoreRef.current = 0;
    streakRef.current = 0;
    setScore(0);
    setStreak(0);
    setResults([]);
    setCopied(false);
    startQuestion(0);
    setScreen("playing");
  };

  const settle = useCallback((outcome: Outcome, choice: number | null) => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setLocked(true);
    setSelected(choice);
    if (outcome === "correct") {
      const seconds = Math.max(0, (endAt.current - performance.now()) / 1000);
      const points = 100 + Math.round(seconds * 15) + (streakRef.current >= 2 ? 50 : 0);
      scoreRef.current += points;
      streakRef.current += 1;
      setScore(scoreRef.current);
      setStreak(streakRef.current);
    } else {
      streakRef.current = 0;
      setStreak(0);
    }
    setResults((previous) => [...previous, outcome]);
    nextTimer.current = setTimeout(() => {
      if (index + 1 === QUESTIONS.length) setScreen("result");
      else startQuestion(index + 1);
    }, outcome === "void" ? 1250 : 950);
  }, [index, startQuestion]);

  useEffect(() => {
    if (screen !== "playing" || locked) return;
    const tick = () => {
      const seconds = Math.max(0, (endAt.current - performance.now()) / 1000);
      setRemaining(seconds);
      if (seconds === 0) settle("wrong", null);
    };
    const timer = setInterval(tick, 100);
    return () => clearInterval(timer);
  }, [screen, index, locked, settle]);

  useEffect(() => {
    if (screen !== "playing" || locked) return;
    const onBlur = () => settle("void", null);
    const onVisibility = () => { if (document.hidden) onBlur(); };
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [screen, index, locked, settle]);

  useEffect(() => () => { if (nextTimer.current) clearTimeout(nextTimer.current); }, []);

  const correct = results.filter((result) => result === "correct").length;
  const question = QUESTIONS[index];
  const percent = Math.max(0, remaining * 10);
  const tierIndex = Math.max(0, TIERS.indexOf(tierFor(correct)));
  const share = async () => {
    const row = results.map((result) => result === "correct" ? "🟧" : "⬛").join("");
    const message = `THE BAR LOUNGE — Round Preview\n${tierFor(correct)} · ${correct}/${QUESTIONS.length}\n${row}`;
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { setCopied(false); }
  };

  return (
    <section className={`relative isolate min-h-screen overflow-hidden px-5 pb-24 pt-28 sm:pt-36 ${styles.stage}`}>
      <div aria-hidden="true" className={styles.performer} />
      <div aria-hidden="true" className={styles.crowd} />
      <div aria-hidden="true" className={styles.stageWash} />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300"><span>The Bar Lounge / Broadway the Lyricist</span><span className="text-accent">Gameplay preview · scores are not saved</span></div>

        {mode === "lobby" && <div className="mx-auto max-w-4xl text-center">
          <div className="relative py-7"><RisingBars level={5} hero /><p className="kicker relative z-10 mb-2">Raise Your Bar</p><h1 className="font-display relative z-10 text-[clamp(4rem,11vw,9rem)] leading-[0.86] tracking-wide text-white">THE BAR<br/><span className="text-accent">LOUNGE</span></h1></div>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-slate-200">One room. Two ways in. Decode the daily Hip-Hop cipher, or step up for a timed round that tests what you know.</p>
          <div className="mx-auto mt-10 grid max-w-3xl gap-4 text-left md:grid-cols-2">
            <button onClick={() => setMode("cipher")} className={`${styles.modeCard} group`}><span className="kicker">01 / The Free Daily Game</span><strong className="font-display mt-5 block text-4xl">THE DAILY CIPHER</strong><span className="mt-3 block text-sm leading-6 text-slate-300">Six guesses. Five letters. Read the tiles, find the Hip-Hop answer.</span><span className="mt-7 inline-block text-sm font-bold text-accent group-hover:translate-x-1 transition-transform">Play the Cipher →</span></button>
            <button onClick={start} className={`${styles.modeCard} group`}><span className="kicker">02 / The Timed Round</span><strong className="font-display mt-5 block text-4xl">RAISE THE BAR</strong><span className="mt-3 block text-sm leading-6 text-slate-300">Finish a sample bar, test your knowledge, build a streak and climb the working ranks.</span><span className="mt-7 inline-block text-sm font-bold text-accent group-hover:translate-x-1 transition-transform">Enter the Round →</span></button>
          </div>
          <p className="mt-5 text-xs text-slate-400">These are two gameplay concepts for review. Tier names and content are still being developed.</p>
        </div>}

        {mode === "cipher" && <DailyCipher onExit={() => setMode("lobby")} />}

        {mode === "ranked" && screen === "playing" && <div className={`${styles.gamePanel} mx-auto max-w-2xl`}>
          <RisingBars level={Math.max(1, Math.min(5, Math.ceil((index + 1) / 2)))} />
          <p className="kicker mb-4 text-center">Bar {index + 1} / {QUESTIONS.length} · {TIERS[Math.max(0, Math.min(4, Math.floor(index * 5 / QUESTIONS.length)))]}</p>
          <div className="mb-5 flex items-center justify-between gap-3"><div className="flex gap-1.5" aria-label={`Question ${index + 1} of ${QUESTIONS.length}`}>{QUESTIONS.map((_, i) => <span key={i} className={`h-1 w-5 rounded-full ${i < index ? "bg-blue-400" : i === index ? "bg-accent" : "bg-white/15"}`} />)}</div><span className="text-sm font-semibold">🔥 {streak} <span className="ml-3 text-accent">{score} pts</span></span></div>
          <div className="relative h-3 overflow-visible rounded-full bg-white/10" role="progressbar" aria-label="Time remaining" aria-valuenow={Math.ceil(remaining)} aria-valuemin={0} aria-valuemax={10}><div className={`h-full rounded-full transition-[width] duration-100 ${remaining > 6 ? "bg-accent" : remaining > 3 ? "bg-amber-400" : "bg-rose-500"}`} style={{ width: `${percent}%` }} /><Image src="/images/logo.png" alt="" width={34} height={34} className="absolute top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_0_8px_#ff5a1f]" style={{ left: `${Math.max(2, percent)}%` }} /></div>
          <div className="mt-2 flex justify-between text-xs font-semibold uppercase tracking-widest text-muted"><span>The Bar</span><span>{Math.ceil(remaining)}s</span></div>
          <p className="kicker mt-9">{"type" in question ? question.type : "Hip-Hop Knowledge"}{index === 0 && <span className="ml-2 normal-case tracking-normal text-slate-400">/ original demo line</span>}</p>
          <h2 className="mt-3 min-h-24 text-2xl font-bold leading-snug sm:text-3xl">{question.q}</h2>
          <div className="mt-6 grid gap-3">{question.options.map((option, choice) => {
            const right = locked && choice === question.answer;
            const wrong = locked && choice === selected && choice !== question.answer;
            return <button key={option} onClick={() => settle(choice === question.answer ? "correct" : "wrong", choice)} disabled={locked} className={`rounded-xl border px-5 py-4 text-left font-semibold transition-colors ${right ? "border-green-500 bg-green-950/70 text-green-200" : wrong ? "border-rose-500 bg-rose-950/70 text-rose-200" : "border-white/10 bg-[#14213a] hover:border-accent/60"} disabled:cursor-default`}>{option}{right && " ✓"}{wrong && " ×"}</button>;
          })}</div>
          {locked && results.at(-1) === "correct" && <p role="status" className={styles.pointBurst}>+ POINTS · BAR RAISED</p>}
          {locked && results.at(-1) === "void" && <p role="status" className="mt-5 text-center font-semibold text-rose-300">Tab left. This question is void.</p>}
        </div>}

        {mode === "ranked" && screen === "result" && <div className={`${styles.gamePanel} mx-auto max-w-2xl text-center`}>
          <RisingBars level={tierIndex + 1} />
          <p className="kicker">You Reached</p>
          <h1 className="font-display mt-3 text-5xl text-accent sm:text-7xl">{tierFor(correct)}</h1>
          <p className="mt-4 text-xl">{correct}/{QUESTIONS.length} correct <span className="mx-2 text-muted">·</span> {score} points</p>
          <div className="mt-6 flex justify-center gap-2" aria-label={`${correct} correct answers`}>{results.map((result, i) => <span key={i} className={`h-6 w-6 rounded ${result === "correct" ? "bg-accent" : "border border-white/20 bg-white/10"}`} />)}</div>
          <div className="mt-10 rounded-2xl border border-white/10 bg-[#14213a] p-6 text-left sm:p-8"><h2 className="text-xl font-bold">Come back and defend your rank</h2><p className="mt-2 leading-7 text-muted">The full daily round will let you claim a leaderboard place and choose whether to get the next challenge by email.</p><p className="mt-5 text-sm font-semibold text-accent">Email signup and leaderboard open when the game launches.</p></div>
          <button onClick={share} className="mt-6 w-full rounded-lg bg-[#316ec3] px-6 py-4 font-bold transition-colors hover:bg-[#4388e1]">{copied ? "Copied ✓" : "Copy result to share"}</button>
          <button onClick={start} className="mt-3 w-full rounded-lg border border-white/20 px-6 py-4 font-semibold text-muted transition-colors hover:border-accent hover:text-white">Play Again</button>
          <button onClick={() => setMode("lobby")} className="mt-4 text-sm text-slate-300 underline decoration-accent underline-offset-4">Back to The Bar Lounge</button>
          <p className="mt-6 text-xs leading-5 text-muted">Preview only: questions and scores run in this browser. Results are not ranked or stored.</p>
        </div>}
      </div>
    </section>
  );
}

function RisingBars({ level, hero = false }: { level: number; hero?: boolean }) {
  return <div aria-label={`Bar level ${level} of 5`} className={`${styles.risingBars} ${hero ? styles.heroBars : ""}`}>
    {[1, 2, 3, 4, 5].map((bar) => <span key={bar} className={`${styles.risingBar} ${bar <= level ? styles.risingActive : ""}`} style={{ height: `${23 + bar * 15}%`, animationDelay: `${bar * 90}ms` }} />)}
  </div>;
}

const CIPHER_ANSWER = "VINYL";
const CIPHER_TURNS = 6;
type TileState = "hit" | "near" | "miss";

function markGuess(guess: string): TileState[] {
  const remaining = CIPHER_ANSWER.split("");
  const states: TileState[] = Array(5).fill("miss");
  for (let i = 0; i < 5; i++) if (guess[i] === remaining[i]) { states[i] = "hit"; remaining[i] = ""; }
  for (let i = 0; i < 5; i++) if (states[i] !== "hit") {
    const other = remaining.indexOf(guess[i]);
    if (other >= 0) { states[i] = "near"; remaining[other] = ""; }
  }
  return states;
}

function DailyCipher({ onExit }: { onExit: () => void }) {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const won = guesses.includes(CIPHER_ANSWER);
  const finished = won || guesses.length >= CIPHER_TURNS;
  const send = () => {
    if (finished) return;
    if (draft.length !== 5) { setError("Enter five letters to lock in a guess."); return; }
    setGuesses((list) => [...list, draft]); setDraft(""); setError("");
  };
  const share = async () => {
    const row = guesses.map((guess) => markGuess(guess).map((tile) => tile === "hit" ? "🟧" : tile === "near" ? "🟦" : "⬛").join("")).join("\n");
    try { await navigator.clipboard.writeText(`THE BAR LOUNGE — Daily Cipher Preview ${won ? guesses.length : "X"}/6\n${row}`); setCopied(true); } catch { setCopied(false); }
  };
  return <div className={`${styles.gamePanel} mx-auto max-w-2xl text-center`}>
    <p className="kicker">01 / The Daily Cipher</p>
    <h1 className="font-display mt-3 text-5xl sm:text-7xl">CRACK THE <span className="text-accent">CODE</span></h1>
    <p className="mx-auto mt-4 max-w-lg text-slate-200">Six guesses to find a five-letter Hip-Hop answer. Orange means the right spot; blue means the letter belongs elsewhere.</p>
    <p className="mt-5 text-sm font-semibold text-accent">Clue: The format DJs still dig through crates for.</p>
    <div className="mx-auto mt-8 grid max-w-[340px] gap-2" aria-label="Six-row word guess grid">{Array.from({ length: CIPHER_TURNS }, (_, row) => {
      const word = guesses[row] ?? (row === guesses.length && !finished ? draft : "");
      const states = guesses[row] ? markGuess(guesses[row]) : [];
      return <div key={row} className="grid grid-cols-5 gap-2">{Array.from({ length: 5 }, (_, col) => <span key={col} aria-label={`${word[col] ?? "empty"}${states[col] ? `, ${states[col]}` : ""}`} className={`${styles.tile} ${states[col] === "hit" ? styles.tileHit : states[col] === "near" ? styles.tileNear : states[col] === "miss" ? styles.tileMiss : ""}`}>{word[col] ?? ""}</span>)}</div>;
    })}</div>
    {!finished && <form onSubmit={(event) => { event.preventDefault(); send(); }} className="mx-auto mt-7 flex max-w-[340px] gap-2"><input aria-label="Five-letter answer" autoComplete="off" autoCapitalize="characters" maxLength={5} value={draft} onChange={(event) => { setDraft(event.target.value.replace(/[^a-z]/gi, "").toUpperCase()); setError(""); }} className="min-w-0 flex-1 rounded-lg border border-white/20 bg-[#0b172b] px-4 py-3 text-center font-bold uppercase tracking-[0.24em] outline-none focus:border-accent" placeholder="TYPE A WORD" /><button className="rounded-lg bg-accent px-5 font-bold text-[#0a0e17]">Enter</button></form>}
    {error && <p role="alert" className="mt-3 text-sm text-rose-300">{error}</p>}
    {finished && <div role="status" className="mt-7"><RisingBars level={won ? 5 : 1} /><p className="mt-3 text-xl font-bold">{won ? `Bar raised in ${guesses.length} ${guesses.length === 1 ? "guess" : "guesses"}.` : `The answer was ${CIPHER_ANSWER}.`}</p><p className="mt-2 text-sm text-slate-300">This is one sample puzzle. The live game will rotate verified daily content.</p><button onClick={share} className="mt-6 rounded-lg bg-[#316ec3] px-6 py-3 font-bold">{copied ? "Copied ✓" : "Copy your tile result"}</button></div>}
    <div><button onClick={onExit} className="mt-8 text-sm text-slate-300 underline decoration-accent underline-offset-4">Back to The Bar Lounge</button></div>
  </div>;
}
