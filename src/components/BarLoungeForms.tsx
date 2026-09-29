"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitLoungeAnswer, subscribeToLounge, type LoungeState } from "@/app/bar-lounge/actions";

const initial: LoungeState = { status: "idle", message: "" };
const inputClass = "w-full rounded-xl border border-white/20 bg-bg/70 px-4 py-3 text-white placeholder:text-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="btn-accent rounded-full px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Sending…" : label}</button>;
}

function Feedback({ state }: { state: LoungeState }) {
  if (state.status === "idle") return null;
  return <p role={state.status === "error" ? "alert" : "status"} className={`text-sm ${state.status === "error" ? "text-red-300" : "text-green-300"}`}>{state.message}</p>;
}

export function LoungeAnswerForm({ roundId }: { roundId: string }) {
  const [state, action] = useActionState(submitLoungeAnswer, initial);
  return (
    <form action={action} className="mt-8 space-y-4" aria-label="Send your Bar Lounge answer">
      <input type="hidden" name="round" value={roundId} />
      <div className="absolute -left-[9999px]" aria-hidden="true"><label htmlFor={`answer-trap-${roundId}`}>Leave blank</label><input id={`answer-trap-${roundId}`} name="lounge_time" tabIndex={-1} autoComplete="off" /></div>
      <div><label htmlFor={`lounge-name-${roundId}`} className="mb-2 block text-sm font-semibold text-white">Name or screen name</label><input id={`lounge-name-${roundId}`} name="name" required maxLength={60} className={inputClass} placeholder="How should we call you?" /></div>
      <div><label htmlFor={`lounge-answer-${roundId}`} className="mb-2 block text-sm font-semibold text-white">Your answer</label><textarea id={`lounge-answer-${roundId}`} name="answer" required maxLength={800} rows={3} className={`${inputClass} resize-y`} placeholder="Tell Broadway what you found…" /></div>
      <p className="text-xs leading-5 text-muted">Your answer goes to Broadway privately. We&apos;ll ask before featuring your name or response.</p>
      <div className="flex flex-wrap items-center gap-4"><Submit label="Send My Answer" /><Feedback state={state} /></div>
    </form>
  );
}

export function LoungeSignupForm() {
  const [state, action] = useActionState(subscribeToLounge, initial);
  return (
    <form action={action} className="mt-7 space-y-4" aria-label="Join the Bar Lounge email list">
      <div className="absolute -left-[9999px]" aria-hidden="true"><label htmlFor="signup-trap">Leave blank</label><input id="signup-trap" name="lounge_time" tabIndex={-1} autoComplete="off" /></div>
      <div><label htmlFor="lounge-email" className="mb-2 block text-sm font-semibold text-white">Email address</label><input id="lounge-email" name="email" type="email" required autoComplete="email" className={inputClass} placeholder="you@email.com" /></div>
      <label className="flex items-start gap-3 text-sm leading-6 text-muted"><input name="consent" type="checkbox" required className="mt-1.5 accent-accent" /><span>Send me The Second Listen: Bar Lounge clues, reveals, and new Hip-Hop conversations by email. I can unsubscribe anytime.</span></label>
      <div className="flex flex-wrap items-center gap-4"><Submit label="Join The Second Listen" /><Feedback state={state} /></div>
    </form>
  );
}
