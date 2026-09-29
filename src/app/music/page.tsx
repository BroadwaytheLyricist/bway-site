import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Music from "@/components/sections/Music";
import MusicPlatformCarousel from "@/components/MusicPlatformCarousel";
import ScrollRevealGroup from "@/components/ScrollRevealGroup";
import { links } from "@/lib/site";

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
      <Music standalone />
      <section className="relative isolate overflow-hidden border-t border-line bg-[#0b1423] pb-20 sm:pb-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_34%,rgba(29,81,137,.18),transparent_46%),radial-gradient(circle_at_88%_82%,rgba(255,90,31,.09),transparent_40%)]" />
        <ScrollRevealGroup className="w-full">
          <div data-reveal-item className="music-artist-panorama relative -mb-4 overflow-hidden sm:-mb-8">
            <div className="music-artist-image absolute inset-y-0 left-1/2 w-full max-w-[1400px] -translate-x-1/2">
              <Image
                src="/images/music-artist-lineup.jpg"
                alt="Broadway the Lyricist and four others in Broadway hoodies on a stage"
                fill
                sizes="(max-width: 1400px) 100vw, 1400px"
                className="object-cover object-center"
              />
            </div>
          </div>
        </ScrollRevealGroup>
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="kicker">More Than Commentary</p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-white sm:text-5xl">The artist behind <span className="text-accent">the conversations.</span></h2>
          </div>
          <div className="space-y-6 text-base leading-8 text-white/75 sm:text-lg">
            <p>
              Broadway the Lyricist&apos;s connection to Hip-Hop began with making music. His recordings are another side of the same voice you hear in the videos: an artist&apos;s point of view, expressed on record.
            </p>
            <p>
              Start with the <em>Off Broadway EP (Unmastered) Deluxe Edition</em> in the player above. For more releases, visit the full Bandcamp catalog or choose the listening platform that works for you.
            </p>
            <a href={links.bandcamp} target="_blank" rel="noopener noreferrer" className="inline-flex border-b border-accent pb-2 text-sm font-semibold text-white transition-colors hover:text-accent">Browse the full Bandcamp catalog →</a>
          </div>
        </div>
      </section>
      <section className="relative isolate overflow-hidden border-t border-line bg-[#080d19] py-20 sm:py-28">
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
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <p className="kicker">Listen Your Way</p>
          <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">Find Broadway&apos;s <span className="text-accent">music.</span></h2>
          <p className="mt-5 max-w-2xl leading-8 text-muted">The embedded player features the Off Broadway EP. Availability of other releases varies by platform; Bandcamp carries the broader catalog.</p>
          <MusicPlatformCarousel />
          <p className="mt-12 text-sm leading-7 text-muted">Here for the conversation too? <Link href="/#videos" className="text-white underline decoration-accent underline-offset-4 hover:text-accent">Watch the channel</Link> or <Link href="/about" className="text-white underline decoration-accent underline-offset-4 hover:text-accent">meet Broadway</Link>.</p>
        </div>
      </section>
    </>
  );
}
