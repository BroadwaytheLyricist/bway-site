"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * Client-only hero background: the spotlit portrait plus legibility scrims.
 *
 * The photo has the subject on the left facing right, so it is mirrored
 * (`scale-x-[-1]`) to place him on the right while the headline sits on the
 * left. A clamped, transform-only scroll parallax drifts the image as the hero
 * scrolls; it is disabled entirely under `prefers-reduced-motion`.
 */
export default function HeroBackground() {
  const layerRef = useRef<HTMLDivElement>(null);
  const smokeBRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = layerRef.current;
    if (!el) return;

    // Respect reduced-motion: leave the background static.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      // Clamp to the hero's own height so the parallax only runs while it is
      // in view, and keep the shift well within the layer's vertical slack.
      const offset = Math.min(window.scrollY, window.innerHeight);
      el.style.setProperty("--hero-parallax-y", `${offset * 0.045}px`);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const offsetSecondSmoke = () => {
    const video = smokeBRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    video.currentTime = video.duration / 2;
    void video.play().catch(() => undefined);
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Use the original approved hero as one immutable composition. */}
        <div
          ref={layerRef}
          className="hero-stage-layer absolute -inset-y-[6%] inset-x-0 z-0 will-change-transform"
        >
          <Image
            src="/images/hero.png"
            alt="Broadway The Lyricist on a stage lit with orange and blue spotlights"
            fill
            preload
            sizes="100vw"
            className="scale-x-[-1] object-cover object-center"
          />
        </div>

        <video
          className="hero-smoke-video hero-smoke-a absolute inset-0 z-10 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/videos/hero-smoke.mp4" type="video/mp4" />
        </video>
        <video
          ref={smokeBRef}
          className="hero-smoke-video hero-smoke-b absolute inset-0 z-10 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onLoadedMetadata={offsetSecondSmoke}
        >
          <source src="/videos/hero-smoke.mp4" type="video/mp4" />
        </video>

        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-bg/92 via-bg/42 to-transparent" />
        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-bg/24 via-transparent to-bg/10" />
    </div>
  );
}
