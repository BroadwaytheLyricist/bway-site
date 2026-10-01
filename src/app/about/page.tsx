import type { Metadata } from "next";
import Link from "next/link";
import SectionAnchorLink from "@/components/SectionAnchorLink";
import AnchorLanding from "@/components/AnchorLanding";
import Image from "next/image";
import About from "@/components/sections/About";
import AboutArtReveal from "@/components/AboutArtReveal";
import ScrollRevealGroup from "@/components/ScrollRevealGroup";
import { links } from "@/lib/site";

const title = "About Broadway the Lyricist | Artist & Hip-Hop Storyteller";
const description =
  "Broadway the Lyricist is a Hip-Hop artist and content creator sharing music and storytelling to create the Hip-Hop conversations we should be having.";

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
      <AnchorLanding />
      <About standalone />
      <section id="story" className="about-story-section relative isolate overflow-hidden border-t border-line py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="relative lg:sticky lg:top-32 lg:self-start">
            <p className="kicker">The Story</p>
            <h2 className="relative z-10 mt-4 font-display text-4xl leading-tight text-white sm:text-5xl">An artist&apos;s ear. <span className="text-accent">A storyteller&apos;s voice.</span></h2>
            <AboutArtReveal className="about-story-art relative mt-7 h-[360px] max-w-[440px] overflow-hidden sm:h-[500px] lg:mt-8 lg:h-[540px]">
              <Image src="/images/about/story-hooded.webp" alt="" fill sizes="(max-width: 1023px) 100vw, 42vw" className="about-story-portrait object-contain object-bottom" />
            </AboutArtReveal>
          </div>
          <div className="about-story-copy space-y-6 text-base leading-8 text-white/75 sm:text-lg">
            <p>
              Music was Broadway the Lyricist&apos;s first way of telling a story. A Tampa-based solo artist from the East New York section of Brooklyn, New York, he writes from his own life, putting honest detail and strong songwriting alongside the bars. Nas, Jay-Z, Jadakiss, Prodigy, Ghostface Killah, and Black Thought are among the MCs who shaped his ear.
            </p>
            <p>
              He brought that music to New York audiences through several weekly performances at End of the Weak, one of the city&apos;s longest-running Hip-Hop open mics. It is a space for rising MCs and veterans alike; over the years, its stage has also welcomed KRS-One, Talib Kweli, and Lupe Fiasco.
            </p>
            <p>
              Broadway also performed at Maria Davis&apos; Monday Night Madness. Davis built showcases that brought unsigned artists before industry audiences. Her separate Mad Wednesdays nights became part of Hip-Hop history through her appearance on Jay-Z&apos;s &ldquo;22 Two&apos;s&rdquo; from <em>Reasonable Doubt</em>.
            </p>
            <p>
              His stages extended beyond New York, including Roxboro Raceway in North Carolina and a Pass the Aux event in Tampa where he performed his music for Jadakiss. His studio work connected him with Domingo, a fellow East New York producer whose credits include Big Pun and Rakim, as well as DJ PF Cuttin and Blahzay Martell, the Blahzay Blahzay duo behind &ldquo;Danger.&rdquo;
            </p>
            <p>
              In 2009, his music reached Wilt Wallace at Warner Bros. Records. Wallace later became the label&apos;s VP of Urban &amp; Rhythmic Promotion, though that contact did not lead to a deal. Broadway kept writing, recording, and performing.
            </p>
            <p>
              That experience now informs the videos and stories he makes about Hip-Hop history, albums, artists, and culture. He brings an artist&apos;s ear and a fan&apos;s curiosity to the records, leaving room for context, disagreement, and a closer listen. The goal is to create the Hip-Hop conversations we should be having, and invite you into them.
            </p>
          </div>
        </div>
      </section>
      <section className="about-work-section relative isolate overflow-hidden border-t border-line bg-[#0b1423] pb-20 sm:pb-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_34%,rgba(29,81,137,.18),transparent_46%),radial-gradient(circle_at_88%_82%,rgba(255,90,31,.09),transparent_40%)]" />
        <ScrollRevealGroup className="w-full">
          <div data-reveal-item className="music-artist-panorama relative mb-8 overflow-hidden sm:mb-10">
            <div className="music-artist-image absolute inset-y-0 left-1/2 w-full max-w-[1400px] -translate-x-1/2">
              <Image src="/images/music-artist-lineup.jpg" alt="Five artists in Broadway hoodies posing together on a stage" fill sizes="(max-width: 1400px) 100vw, 1400px" className="object-cover object-[center_35%]" />
            </div>
          </div>
        </ScrollRevealGroup>
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          <div>
            <p className="kicker">More Than Commentary</p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-white sm:text-5xl">The artist behind <span className="text-accent">the conversations.</span></h2>
          </div>
          <div className="text-base leading-8 text-white/75 sm:text-lg">
            <p>Music came first for Broadway. The stage, the camera, and the page now give him different ways to tell a story and invite you into the conversation.</p>
          </div>
        </div>
        <div className="relative z-10 mx-auto mt-12 grid max-w-7xl gap-5 px-5 sm:px-8 md:grid-cols-3">
          <SectionAnchorLink href="/#videos" className="group border border-white/15 bg-[#0b1729]/90 p-7 backdrop-blur-sm transition-colors hover:border-accent/60">
            <h3 className="font-display text-2xl text-white group-hover:text-accent">Watch the Channel</h3>
            <p className="mt-4 leading-7 text-muted">Videos on Hip-Hop history, artists, albums, sports, and culture.</p>
            <span className="mt-6 inline-block text-sm font-semibold text-accent">Watch videos →</span>
          </SectionAnchorLink>
          <Link href="/music" className="group border border-white/15 bg-[#0b1729]/90 p-7 backdrop-blur-sm transition-colors hover:border-accent/60">
            <h3 className="font-display text-2xl text-white group-hover:text-accent">Hear the Music</h3>
            <p className="mt-4 leading-7 text-muted">Listen to Broadway&apos;s original recordings and find the full catalog.</p>
            <span className="mt-6 inline-block text-sm font-semibold text-accent">Explore music →</span>
          </Link>
          <Link href="/blog" className="group border border-white/15 bg-[#0b1729]/90 p-7 backdrop-blur-sm transition-colors hover:border-accent/60">
            <h3 className="font-display text-2xl text-white group-hover:text-accent">Read the Stories</h3>
            <p className="mt-4 leading-7 text-muted">Go beyond the clip with written Hip-Hop stories and commentary.</p>
            <span className="mt-6 inline-block text-sm font-semibold text-accent">Read the blog →</span>
          </Link>
        </div>
        <div className="mx-auto mt-12 max-w-7xl px-5 text-sm leading-7 text-muted sm:px-8">For collaborations and inquiries, visit the <Link href="/media-kit" className="text-white underline decoration-accent underline-offset-4 hover:text-accent">Media Kit</Link> or <a href={`mailto:${links.email}`} className="text-white underline decoration-accent underline-offset-4 hover:text-accent">Get In Touch</a>.</div>
      </section>
    </>
  );
}
