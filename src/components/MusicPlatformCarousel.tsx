"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { links } from "@/lib/site";

const platforms = [
  { label: "Bandcamp", href: links.bandcamp, icon: "bandcamp" },
  { label: "Spotify", href: links.spotify, icon: "spotify" },
  { label: "Apple Music", href: links.appleMusic, icon: "applemusic" },
  { label: "Amazon Music", href: links.amazonMusic, icon: "amazonmusic" },
  { label: "YouTube Music", href: links.youtubeMusic, icon: "youtubemusic" },
  { label: "TIDAL", href: links.tidal, icon: "tidal" },
  { label: "Deezer", href: links.deezer, icon: "deezer" },
] as const;

/**
 * Desktop: the logos drift on their own (CSS marquee).
 * Phones: a swipeable row. A right-edge fade, a one-time "peek" when the row
 * first scrolls into view, and a "Swipe for more platforms" cue tell visitors
 * there is more to the right. The cue fades once they swipe; the edge fade
 * disappears at the end of the row.
 */
export default function MusicPlatformCarousel() {
  const rowRef = useRef<HTMLElement>(null);
  const [swiped, setSwiped] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const row = rowRef.current;
    if (!row || !window.matchMedia("(max-width: 767px)").matches) return;

    let nudging = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const onScroll = () => {
      setAtEnd(row.scrollLeft + row.clientWidth >= row.scrollWidth - 4);
      if (!nudging && row.scrollLeft > 12) setSwiped(true);
    };
    row.addEventListener("scroll", onScroll, { passive: true });

    let observer: IntersectionObserver | undefined;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer?.disconnect();
          if (row.scrollLeft > 0) return;
          // One gentle peek to the left and back, so the row reads as swipeable.
          nudging = true;
          timers.push(setTimeout(() => row.scrollTo({ left: 72, behavior: "smooth" }), 350));
          timers.push(setTimeout(() => row.scrollTo({ left: 0, behavior: "smooth" }), 1050));
          timers.push(setTimeout(() => { nudging = false; }, 1700));
        },
        { threshold: 0.6 },
      );
      observer.observe(row);
    }

    return () => {
      row.removeEventListener("scroll", onScroll);
      observer?.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="music-platforms-wrap" data-at-end={atEnd ? "true" : undefined}>
      <nav ref={rowRef} className="music-platforms mt-10" aria-label="Listen on your preferred music platform">
        <div className="music-platforms-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="music-platforms-group" aria-hidden={copy === 1 ? true : undefined}>
              {platforms.map(({ label, href, icon }) => (
                <a
                  key={`${copy}-${label}`}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={copy === 1 ? -1 : undefined}
                  aria-label={`Listen on ${label} (opens in a new tab)`}
                  className="music-platform-link"
                >
                  <Image
                    aria-hidden="true"
                    alt=""
                    src={`/images/music-platforms/${icon}.png`}
                    width={icon === "amazonmusic" ? 160 : 68}
                    height={icon === "amazonmusic" ? 32 : 68}
                    className="music-platform-logo"
                  />
                </a>
              ))}
            </div>
          ))}
        </div>
      </nav>
      <p className="music-swipe-hint md:hidden" aria-hidden="true" data-hidden={swiped ? "true" : undefined}>
        Swipe for more platforms
        <span className="music-swipe-chevrons">
          <svg viewBox="0 0 12 12"><path d="M4 2l4 4-4 4" /></svg>
          <svg viewBox="0 0 12 12"><path d="M4 2l4 4-4 4" /></svg>
          <svg viewBox="0 0 12 12"><path d="M4 2l4 4-4 4" /></svg>
        </span>
      </p>
    </div>
  );
}
