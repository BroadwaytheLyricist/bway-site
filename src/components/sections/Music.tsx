"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import SectionHeading from "@/components/SectionHeading";
import { ArrowIcon } from "@/components/icons";
import { links } from "@/lib/site";

const destinations = [
  { label: "Spotify", href: links.spotify },
  { label: "Apple Music", href: links.appleMusic },
  { label: "Amazon Music", href: links.amazonMusic },
  { label: "YouTube Music", href: links.youtubeMusic },
  { label: "TIDAL", href: links.tidal },
  { label: "Deezer", href: links.deezer },
] as const;

export default function Music() {
  const sectionRef = useRef<HTMLElement>(null);
  const subjectRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const subject = subjectRef.current;
    const studio = studioRef.current;
    if (!section || !subject || !studio) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      subject.style.setProperty("--music-x", "0px");
      subject.style.setProperty("--music-opacity", "1");
      studio.style.setProperty("--music-bg-y", "0px");
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (viewport - rect.top) / (viewport * 1.15)));
      const eased = 1 - Math.pow(1 - progress, 3);
      const entranceDistance = window.innerWidth >= 1024 ? 440 : Math.min(240, window.innerWidth * 0.55);
      subject.style.setProperty("--music-x", `${(eased - 1) * entranceDistance}px`);
      subject.style.setProperty("--music-opacity", `${0.12 + eased * 0.88}`);
      studio.style.setProperty("--music-bg-y", `${(0.5 - progress) * 26}px`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
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
    <section ref={sectionRef} id="music" className="relative isolate min-h-[990px] overflow-hidden bg-bg py-24 sm:py-32 lg:min-h-[900px]">
      <div ref={studioRef} aria-hidden="true" className="music-studio absolute inset-0 -z-30">
        <Image src="/images/music-studio-bg.jpg" alt="" fill sizes="100vw" className="object-cover object-center" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[#081527]/42" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-gradient-to-r from-bg/20 via-bg/42 to-bg/75" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-gradient-to-t from-bg/85 via-transparent to-bg/25" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_25%_50%,rgba(255,90,31,.12),transparent_42%)]" />

      <div aria-hidden="true" className="music-art pointer-events-none absolute inset-0 -z-10">
        <div ref={subjectRef} className="music-subject absolute top-[145px] -left-[60vw] w-[190vw] sm:-left-[36vw] sm:w-[155vw] lg:top-auto lg:bottom-0 lg:-left-[360px] lg:w-[1450px]">
          <Image src="/images/music-subject.webp" alt="" width={2048} height={1152} sizes="(max-width: 640px) 190vw, (max-width: 1024px) 155vw, 1450px" className="block h-auto w-full" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="04"
          kicker="Original Music"
          title={<>Broadway <span className="text-accent">On Record</span></>}
        />

        <div className="music-player-card mt-[440px] grid overflow-hidden border border-line bg-bg/85 shadow-2xl backdrop-blur-[3px] sm:mt-[520px] lg:ml-auto lg:mt-20 lg:max-w-[880px] lg:grid-cols-[minmax(350px,0.9fr)_1fr]">
          <div className="flex items-center justify-center bg-[#101827] px-4 py-8 sm:px-8">
            <iframe
              title="Off Broadway EP (Unmastered) Deluxe Edition on Bandcamp"
              src="https://bandcamp.com/EmbeddedPlayer/album=2215040601/size=large/bgcol=101827/linkcol=ff5a1f/tracklist=false/transparent=true/"
              className="h-[470px] w-full max-w-[350px] border-0"
              loading="lazy"
              allow="autoplay; encrypted-media"
            />
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
            <p className="kicker">Featured Release</p>
            <h3 className="mt-3 font-display text-4xl leading-none text-white sm:text-5xl">Off Broadway EP</h3>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-accent">Unmastered Deluxe Edition</p>
            <p className="mt-5 max-w-xl leading-relaxed text-muted">
              Listen to the EP here, then explore more of Broadway&apos;s music on Bandcamp or your preferred platform.
            </p>

            <a href={links.bandcamp} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex w-fit items-center gap-2 border-b border-accent pb-2 text-sm font-semibold text-white hover:text-accent">
              Explore the full catalog on Bandcamp <ArrowIcon className="h-4 w-4" />
            </a>

            <div className="mt-8 flex flex-wrap gap-3">
              {destinations.map((destination) => (
                <a key={destination.label} href={destination.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 border border-white/15 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white hover:border-accent hover:text-accent">
                  {destination.label}<ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
