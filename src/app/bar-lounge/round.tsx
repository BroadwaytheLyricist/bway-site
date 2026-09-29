"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// This is the supplied client-side flow for review. Production rounds need
// server-owned questions, timing, answer validation, and persistent scores.
const QUESTIONS = [
  { q: "What year did Nas release his debut album, Illmatic?", options: ["1992", "1993", "1994", "1996"], answer: 2 },
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
    <section className="relative isolate min-h-[82vh] overflow-hidden px-5 pb-24 pt-32 sm:pt-40">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,#1a3152_0%,#0d1931_45%,#0a0e17_85%)]" />
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 border-b border-white/10 pb-4 text-center text-xs font-semibold uppercase tracking-[0.23em] text-accent">Private gameplay preview · Scores are not saved</div>

        {screen === "start" && <div className="text-center">
          <p className="kicker mb-3">The Daily Round</p>
          <h1 className="font-display text-6xl leading-none sm:text-8xl">The Bar <span className="text-accent">Lounge</span></h1>
          <p className="mx-auto mt-7 max-w-lg text-lg leading-8 text-muted">Seven questions. Ten seconds each. The bar drains while you decide. Correct answers, speed, and streaks build your score.</p>
          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-white/10 bg-[#111d32]/85 p-6 text-left">
            <p className="kicker mb-4">Working rank ladder</p>
            {TIERS.map((tier, i) => <div key={tier} className="flex justify-between border-t border-white/10 py-3 text-sm"><span><span className="mr-4 text-accent">0{i + 1}</span>{tier}</span>{i === 4 && <span className="text-accent">★</span>}</div>)}
          </div>
          <button onClick={start} className="btn-accent mt-8 rounded-lg px-9 py-4 font-bold text-[#0a0e17] transition-transform hover:scale-[1.03]">Start Round →</button>
          <p className="mt-4 text-sm text-muted">Free to play. No signup to see your score.</p>
        </div>}

        {screen === "playing" && <div className="mx-auto max-w-xl">
          <div className="mb-5 flex items-center justify-between gap-3"><div className="flex gap-1.5" aria-label={`Question ${index + 1} of ${QUESTIONS.length}`}>{QUESTIONS.map((_, i) => <span key={i} className={`h-1 w-5 rounded-full ${i < index ? "bg-blue-400" : i === index ? "bg-accent" : "bg-white/15"}`} />)}</div><span className="text-sm font-semibold">🔥 {streak} <span className="ml-3 text-accent">{score} pts</span></span></div>
          <div className="h-3 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="Time remaining" aria-valuenow={Math.ceil(remaining)} aria-valuemin={0} aria-valuemax={10}><div className={`h-full transition-[width] duration-100 ${remaining > 6 ? "bg-accent" : remaining > 3 ? "bg-amber-400" : "bg-rose-500"}`} style={{ width: `${percent}%` }} /></div>
          <div className="mt-2 flex justify-between text-xs font-semibold uppercase tracking-widest text-muted"><span>The Bar</span><span>{Math.ceil(remaining)}s</span></div>
          <h2 className="mt-9 min-h-24 text-2xl font-bold leading-snug sm:text-3xl">{question.q}</h2>
          <div className="mt-6 grid gap-3">{question.options.map((option, choice) => {
            const right = locked && choice === question.answer;
            const wrong = locked && choice === selected && choice !== question.answer;
            return <button key={option} onClick={() => settle(choice === question.answer ? "correct" : "wrong", choice)} disabled={locked} className={`rounded-xl border px-5 py-4 text-left font-semibold transition-colors ${right ? "border-green-500 bg-green-950/70 text-green-200" : wrong ? "border-rose-500 bg-rose-950/70 text-rose-200" : "border-white/10 bg-[#14213a] hover:border-accent/60"} disabled:cursor-default`}>{option}{right && " ✓"}{wrong && " ×"}</button>;
          })}</div>
          {locked && results.at(-1) === "void" && <p role="status" className="mt-5 text-center font-semibold text-rose-300">Tab left. This question is void.</p>}
        </div>}

        {screen === "result" && <div className="mx-auto max-w-xl text-center">
          <p className="kicker">You Reached</p>
          <h1 className="font-display mt-3 text-5xl text-accent sm:text-7xl">{tierFor(correct)}</h1>
          <p className="mt-4 text-xl">{correct}/{QUESTIONS.length} correct <span className="mx-2 text-muted">·</span> {score} points</p>
          <div className="mt-6 flex justify-center gap-2" aria-label={`${correct} correct answers`}>{results.map((result, i) => <span key={i} className={`h-6 w-6 rounded ${result === "correct" ? "bg-accent" : "border border-white/20 bg-white/10"}`} />)}</div>
          <div className="mt-10 rounded-2xl border border-white/10 bg-[#14213a] p-6 text-left sm:p-8"><h2 className="text-xl font-bold">Come back and defend your rank</h2><p className="mt-2 leading-7 text-muted">The full daily round will let you claim a leaderboard place and choose whether to get the next challenge by email.</p><p className="mt-5 text-sm font-semibold text-accent">Email signup and leaderboard open when the game launches.</p></div>
          <button onClick={share} className="mt-6 w-full rounded-lg bg-[#316ec3] px-6 py-4 font-bold transition-colors hover:bg-[#4388e1]">{copied ? "Copied ✓" : "Copy result to share"}</button>
          <button onClick={start} className="mt-3 w-full rounded-lg border border-white/20 px-6 py-4 font-semibold text-muted transition-colors hover:border-accent hover:text-white">Play Again</button>
          <p className="mt-6 text-xs leading-5 text-muted">Preview only: questions and scores run in this browser. Results are not ranked or stored.</p>
        </div>}
      </div>
    </section>
  );
}
