"use client";

import Image from "next/image";
import styles from "./lounge.module.css";
import { XP_TIERS } from "@/lib/bar-lounge/progression";

export const TIERS = ["On The Radio", "In The Whip", "On The Block", "In The Crates", "Broadway's Floor"];
export type LoungeIconName = "calendar" | "record" | "bars" | "barsSolid" | "fire" | "score" | "radio" | "car" | "city" | "crate" | "crown";

/**
 * The rising-bars mark in "THE BAR LOUNGE" wordmark. Proportions follow the
 * brand mockup, measured against the capital height of "BAR" (= 100): five
 * bars 21 wide with 11 gaps, rising 23 / 42 / 70 / 104 / 136. The first bar is
 * a small square that reads like a period; the tallest clears the letters.
 * The bars share a flat base so they sit on the text baseline.
 */
export function LoungeBarsMark({ className }: { className?: string }) {
  const heights = [23, 42, 70, 104, 136];
  return (
    <svg viewBox="0 0 149 136" aria-hidden="true" className={className}>
      {heights.map((h, i) => (
        <rect key={h} x={i * 32} y={136 - h} width="21" height={h} fill="currentColor" />
      ))}
    </svg>
  );
}

export function LoungeIcon({ name, className }: { name: LoungeIconName; className?: string }) {
  const paths: Record<LoungeIconName, React.ReactNode> = {
    calendar: <><rect x="5" y="8" width="30" height="28" rx="3"/><path d="M12 4v9M28 4v9M5 17h30M12 24h4M24 24h4M12 30h4M24 30h4"/></>,
    record: <><circle cx="20" cy="20" r="16"/><circle cx="20" cy="20" r="5"/><path d="M20 9a11 11 0 0 1 11 11M20 13a7 7 0 0 1 7 7M9 20a11 11 0 0 0 11 11M13 20a7 7 0 0 0 7 7"/></>,
    bars: <>{Array.from({ length: 5 }, (_, i) => <rect key={i} x={3 + i * 7} y={28 - i * 6} width="5" height={8 + i * 6} rx=".5" fill="none" stroke="var(--color-accent)"/>)}</>,
    barsSolid: <>{Array.from({ length: 5 }, (_, i) => <rect key={i} x={2 + i * 7} y={28 - i * 6} width="5.8" height={8 + i * 6} rx=".7" fill="var(--color-accent)" stroke="none"/>)}</>,
    fire: <path d="M23 3c1 9-5 10-5 17-3-1-4-4-4-8-5 6-8 12-6 18 3 10 22 11 25-1 2-8-2-14-7-18 1 6-2 8-4 9 2-6 3-11 1-17Z"/>,
    score: <><path d="m20 3 15 6v12c0 8-8 13-15 17C13 34 5 29 5 21V9Z"/><path d="m12 21 5 5 11-12"/></>,
    radio: <><rect x="4" y="16" width="32" height="19" rx="2"/><path d="m9 16 20-11M8 20h10v5H8zM8 29h10M26 21v9M22 24h8"/></>,
    car: <><path d="m6 22 5-10h18l5 10v10H6ZM6 23h28M12 27h2M26 27h2M9 32v4M31 32v4"/></>,
    city: <><path d="M5 36V15h9v21M17 36V5h10v31M30 36V21h6v15M8 20h3M8 25h3M8 30h3M20 10h4M20 16h4M20 22h4M20 28h4"/></>,
    crate: <><path d="m5 14 15-8 15 8v20H5ZM5 14h30M10 18v12M15 18v12M20 18v12M25 18v12M30 18v12M12 10v4M20 6v8M28 10v4"/></>,
    crown: <><path d="m5 12 8 8 7-14 7 14 8-8-4 20H9ZM9 36h22"/></>,
  };
  return <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" data-lounge-icon={name} className={className}>{paths[name]}</svg>;
}

export default function LoungeLobby({ onPlay }: { onPlay: (mode: "cipher" | "practice" | "clues") => void }) {
  return <>
    <div className={styles.loungeHero}>
      <div aria-hidden="true" className={styles.heroPortrait}><Image src="/images/bar-lounge-hero.png" alt="" fill sizes="(min-width:900px) 850px, 130vw" className="object-contain object-center" priority /></div>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow + " font-display"}>Welcome To</p>
        <h1 className="font-display">THE BAR <span>LOUNGE</span></h1>
        <p className={styles.heroDescription}>Test your Hip-Hop knowledge.<br/>Catch the clues. Finish the bar.<br/>Raise the standard, one round at a time.</p>
        <div className={styles.heroActions}>
          <button onClick={() => onPlay("cipher")} className={styles.primaryAction}><LoungeIcon name="calendar"/>Play Daily Cipher</button>
          <a href="#lounge-modes" className={styles.secondaryAction}>Choose a Mode <span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <div aria-hidden="true" className={styles.heroSignature}>RAISE THE BAR <span>EVERY DAY.</span></div>
    </div>

    <div id="lounge-modes" className={styles.dashboard}>
      <div>
        <h2 className={styles.panelHeading + " font-display"}>Choose Your Mode</h2>
        <div className={styles.modeGrid}>
          {[
            { mode: "cipher" as const, icon: "calendar" as const, title: "Daily Cipher", note: "One daily puzzle. Five letters. Six guesses.", action: "Play Today" },
            { mode: "practice" as const, icon: "bars" as const, title: "Raise the Bar", note: "Knowledge and original practice bars. Eight questions.", action: "Start a Round" },
            { mode: "clues" as const, icon: "record" as const, title: "Name That Legend", note: "Five clues. One guess. Earlier earns more.", action: "Read the Room" },
          ].map((item) => <button key={item.mode} onClick={() => onPlay(item.mode)} className={styles.loungeMode}>
            <LoungeIcon name={item.icon}/><h3 className="font-display">{item.title}</h3><p>{item.note}</p><span className={styles.modeAction}>{item.action} <span aria-hidden="true">→</span></span>
          </button>)}
        </div>
      </div>
      <div className={styles.tierPanel}>
        <h2 className={styles.panelHeading + " font-display"}>Raise Your Level</h2>
        <div className={styles.tierGrid}>
          {TIERS.map((name, i) => <div key={name} className={styles.tierTile} style={{ "--tier-color": ["#69a147", "#cf9a30", "#d5742c", "#be4a35", "#9a68b3"][i] } as React.CSSProperties}>
            <strong className="font-display">{i + 1}</strong><span className="font-display">{name}</span><LoungeIcon name={(["radio", "car", "city", "crate", "crown"] as const)[i]}/><small>{XP_TIERS[i].xp.toLocaleString()}+ XP</small>
          </div>)}
        </div>
        <p className={styles.tierNote}>Your total XP raises your tier across all three modes. Each finished round earns 25 XP, plus 1 XP per 10 points.</p>
      </div>
    </div>

    <div className={styles.featureStrip}>
      {[
        { icon: "score" as const, title: "Earn Your Score", note: "Accuracy, speed and streaks." },
        { icon: "fire" as const, title: "Build a Streak", note: "Keep the right answers coming." },
        { icon: "bars" as const, title: "Raise Your Bar", note: "Five levels. Prove your range." },
        { icon: "record" as const, title: "See the Reveal", note: "The answer, artwork and context." },
      ].map((item) => <div key={item.title}><LoungeIcon name={item.icon}/><span><strong className="font-display">{item.title}</strong><small>{item.note}</small></span></div>)}
    </div>
    <div className={styles.loungeFootnote}><span>Free to play. Guest progress stays in this browser.</span><span>Lyric examples are original practice lines.</span></div>
  </>;
}
