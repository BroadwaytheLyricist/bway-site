"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { BADGES, EMPTY_STATS, XP_TIERS, addRound, earnedBadges, tierForXP, xpForRound, type CompletedRound, type PlayerStats } from "@/lib/bar-lounge/progression";
import styles from "./lounge.module.css";
type Player = PlayerStats & { id: string; display_name: string; newsletter_consent_at: string | null; kit_synced_at: string | null };
type Guest = { stats: PlayerStats; keys: string[] };
const GUEST_KEY = "bar-lounge-progress-v1";
const Progress = createContext<{ stats: PlayerStats; player: Player | null; configured: boolean; kitConfigured: boolean; ready: boolean; error: string; refresh: () => Promise<void>; award: (round: CompletedRound, ranked: boolean) => void }>({ stats: EMPTY_STATS, player: null, configured: false, kitConfigured: false, ready: false, error: "", refresh: async () => {}, award: () => {} });
export async function playerApi<T>(path: string, body?: object): Promise<T> {
  const response = await fetch("/api/bar-lounge/" + path, { cache: "no-store", ...(body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}) });
  const data = await response.json(); if (!response.ok) throw new Error(data.error || "Unable to load player records."); return data as T;
}
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [guest, setGuest] = useState<Guest>({ stats: EMPTY_STATS, keys: [] });
  const [player, setPlayer] = useState<Player | null>(null), [ready, setReady] = useState(false), [configured, setConfigured] = useState(false), [kitConfigured, setKitConfigured] = useState(false), [error, setError] = useState("");
  const refresh = useCallback(async () => {
    try { const data = await playerApi<{ configured: boolean; kitConfigured: boolean; player: Player | null }>("profile"); setPlayer(data.player); setConfigured(data.configured); setKitConfigured(data.kitConfigured); setError(""); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to load profile."); }
  }, []);
  useEffect(() => {
    const hydrate = setTimeout(() => {
    try { const saved = JSON.parse(localStorage.getItem(GUEST_KEY) || "null"); if (saved?.stats && Array.isArray(saved.keys) && Array.isArray(saved.stats.modes) && Object.entries(EMPTY_STATS).every(([k, v]) => Array.isArray(v) || typeof saved.stats[k] === "number" && Number.isFinite(saved.stats[k]) && saved.stats[k] >= 0)) setGuest(saved); } catch {}
    setReady(true); void refresh();
    }, 0);
    const sync = (event: StorageEvent) => { if (event.key === GUEST_KEY) { try { const saved = JSON.parse(event.newValue || "null"); if (saved?.stats && Array.isArray(saved.keys)) setGuest(saved); } catch {} } };
    window.addEventListener("storage", sync); return () => { clearTimeout(hydrate); window.removeEventListener("storage", sync); };
  }, [refresh]);
  const award = useCallback((round: CompletedRound, ranked: boolean) => {
    if (ranked) { void refresh(); return; }
    setGuest((previous) => {
      if (previous.keys.includes(round.key)) return previous;
      const next = { stats: addRound(previous.stats, round), keys: [...previous.keys, round.key] };
      try { localStorage.setItem(GUEST_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [refresh]);
  return <Progress.Provider value={{ stats: player ?? guest.stats, player, ready, configured, kitConfigured, error, refresh, award }}>{children}</Progress.Provider>;
}
export function AwardRound({ round, ranked }: { round: CompletedRound; ranked: boolean }) {
  const { award, ready } = useContext(Progress);
  const { key, mode, points, correct, total, best, won } = round;
  useEffect(() => { if (ready) award({ key, mode, points, correct, total, best, won }, ranked); }, [ready, award, key, mode, points, correct, total, best, won, ranked]);
  return <p className="mt-5 text-center font-semibold text-accent">+{xpForRound(round)} XP <span className="font-normal text-slate-300">{ranked ? "saved to your player profile" : "earned on this browser"}</span></p>;
}
export function ProgressSummary({ onOpen }: { onOpen: () => void }) {
  const { stats, player, ready } = useContext(Progress), level = tierForXP(stats.xp), next = XP_TIERS[level + 1];
  return <div className={styles.progressSummary}><div><p className="kicker">{player?.display_name || "Your Progress"}</p><strong className="font-display">{XP_TIERS[level].name}</strong><span>{ready ? stats.xp.toLocaleString() : "…"} XP {next ? `· ${Math.max(0, next.xp - stats.xp).toLocaleString()} to next tier` : "· Top tier"}</span></div><button onClick={onOpen} className={styles.secondaryAction}>My Stats &amp; Badges</button></div>;
}
export function PlayerHub() {
  const { stats, player, configured, kitConfigured, error, refresh } = useContext(Progress);
  const [email, setEmail] = useState(""), [name, setName] = useState(""), [code, setCode] = useState(""), [sent, setSent] = useState(false), [busy, setBusy] = useState(false), [message, setMessage] = useState(""), [failure, setFailure] = useState(""), [newsletter, setNewsletter] = useState(false);
  const level = tierForXP(stats.xp), next = XP_TIERS[level + 1], unlocked = new Set(earnedBadges(stats).map((b) => b.id));
  const submit = async () => {
    setBusy(true); setFailure(""); setMessage("");
    try {
      if (sent) { await playerApi("auth", { action: "verify", email, code, name }); await refresh(); setMessage("You're signed in. New rounds save to your profile; guest progress stays on this browser."); }
      else { await playerApi("auth", { action: "send", email }); setSent(true); setMessage("Check your inbox for your sign-in code."); }
    } catch (e) { setFailure(e instanceof Error ? e.message : "Unable to sign in."); } finally { setBusy(false); }
  };
  const subscribe = async () => { setBusy(true); setFailure(""); try { await playerApi("profile", { newsletter: true }); await refresh(); setMessage("Check your inbox to confirm your Broadway updates subscription."); } catch (e) { setFailure(e instanceof Error ? e.message : "Unable to subscribe."); } finally { setBusy(false); } };
  return <div className={styles.gamePanel}>
    <p className="kicker">Your Bar Lounge Record</p><h1 className="font-display mt-3 text-4xl sm:text-6xl">{player?.display_name || "RAISE YOUR LEVEL"}</h1>
    <p className="mt-4 text-slate-300">{player ? "Your progress follows you across devices." : "Guest XP and badges stay in this browser. Clearing browser data removes them. Guest scores don't enter the leaderboard."}</p>
    <div className={styles.statGrid}>{[[stats.xp.toLocaleString(), "Total XP"], [stats.rounds, "Rounds Played"], [stats.total ? Math.round(stats.correct / stats.total * 100) + "%" : "—", "Accuracy"], [stats.best_streak, "Best Streak"]].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
    <p className="font-display text-2xl text-accent">{XP_TIERS[level].name}</p><progress className={styles.xpMeter} aria-label="Progress to next tier" value={next ? stats.xp - XP_TIERS[level].xp : 1} max={next ? next.xp - XP_TIERS[level].xp : 1}/><p className="text-sm text-slate-300">{next ? `${next.xp - stats.xp} XP to ${next.name}` : "You've reached Broadway's Floor."} · 25 XP per completed round, plus 1 XP per 10 points.</p>
    <h2 className="font-display mt-9 text-3xl">Your Badges <span className="text-accent">{unlocked.size}/{BADGES.length}</span></h2>
    <div className={styles.badgeGrid}>{BADGES.map((badge) => <div key={badge.id} className={styles.badgeCard + (unlocked.has(badge.id) ? " " + styles.badgeEarned : "")}><span>{unlocked.has(badge.id) ? "Earned" : "Locked"}</span><h3 className="font-display">{badge.title}</h3><p>{badge.note}</p></div>)}</div>
    <div className={styles.accountPanel}>
      {player ? <><p className="font-semibold">Signed in as {player.display_name}</p><button className="mt-3 text-accent underline" disabled={busy} onClick={async () => { await playerApi("auth", { action: "logout" }); await refresh(); }}>Sign Out</button>{kitConfigured && !player.kit_synced_at && <div className="mt-5"><label className="flex items-start gap-3"><input type="checkbox" className="mt-1" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)}/><span>Email me Broadway videos and Bar Lounge updates. Optional; you can unsubscribe anytime.</span></label><button disabled={!newsletter || busy} className={styles.primaryAction + " mt-4 disabled:opacity-40"} onClick={subscribe}>Subscribe to Updates</button></div>}{player.kit_synced_at && <p className="mt-4 text-sm text-slate-300">Newsletter signup submitted. Confirm using the email from Kit; unsubscribe through any newsletter.</p>}</> : configured ? <><h2 className="font-display text-2xl">Save Your Progress</h2><p className="mt-2 text-sm text-slate-300">Verify your email to play ranked rounds. Your display name appears on the leaderboard; your email stays private. Newsletter signup is separate.</p><form className={styles.accountForm} onSubmit={(e) => { e.preventDefault(); void submit(); }}><label>Email<input type="email" autoComplete="email" required value={email} disabled={sent} onChange={(e) => setEmail(e.target.value)}/></label>{sent && <><label>Display name<input required minLength={2} maxLength={24} autoComplete="nickname" value={name} onChange={(e) => setName(e.target.value)}/></label><label>Email code<input required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6,8}" maxLength={8} value={code} onChange={(e) => setCode(e.target.value)}/></label></>}<button disabled={busy} className={styles.primaryAction}>{busy ? "Please wait…" : sent ? "Verify & Sign In" : "Email Me a Code"}</button></form>{sent && <button className="mt-3 text-sm text-accent underline" onClick={() => { setSent(false); setCode(""); setMessage(""); }}>Use another email or request a new code</button>}</> : <p className="text-slate-300">Player accounts are coming soon. You can earn guest XP and badges now.</p>}
      {message && <p role="status" className="mt-4 text-green-300">{message}</p>}{(failure || error) && <p role="alert" className="mt-4 text-rose-300">{failure || error}</p>}{error && <button onClick={refresh} className="mt-2 text-accent underline">Retry Profile</button>}
    </div>
  </div>;
}
export function Leaderboard() {
  const [period, setPeriod] = useState("week"), [data, setData] = useState<{ configured: boolean; entries: { display_name: string; xp: number; rounds: number; accuracy: number }[] } | null>(null), [error, setError] = useState(""), [retry, setRetry] = useState(0);
  useEffect(() => { let cancelled = false; const begin = setTimeout(() => { setData(null); setError(""); playerApi<typeof data>("leaderboard?period=" + period).then((value) => { if (!cancelled) setData(value); }).catch((e) => { if (!cancelled) setError(e.message); }); }, 0); return () => { cancelled = true; clearTimeout(begin); }; }, [period, retry]);
  return <div className={styles.gamePanel}><p className="kicker">The Bar Lounge</p><h1 className="font-display mt-3 text-4xl sm:text-6xl">LEADERBOARD</h1><p className="mt-4 text-slate-300">Verified players, ranked by XP earned. Weekly standings reset Monday at midnight Eastern; lifetime XP stays with you.</p><div className={styles.periodTabs}>{[["week", "This Week"], ["all", "All Time"]].map(([value, label]) => <button key={value} onClick={() => setPeriod(value)} aria-pressed={period === value} className={period === value ? styles.primaryAction : styles.secondaryAction}>{label}</button>)}</div>
    {error ? <p role="alert">{error} <button onClick={() => setRetry(retry + 1)} className="text-accent underline">Retry</button></p> : !data ? <p role="status">Loading rankings…</p> : !data.configured ? <p className={styles.emptyState}>Shared rankings open when player accounts launch. Guest progress is available now.</p> : !data.entries.length ? <p className={styles.emptyState}>No ranked rounds {period === "week" ? "this week" : "yet"}. Sign in and finish a round to set the pace.</p> : <div className={styles.tableScroll}><table className={styles.rankTable}><caption className="sr-only">{period === "week" ? "Weekly" : "All-time"} player rankings</caption><thead><tr><th>Rank</th><th>Player</th><th>XP</th><th>Rounds</th><th>Accuracy</th></tr></thead><tbody>{data.entries.map((entry, i) => <tr key={i}><td>{i + 1}</td><th scope="row">{entry.display_name}</th><td>{Number(entry.xp).toLocaleString()}</td><td>{entry.rounds}</td><td>{entry.accuracy}%</td></tr>)}</tbody></table></div>}
  </div>;
}
