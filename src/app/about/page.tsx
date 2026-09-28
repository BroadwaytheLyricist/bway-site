import type { Metadata } from "next";
import Link from "next/link";
import About from "@/components/sections/About";
import { links } from "@/lib/site";

const title = "About Broadway the Lyricist | Artist & Hip-Hop Storyteller";
const description =
  "Meet Broadway the Lyricist, a Tampa-based artist from the East New York section of Brooklyn, New York, whose music, live performances, and storytelling spark Hip-Hop conversations.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    title,
    description,
    url: "/about",
    siteName: "Broadway The Lyricist",
    type: "profile",
    images: [{ url: "/images/og/broadway-social-preview.jpg", width: 1200, height: 630, alt: "Broadway the Lyricist" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/og/broadway-social-preview.jpg"],
  },
};

export default function AboutPage() {
  return (
    <>
      <About standalone />
      <section className="relative isolate overflow-hidden border-t border-line bg-[#0b1423] py-20 sm:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_30%,rgba(30,90,145,.16),transparent_44%),radial-gradient(circle_at_12%_80%,rgba(255,90,31,.08),transparent_40%)]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="kicker">The Story</p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-white sm:text-5xl">An artist&apos;s ear. <span className="text-accent">A storyteller&apos;s voice.</span></h2>
          </div>
          <div className="space-y-6 text-base leading-8 text-white/75 sm:text-lg">
            <p>
              Broadway the Lyricist is a Tampa-based solo artist from the East New York section of Brooklyn, New York. Inspired by Nas, Jay-Z, Jadakiss, Prodigy, Ghostface Killah, and Black Thought, he makes intimate, honest music built on thoughtful bars and strong songwriting.
            </p>
            <p>
              He performed regularly at End of the Weak, the long-running New York City open mic that has welcomed both aspiring and veteran MCs. He also took the stage at Maria Davis&apos; Monday Night Madness showcase. Davis is the New York Hip-Hop promoter heard on Jay-Z&apos;s &ldquo;22 Two&apos;s&rdquo; from <em>Reasonable Doubt</em>.
            </p>
            <p>
              His performances have also taken him to Roxboro Raceway in North Carolina and to a Pass the Aux event in Tampa, where he performed his music for Jadakiss. In the studio, he has worked with producer Domingo, DJ PF Cuttin, and Blahzay Martell of Blahzay Blahzay, the duo behind &ldquo;Danger.&rdquo;
            </p>
            <p>
              In 2009, his music reached Wilt Wallace at Warner Bros. Records. Wallace later became the label&apos;s VP of Urban &amp; Rhythmic Promotion. No deal resulted.
            </p>
            <p>
              Those years making music and performing shape his videos and writing about Hip-Hop history, albums, artists, and the culture around them. He brings an artist&apos;s ear and a fan&apos;s curiosity to the conversation, making room for context, disagreement, and stories that deserve another listen.
            </p>
            <p>
              His goal is to make the Hip-Hop conversations we should be having, and invite you into them.
            </p>
          </div>
        </div>
      </section>
      <section className="border-t border-line bg-bg py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="kicker">Explore Broadway&apos;s Work</p>
          <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">The stories. <span className="text-accent">The music.</span> The conversation.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <Link href="/#videos" className="group border border-line bg-panel p-7 transition-colors hover:border-accent/60">
              <h3 className="font-display text-2xl text-white group-hover:text-accent">Watch the Channel</h3>
              <p className="mt-4 leading-7 text-muted">Videos on Hip-Hop history, artists, albums, sports, and culture.</p>
              <span className="mt-6 inline-block text-sm font-semibold text-accent">Watch videos →</span>
            </Link>
            <Link href="/music" className="group border border-line bg-panel p-7 transition-colors hover:border-accent/60">
              <h3 className="font-display text-2xl text-white group-hover:text-accent">Hear the Music</h3>
              <p className="mt-4 leading-7 text-muted">Listen to Broadway&apos;s original recordings and find the full catalog.</p>
              <span className="mt-6 inline-block text-sm font-semibold text-accent">Explore music →</span>
            </Link>
            <Link href="/blog" className="group border border-line bg-panel p-7 transition-colors hover:border-accent/60">
              <h3 className="font-display text-2xl text-white group-hover:text-accent">Read the Stories</h3>
              <p className="mt-4 leading-7 text-muted">Go beyond the clip with written Hip-Hop stories and commentary.</p>
              <span className="mt-6 inline-block text-sm font-semibold text-accent">Read the blog →</span>
            </Link>
          </div>
          <p className="mt-10 text-sm leading-7 text-muted">For collaborations and inquiries, visit the <Link href="/media-kit" className="text-white underline decoration-accent underline-offset-4 hover:text-accent">Media Kit</Link> or <a href={`mailto:${links.email}`} className="text-white underline decoration-accent underline-offset-4 hover:text-accent">get in touch</a>.</p>
        </div>
      </section>
    </>
  );
}
