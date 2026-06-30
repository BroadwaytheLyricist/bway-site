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
      el.style.transform = `translate3d(0, ${offset * 0.15}px, 0)`;
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
        className="absolute inset-x-0 -top-[20%] -bottom-[20%] will-change-transform"
      >
        <Image
          src="/images/hero.png"
          alt="Broadway The Lyricist on a dark, spotlit stage"
          fill
          preload
          sizes="100vw"
          className="scale-x-[-1] object-cover object-[30%_center] sm:object-[50%_center]"
        />
      </div>

      {/* Cinematic scrims — kept static so the headline stays legible.
          Darkens the left (text) while the right (subject) reads bright. */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/75 to-bg/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg/85 via-transparent to-transparent" />
    </div>
  );
}
