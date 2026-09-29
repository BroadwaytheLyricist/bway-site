import type { Metadata } from "next";
import Link from "next/link";
import { LoungeAnswerForm, LoungeSignupForm } from "@/components/BarLoungeForms";
import { barLoungeRounds } from "@/lib/bar-lounge";

export const metadata: Metadata = {
  title: "The Bar Lounge | Broadway the Lyricist",
  description: "Listen closer, find the clue, and join Broadway the Lyricist in the Hip-Hop conversations we should be having.",
  alternates: { canonical: "/bar-lounge" },
};

export default function BarLoungePage() {
  const round = barLoungeRounds[0];
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-bg pb-24 pt-32 sm:pt-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[760px] bg-[url('/images/stage-bg-v2.jpg')] bg-cover bg-center opacity-30" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-bg/40 via-bg/85 to-bg" />
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Link href="/blog" className="text-sm font-semibold text-muted transition-colors hover:text-accent">← Back to the blog</Link>
        <div className="mt-14 max-w-4xl">
          <p className="kicker text-accent">A First Look Inside</p>
          <h1 className="mt-5 font-display text-6xl leading-[0.94] text-white sm:text-7xl lg:text-8xl">The Bar <span className="text-accent">Lounge</span></h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d8dde6] sm:text-xl">The conversation doesn&apos;t end at the article. Find the detail, make your case, and come back for the story behind the answer.</p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted">This is a first round. Future challenges can use an audio clue, a record credit, a hidden detail in a video, or a story that deserves a second listen.</p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <section id="current-round" className="rounded-3xl border border-accent/35 bg-panel-2/90 p-6 shadow-2xl shadow-black/20 sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Round 01 · Find the detail</p>
            <h2 className="mt-4 font-display text-4xl leading-none text-white sm:text-5xl">{round.title}</h2>
            <p className="mt-5 leading-7 text-muted">{round.intro}</p>
            {round.audioSrc && (
              <div className="mt-6 rounded-2xl border border-white/15 bg-bg/70 p-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-accent">Listen to the clue</p>
                <audio controls preload="none" src={round.audioSrc} className="w-full" aria-label={`Audio clue for ${round.title}`} />
              </div>
            )}
            <Link href={`/blog/${round.articleSlug}`} className="mt-6 inline-flex border-b border-accent pb-1 text-sm font-semibold text-white transition-colors hover:text-accent">{round.sourceLabel} →</Link>
            <div className="mt-8 border-t border-white/15 pt-7">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">The question</p>
              <p className="mt-3 text-xl font-semibold leading-7 text-white">{round.question}</p>
              <LoungeAnswerForm roundId={round.id} />
            </div>
          </section>

          <section id="second-listen" className="rounded-3xl border border-white/15 bg-[#0b1729]/90 p-6 sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">The Second Listen</p>
            <h2 className="mt-4 font-display text-4xl leading-none text-white sm:text-5xl">Stay For The Reveal</h2>
            <p className="mt-5 leading-7 text-muted">Get the answer, the context behind it, and a heads-up when the next Bar Lounge round opens. Your answer above never adds you to this list.</p>
            <LoungeSignupForm />
          </section>
        </div>
      </div>
    </main>
  );
}
