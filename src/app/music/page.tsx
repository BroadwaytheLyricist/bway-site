import type { Metadata } from "next";
import Link from "next/link";
import Music from "@/components/sections/Music";
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
      <section className="relative isolate overflow-hidden border-t border-line bg-[#0b1423] py-20 sm:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_34%,rgba(29,81,137,.18),transparent_46%),radial-gradient(circle_at_88%_82%,rgba(255,90,31,.09),transparent_40%)]" />
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
      <section className="border-t border-line bg-bg py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="kicker">Listen Your Way</p>
          <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">Find Broadway&apos;s <span className="text-accent">music.</span></h2>
          <p className="mt-5 max-w-2xl leading-8 text-muted">The embedded player features the Off Broadway EP. Availability of other releases varies by platform; Bandcamp carries the broader catalog.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            {[
              { label: "Bandcamp", href: links.bandcamp },
              { label: "Spotify", href: links.spotify },
              { label: "Apple Music", href: links.appleMusic },
              { label: "Amazon Music", href: links.amazonMusic },
              { label: "YouTube Music", href: links.youtubeMusic },
            ].map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="border border-white/15 bg-panel px-5 py-4 text-sm font-semibold text-white transition-colors hover:border-accent hover:text-accent">{label} ↗</a>
            ))}
          </div>
          <p className="mt-12 text-sm leading-7 text-muted">Here for the conversation too? <Link href="/#videos" className="text-white underline decoration-accent underline-offset-4 hover:text-accent">Watch the channel</Link> or <Link href="/about" className="text-white underline decoration-accent underline-offset-4 hover:text-accent">meet Broadway</Link>.</p>
        </div>
      </section>
    </>
  );
}
