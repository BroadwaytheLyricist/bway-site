"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PlayIcon, ArrowIcon } from "@/components/icons";

const featuredVideos = [
  { id: "FKur9myXW94", title: "God Is the Only GOAT", type: "Official Video" },
  { id: "OMqDT3xAhOQ", title: "Off Broadway", type: "Music Video" },
] as const;

const moreVideos = [
  { id: "DPy9_eAPQEE", title: "The Zeitgeist", type: "Official Music Video" },
  { id: "UEsiXRfogks", title: "Sleeping Giant", type: "Music Video" },
] as const;

export default function MusicVideoCards({ more = false }: { more?: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  const [navigation, setNavigation] = useState({ previous: false, next: false });
  const trackRef = useRef<HTMLDivElement>(null);
  const videos = more ? moreVideos : featuredVideos;

  useEffect(() => {
    if (!more || !trackRef.current) return;
    const track = trackRef.current;
    const update = () => setNavigation({ previous: track.scrollLeft > 2, next: track.scrollLeft + track.clientWidth < track.scrollWidth - 2 });
    const frame = requestAnimationFrame(update);
    const observer = new ResizeObserver(update);
    observer.observe(track);
    track.addEventListener("scroll", update, { passive: true });
    return () => { cancelAnimationFrame(frame); observer.disconnect(); track.removeEventListener("scroll", update); };
  }, [more]);

  useEffect(() => {
    const stopOther = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      setActive((current) => current && current !== id ? null : current);
    };
    window.addEventListener("btl-music-video-play", stopOther);
    return () => window.removeEventListener("btl-music-video-play", stopOther);
  }, []);

  const play = (id: string) => {
    window.dispatchEvent(new CustomEvent("btl-music-video-play", { detail: id }));
    setActive(id);
  };
  const browse = (direction: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  return <div className={more ? "" : "bg-bg/85 p-5 backdrop-blur-[3px] sm:p-7"}>
    {more ? <div className="mb-7 flex items-end justify-between gap-5">
      <div><p className="kicker">Watch Broadway</p><h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">More <span className="text-accent">Music Videos</span></h2></div>
      {(navigation.previous || navigation.next) && <div className="flex shrink-0 gap-2">
        <button onClick={() => browse(-1)} disabled={!navigation.previous} aria-label="Previous music videos" className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-accent hover:border-accent disabled:opacity-30"><ArrowIcon className="h-5 w-5 rotate-180" /></button>
        <button onClick={() => browse(1)} disabled={!navigation.next} aria-label="Next music videos" className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-accent hover:border-accent disabled:opacity-30"><ArrowIcon className="h-5 w-5" /></button>
      </div>}
    </div> : <p className="kicker mb-5">Music Videos</p>}
    <div ref={trackRef} role={more ? "region" : undefined} aria-label={more ? "More music videos, scroll to browse" : undefined} tabIndex={more ? 0 : undefined} className={more ? "flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-5 focus-visible:outline-2 focus-visible:outline-accent" : "grid gap-6"}>
      {videos.map((video) => <article key={video.id} className={more ? "w-[85%] shrink-0 snap-start sm:w-[520px]" : undefined}>
        {active === video.id ? <div className="relative aspect-video min-h-[200px] bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&playsinline=1&rel=0`}
            title={`${video.title} — ${video.type}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div> : <button
          onClick={() => play(video.id)}
          aria-label={`Play ${video.title} ${video.type}`}
          className="group relative block aspect-video w-full overflow-hidden bg-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <Image src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" fill sizes={more ? "(min-width:640px) 520px, 85vw" : "(min-width:1024px) 390px, (min-width:640px) 50vw, 90vw"} className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none" />
          <span aria-hidden="true" className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/5" />
          <span aria-hidden="true" className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-transform group-hover:scale-110"><PlayIcon className="ml-1 h-6 w-6" /></span>
        </button>}
        <div className="mt-3 flex items-center justify-between gap-3">
          <div><h3 className="text-base font-semibold text-white">{video.title}</h3><p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">{video.type}</p></div>
          <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${video.title} on YouTube`} className="shrink-0 p-2 text-muted transition-colors hover:text-accent"><ArrowIcon className="h-4 w-4" /></a>
        </div>
        {active === video.id && <button onClick={() => setActive(null)} className="mt-2 text-xs text-muted underline underline-offset-4 hover:text-accent">Close video</button>}
      </article>)}
    </div>
  </div>;
}
