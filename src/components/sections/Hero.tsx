import Link from "next/link";
import { links } from "@/lib/site";
import { DocIcon, PlayIcon } from "@/components/icons";
import HeroBackground from "@/components/sections/HeroBackground";

export default function Hero() {
  return (
    <section id="home" className="relative isolate flex min-h-[100svh] items-center overflow-hidden">
      {/* Parallax photo + legibility scrims (client component) */}
      <HeroBackground />

      <div className="mx-auto w-full max-w-7xl px-5 pt-28 pb-20 sm:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Hip-Hop History &amp; Commentary
          </span>

          <h1 className="mt-6 font-display text-5xl leading-[0.92] sm:text-7xl lg:text-8xl">
            Broadway
            <br />
            The <span className="text-accent">Lyricist</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Deep dives. Reactions. Debates. The hip-hop conversations we should be
            having — long-form, unfiltered, on record.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={links.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              <PlayIcon className="h-4 w-4" />
              Watch on YouTube
            </a>
            <Link
              href={links.mediaKit}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-white/40 hover:bg-white/10"
            >
              <DocIcon className="h-4 w-4" />
              View Media Kit
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
