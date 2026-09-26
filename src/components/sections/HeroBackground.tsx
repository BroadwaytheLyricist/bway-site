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
      el.style.transform = `translate3d(0, ${offset * 0.08}px, 0)`;
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

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Parallax image layer — oversized vertically so the drift never gaps. */}
      <div
        ref={layerRef}
        className="hero-portrait-layer absolute -inset-y-[10%] inset-x-0 will-change-transform"
      >
        <Image
          src="/images/hero.png"
          alt="Broadway The Lyricist on a dark, spotlit stage"
          fill
          preload
          sizes="100vw"
          className="scale-x-[-1] object-cover object-center"
        />
      </div>

      <video
        className="hero-smoke-video absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/videos/hero-smoke.mp4" type="video/mp4" />
      </video>

      {/* Cinematic scrims — just enough to keep the headline legible while the
          stage lights and the rainy-street reflections read through. Kept static
          so they don't drift with the parallax. The horizontal wash only darkens
          the left third (behind the copy); the vertical wash is light so the
          bottom reflections stay visible. */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg/92 via-bg/38 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg/28 via-transparent to-bg/10" />
    </div>
  );
}
