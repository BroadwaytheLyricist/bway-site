import type { CSSProperties } from "react";
import Link from "next/link";
import { featuredVideos } from "@/lib/site";
import { ArrowIcon, DocIcon, PlayIcon } from "@/components/icons";
import HeroBackground from "@/components/sections/HeroBackground";

export default function Hero() {
  const latestVideo = `https://www.youtube.com/watch?v=${featuredVideos[0].id}`;
  return (
    <section id="home" className="relative isolate flex min-h-[100svh] items-center overflow-hidden">
      {/* Parallax photo + legibility scrims (client component) */}
      <HeroBackground />

      <div className="mx-auto w-full max-w-7xl px-5 pt-28 pb-28 sm:px-8 sm:pb-36">
        <div className="max-w-2xl">
          <span className="hero-reveal inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Hip-Hop History &amp; Commentary
          </span>

          <h1
            className="hero-reveal mt-6 font-display text-5xl leading-[0.92] sm:text-7xl lg:text-8xl"
            style={{ "--reveal-delay": "120ms" } as CSSProperties}
          >
            Broadway
            <br />
            The <span className="text-accent">Lyricist</span>
          </h1>

          <p
            className="hero-reveal mt-6 max-w-xl text-lg leading-relaxed text-muted"
            style={{ "--reveal-delay": "260ms" } as CSSProperties}
          >
            Deep dives. Reactions. Debates. The hip-hop conversations we should be
            having — long-form, unfiltered, on record.
          </p>

          <div
            className="hero-reveal mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ "--reveal-delay": "380ms" } as CSSProperties}
          >
            <a
              href={latestVideo}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta-primary group inline-flex items-center justify-between gap-5 rounded-sm px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white"
            >
              <PlayIcon className="h-4 w-4" />
              Watch the Latest Video
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <Link
              href="/blog"
              className="hero-cta-secondary group inline-flex items-center justify-between gap-5 rounded-sm px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white"
            >
              <DocIcon className="h-4 w-4" />
              Read the Blog
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
