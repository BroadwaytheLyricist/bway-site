"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/** Independent stage, moving smoke, and foreground portrait layers. */
export default function HeroBackground() {
  const layerRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const entryFrame = requestAnimationFrame(() => setReady(true));

    let frame = 0;

    const update = () => {
      frame = 0;
      // Keep the movement within the hero's height.
      const progress = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
      layerRef.current?.style.setProperty("--hero-parallax-y", `${progress * 28}px`);
      portraitRef.current?.style.setProperty("--hero-scroll-x", `${progress * 115}px`);
      portraitRef.current?.style.setProperty("--hero-scroll-opacity", `${1 - progress * 0.45}`);
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
      cancelAnimationFrame(entryFrame);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div
          ref={layerRef}
          className="hero-stage-layer absolute -inset-y-[6%] inset-x-0 z-0 will-change-transform"
        >
          <Image
            src="/images/stage-bg-v2.jpg"
            alt=""
            fill
            preload
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <div className="hero-haze-left absolute inset-0 z-10 overflow-hidden">
        <video
          className="hero-smoke-video absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/videos/hero-smoke-layer.mp4" type="video/mp4" />
        </video>
        </div>
        <div className="hero-haze-right absolute inset-0 z-10 overflow-hidden">
        <video
          className="hero-smoke-video absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/videos/hero-smoke-layer.mp4" type="video/mp4" />
        </video>
        </div>

        <div className="absolute inset-0 z-20 bg-gradient-to-r from-bg/75 via-bg/20 to-transparent" />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-bg/30 via-transparent to-bg/10" />
        <div ref={portraitRef} data-ready={ready} className="hero-subject-layer absolute bottom-[-2%] right-[-4%] z-30 h-[104%] w-[88%]">
          <Image src="/images/hero-subject-v2.png" alt="" fill preload sizes="(max-width: 767px) 115vw, 88vw" className="object-contain object-right-bottom" />
        </div>
    </div>
  );
}
