"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import SmokeDrift from "@/components/SmokeDrift";

/**
 * Layered About portrait, built like the hero: the stage background melts
 * into the section on every edge, and the cut-out photo sits in front of it.
 *
 * Edge lighting (see `.about-rim` in globals.css) traces the silhouette in
 * the stage colors: warm orange from the smoke side (right, as in the
 * mirrored hero), cool blue from the lights side (left).
 *
 * A gentle scroll parallax moves the two layers at different speeds so the
 * foreground reads as separate from the background. Disabled entirely under
 * `prefers-reduced-motion`.
 */
export default function AboutPhoto() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const back = backRef.current;
    const front = frontRef.current;
    if (!wrap || !back || !front) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      // -1 when the photo is just below the viewport, +1 when just above.
      const progress = Math.max(
        -1,
        Math.min(1, (vh / 2 - (rect.top + rect.height / 2)) / vh),
      );
      back.style.transform = `translate3d(0, ${progress * 24}px, 0) scale(1.08)`;
      front.style.transform = `translate3d(0, ${progress * -10}px, 0)`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative aspect-[5/4] w-full">
      {/* Background layer: the same stage as the hero, mirrored the same way
          so the lights and smoke sit on the same sides. Shown nearly full
          strength and only feathered at the outer edges, so it clearly reads
          as the hero's stage continuing into this section. */}
      <div className="absolute -inset-x-[12%] -inset-y-[8%] [mask-image:linear-gradient(to_right,transparent,#000_16%,#000_84%,transparent),linear-gradient(to_bottom,transparent,#000_12%,#000_80%,transparent)] [mask-composite:intersect]">
        <div ref={backRef} className="absolute inset-0 scale-[1.08] opacity-90 will-change-transform">
          <Image
            src="/images/stage-bg.webp"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="scale-x-[-1] object-cover"
          />
        </div>
        {/* Same drifting smoke as the hero, matched to the mirrored stage */}
        <SmokeDrift warmX="60%" coolX="30%" className="opacity-70" />
      </div>

      {/* Foreground layer: the cut-out portrait, kept crisp. Served as the
          original file (no re-compression) so the shine survives. Only the
          very bottom of the crop and the mic arm's exit on the right are
          feathered. */}
      <div
        ref={frontRef}
        className="about-rim absolute inset-0 will-change-transform"
      >
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_88%,transparent_100%),linear-gradient(to_left,transparent_0%,#000_10%)] [mask-composite:intersect]">
          <Image
            src="/images/about-cutout.webp"
            alt="Broadway The Lyricist behind the mic in his studio"
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover object-[55%_100%]"
          />
        </div>
      </div>
    </div>
  );
}
