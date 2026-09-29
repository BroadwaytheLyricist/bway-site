import type { Metadata } from "next";
import Image from "next/image";
import Music from "@/components/sections/Music";
import MusicPlatformCarousel from "@/components/MusicPlatformCarousel";
import AnchorLanding from "@/components/AnchorLanding";
import MusicVideoCards from "@/components/MusicVideoCards";
import ScrollRevealGroup from "@/components/ScrollRevealGroup";

const title = "Original Music & Releases | Broadway the Lyricist";
const description =
  "Listen to Broadway the Lyricist's original Hip-Hop music, including the Off Broadway EP, and explore the catalog on Bandcamp, Spotify, Apple Music, Amazon Music, and YouTube Music.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/music" },
  openGraph: {
    title,
    description,
    url: "/music",
    siteName: "Broadway The Lyricist",
    type: "website",
    images: [{ url: "/images/og/broadway-social-preview.jpg", width: 1200, height: 630, alt: "Broadway the Lyricist" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/og/broadway-social-preview.jpg"],
  },
};

export default function MusicPage() {
  return (
    <>
      <AnchorLanding />
      <Music standalone />
      <section aria-label="More music videos" className="relative isolate overflow-hidden border-t border-line bg-[#080d19] py-12 sm:py-16">
        <Image src="/images/music-studio-bg.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-20" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-[#080d19]/80 via-[#081527]/70 to-[#080d19]" />
        <ScrollRevealGroup className="mx-auto max-w-7xl px-5 sm:px-8">
          <div data-reveal-item><MusicVideoCards more /></div>
        </ScrollRevealGroup>
      </section>
      <section id="listen-platforms" className="relative isolate overflow-hidden border-t border-line bg-[#080d19] py-20 sm:py-28">
        <div aria-hidden="true" className="music-cover-wall pointer-events-none absolute inset-0 -z-20">
          {[
            { cover: "god-is-the-only-goat.jpg", title: "God Is the Only GOAT" },
            { cover: "american-hustler.webp", title: "American Hustler" },
            { cover: "off-broadway-single.jpg", title: "Off Broadway" },
            { cover: "get-some.jpg", title: "Get Some" },
            { cover: "superstar-status.jpg", title: "Superstar Status" },
            { cover: "superstar-status-2.jpg", title: "Superstar Status Part II" },
          ].map(({ cover, title }) => (
            <div key={cover} className="music-cover-card">
              <Image src={`/images/music-covers/${cover}`} alt={title} fill sizes="(max-width: 640px) 170px, 280px" className="object-cover" />
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,13,25,.8),rgba(8,13,25,.58)_58%,rgba(8,13,25,.72)),linear-gradient(180deg,rgba(8,13,25,.58),transparent_46%,rgba(8,13,25,.85))]" />
        <div className="music-platform-content relative mx-auto max-w-7xl px-5 sm:px-8">
          <p className="kicker">Listen Your Way</p>
          <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">Find Broadway&apos;s <span className="text-accent">music.</span></h2>
          <p className="mt-5 max-w-2xl leading-8 text-muted">Beyond the featured Off Broadway EP, find more of Broadway&apos;s music on Bandcamp or choose your preferred platform. Availability varies by service.</p>
          <MusicPlatformCarousel />
        </div>
      </section>
    </>
  );
}
