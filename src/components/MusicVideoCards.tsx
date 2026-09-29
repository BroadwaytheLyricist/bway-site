"use client";

import Image from "next/image";
import { useState } from "react";
import { PlayIcon, ArrowIcon } from "@/components/icons";

const videos = [
  { id: "FKur9myXW94", title: "God Is the Only GOAT", type: "Official Video" },
  { id: "OMqDT3xAhOQ", title: "Off Broadway", type: "Music Video" },
] as const;

export default function MusicVideoCards() {
  const [active, setActive] = useState<string | null>(null);

  return <div className="bg-bg/85 p-5 backdrop-blur-[3px] sm:p-7">
    <p className="kicker mb-5">Music Videos</p>
    <div className="grid gap-6">
      {videos.map((video) => <article key={video.id}>
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
          onClick={() => setActive(video.id)}
          aria-label={`Play ${video.title} ${video.type}`}
          className="group relative block aspect-video w-full overflow-hidden bg-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <Image src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" fill sizes="(min-width:1024px) 390px, (min-width:640px) 50vw, 90vw" className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none" />
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
