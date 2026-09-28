import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import PrintButton from "@/components/media-kit/PrintButton";
import {
  ArrowIcon,
  MailIcon,
  PlayIcon,
  YouTubeIcon,
  InstagramIcon,
} from "@/components/icons";
import { links } from "@/lib/site";
import { mediaKit } from "@/lib/media-kit";
import { getChannelStats, getFeaturedVideoViews, formatCompact } from "@/lib/youtube";

export const revalidate = 3600;

const socialPreviewImage = {
  url: "/images/og/broadway-social-preview.jpg",
  width: 1200,
  height: 630,
  alt: "Broadway The Lyricist social preview",
};

export const metadata: Metadata = {
  title: "Media Kit — Broadway The Lyricist",
  description:
    "Partnership media kit for Broadway The Lyricist — audience, performance, industry recognition, studio setup, and collaboration opportunities.",
  alternates: { canonical: "/media-kit" },
  openGraph: {
    title: "Media Kit — Broadway The Lyricist",
    description:
      "Partnership media kit for Broadway The Lyricist — audience, performance, industry recognition, studio setup, and collaboration opportunities.",
    url: "/media-kit",
    siteName: "Broadway The Lyricist",
    images: [socialPreviewImage],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Media Kit — Broadway The Lyricist",
    description:
      "Partnership media kit for Broadway The Lyricist — audience, performance, industry recognition, studio setup, and collaboration opportunities.",
    images: [socialPreviewImage],
  },
};

type Stat = { label: string; value: string; live?: boolean };

function StatCard({ label, value, live }: Stat) {
  return (
    <div className="rounded-2xl border border-line bg-panel-2 p-5">
      <div className="flex items-center gap-2">
        {live && (
          <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-accent">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Live
          </span>
        )}
      </div>
      <p className="mt-2 font-display text-4xl leading-none text-white sm:text-5xl">
        {value}
      </p>
      <p className="mt-2 text-sm text-muted">{label}</p>
    </div>
  );
}

export default async function MediaKitPage() {
  const [stats, featuredViews] = await Promise.all([
    getChannelStats(),
    getFeaturedVideoViews(mediaKit.topContent.flatMap((v) => "youtubeId" in v && v.youtubeId ? [v.youtubeId] : [])),
  ]);

  const youtubeStats: Stat[] = [
    {
      label: "YouTube Subscribers",
      value: stats ? formatCompact(stats.subscribers) : "859",
      live: !!stats,
    },
    {
      label: "YouTube Views (All-Time)",
      value: stats ? formatCompact(stats.views) : "123K",
      live: !!stats,
    },
    {
      label: "Videos Published",
      value: stats ? formatCompact(stats.videos) : "200",
      live: !!stats,
    },
  ];

  const socialStats: Stat[] = [
    { label: "Instagram Followers", value: mediaKit.manualStats.instagramFollowers },
    { label: "Instagram Views (30 Days)", value: mediaKit.manualStats.instagramViews30d },
    { label: "Accounts Reached (30 Days)", value: mediaKit.manualStats.instagramReached },
  ];

  return (
    <main className="bg-bg">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="media-kit-hero relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="kicker flex items-center gap-3">
              <span className="h-px w-8 bg-accent/60" />
              {mediaKit.edition}
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[0.9] sm:text-7xl">
              Broadway
              <br />
              The <span className="text-accent">Lyricist</span>
            </h1>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-muted">
              {mediaKit.tagline}
            </p>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              {mediaKit.positioning}
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              {mediaKit.badges.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {b}
                </span>
              ))}
            </div>

            <div className="no-print mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <PrintButton className="btn-accent inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5" />
              <a
                href={links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-white/40 hover:bg-white/10"
              >
                <PlayIcon className="h-4 w-4" />
                Watch on YouTube
              </a>
            </div>
          </div>

          <div className="media-kit-scene relative min-h-[370px] sm:min-h-[510px] lg:min-h-[570px]">
            <Image
              src="/images/media-kit/scene-curtain.webp"
              alt=""
              width={1080}
              height={1350}
              preload
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="media-kit-scene-layer media-kit-scene-background"
            />
            <Image
              src="/images/media-kit/scene-camera.webp"
              alt="Camera and monitor in Broadway The Lyricist's studio"
              width={1638}
              height={2048}
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="media-kit-scene-layer media-kit-scene-camera"
            />
            <Image
              src="/images/media-kit/scene-portrait.webp"
              alt="Broadway The Lyricist in a hooded portrait facing his camera"
              width={1638}
              height={2048}
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="media-kit-scene-layer media-kit-scene-subject"
            />
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────── */}
      <div className="media-kit-audience-stage border-y border-line">
      <section className="relative z-10 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            kicker="Audience & Performance"
            title={
              <>
                The <span className="text-accent">Numbers</span>
              </>
            }
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {youtubeStats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
            {socialStats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
          <p className="mt-6 text-xs text-muted">
            YouTube figures update automatically via the YouTube Data API.
            Instagram figures are reported from the latest 30-day insights.
          </p>
        </div>
      </section>

      {/* ── Audience profile ───────────────────────────────── */}
      <section className="relative z-10 border-t border-line py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              kicker="Audience Profile"
              title={
                <>
                  Culture-First <span className="text-accent">Viewership</span>
                </>
              }
            />
            <p className="mt-6 text-lg leading-relaxed text-muted">
              The Broadway the Lyricist audience sits at the intersection of
              hip-hop culture, creator conversations, cinematic studio
              production, and thoughtful music commentary — an engaged base built
              for high-retention storytelling.
            </p>
          </div>
          <ul className="flex flex-col justify-center gap-3">
            {mediaKit.audience.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-line bg-panel p-5 text-white"
              >
                <span className="inline-flex h-2 w-2 flex-none rounded-full bg-accent" />
                <span className="text-sm font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      </div>

      {/* ── Top content ────────────────────────────────────── */}
      <section className="media-kit-content-stage py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            kicker="Performance & Proof"
            title={
              <>
                Content That <span className="text-accent">Resonates</span>
              </>
            }
          />
          {(["Instagram Reel", "YouTube"] as const).map((platform) => (
          <div key={platform} className="mt-10">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {platform === "YouTube" ? "YouTube Videos" : "Instagram Reels"}
            </h3>
            <div className="grid gap-5 md:grid-cols-3">
            {mediaKit.topContent.filter((v) => v.platform === platform).map((v) => {
              const cardClass =
                "group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-accent/15 via-panel-2 to-bg";
              const body = (
                <>
                  <div className={`relative flex items-center justify-center overflow-hidden bg-[#080d19] ${platform === "YouTube" ? "aspect-video" : "aspect-[4/5]"}`}>
                    {/* Native img supports the YouTube thumbnail host without changing the app image configuration. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={v.thumbnail} alt={`${v.title} thumbnail`} loading="lazy" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.025]" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-display text-4xl leading-none text-white">
                        {"youtubeId" in v && v.youtubeId && featuredViews[v.youtubeId] !== undefined
                          ? formatCompact(featuredViews[v.youtubeId])
                          : v.views}
                      </p>
                      <ArrowIcon className="h-5 w-5 shrink-0 -rotate-45 text-muted transition-colors group-hover:text-accent" />
                    </div>
                    <div className="mt-4">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent">
                      {v.platform}
                    </p>
                    <h3 className="mt-1.5 text-sm font-semibold leading-snug text-white">
                      {v.title}
                    </h3>
                    </div>
                  </div>
                </>
              );

              return v.url ? (
                <a
                  key={v.title}
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${cardClass} transition-all hover:-translate-y-1 hover:border-accent/50`}
                >
                  {body}
                </a>
              ) : (
                <div key={v.title} className={cardClass}>
                  {body}
                </div>
              );
            })}
            </div>
          </div>
          ))}
        </div>
      </section>

      {/* ── Industry recognition ───────────────────────────── */}
      <section className="media-kit-recognition-stage relative isolate overflow-hidden py-20 sm:py-24">
        <div aria-hidden="true" className="media-kit-recognition-watermarks pointer-events-none absolute inset-0">
          <div className="article-watermark-orange media-kit-recognition-watermark media-kit-recognition-watermark-left opacity-[0.12]" />
          <div className="media-kit-recognition-watermark media-kit-recognition-watermark-right opacity-[0.09]">
            <Image src="/images/logo.png" alt="" fill sizes="220px" className="scale-[1.9] object-contain" />
          </div>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            kicker="Cultural Credibility"
            title={
              <>
                Industry <span className="text-accent">Recognition</span>
              </>
            }
          />
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Direct engagement, conversations, shares, and follows from respected
            voices across hip-hop, media, film, and culture.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {mediaKit.recognition.map((r) => (
              <article
                key={r.name}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-2xl shadow-black/10"
              >
                <div className="flex h-[340px] flex-col items-center justify-center gap-3 bg-[#070b13] p-4 sm:h-[400px]">
                  <Image
                    src={r.proof.src}
                    alt={r.proof.alt}
                    width={r.proof.width}
                    height={r.proof.height}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    loading="eager"
                    className={`max-w-full rounded-xl object-contain ${"secondaryProof" in r ? "max-h-[32%]" : "max-h-full"}`}
                  />
                  {"secondaryProof" in r && r.secondaryProof && (
                    <Image
                      src={r.secondaryProof.src}
                      alt={r.secondaryProof.alt}
                      width={r.secondaryProof.width}
                      height={r.secondaryProof.height}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="max-h-[62%] max-w-full rounded-xl object-contain"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent">
                    Featured Recognition
                  </p>
                  <h3 className="mt-2 font-display text-3xl leading-none text-white">
                    {r.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{r.credit}</p>
                  <p className="mt-auto pt-4 text-sm leading-relaxed text-white/80">
                    {r.note}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
            Recognition includes engagement from respected voices across music,
            media, film, television, and Hip-Hop culture.
          </p>
        </div>
      </section>

      {/* ── Studio & gear ──────────────────────────────────── */}
      <section className="media-kit-ecosystem-stage py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            kicker="Studio & Distribution"
            title={
              <>
                Creator Production <span className="text-accent">Ecosystem</span>
              </>
            }
          />
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            A dedicated creator studio built for professional production,
            livestreaming, podcasting, and multi-platform distribution.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mediaKit.studio.map((img) => (
              <div
                key={img.src}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="kicker mb-4">Creator Workflow</h3>
              <div className="flex flex-wrap gap-2.5">
                {mediaKit.gear.map((g) => (
                  <span
                    key={g}
                    className="rounded-full border border-line bg-panel-2 px-4 py-2 text-sm text-white"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="kicker mb-4">Content Capabilities</h3>
              <ul className="grid gap-2 sm:grid-cols-2">
                {mediaKit.capabilities.map((c) => (
                  <li key={c} className="flex items-center gap-2.5 text-sm text-white/90">
                    <span className="inline-flex h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Partnerships ───────────────────────────────────── */}
      <section className="media-kit-partnership-stage py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            kicker="Creator Partnership Opportunities"
            title={
              <>
                Built For <span className="text-accent">Collaboration</span>
              </>
            }
          />
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Designed for culture-first creator partnerships — sponsorships,
            content partnerships, campaign storytelling, and platform-native
            integrations.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mediaKit.partnerships.map((p) => (
              <div
                key={p}
                className="flex items-center gap-3 rounded-2xl border border-line bg-panel p-5"
              >
                <span className="inline-flex h-2 w-2 flex-none rounded-full bg-accent" />
                <span className="text-sm font-medium text-white">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────── */}
      <section className="media-kit-contact-stage border-t border-line py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="rounded-3xl border border-line bg-panel-2 p-8 sm:p-12">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div>
                <SectionHeading
                  kicker="Brand Partnerships"
                  title={
                    <>
                      Let&apos;s <span className="text-accent">Work</span>
                    </>
                  }
                />
                <p className="mt-5 text-lg leading-relaxed text-muted">
                  Have a partnership in mind? Share the brand, the idea, and
                  your timeline. Let&apos;s make something that resonates.
                </p>
                <a
                  href={`mailto:${links.email}?subject=Partnership%20Inquiry`}
                  className="btn-accent mt-7 inline-flex items-center justify-center gap-3 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                >
                  <MailIcon className="h-5 w-5" />
                  Email a Partnership Inquiry
                </a>
                <p className="mt-4 text-sm text-muted">{links.email}</p>
              </div>

              <div className="border-t border-line pt-7 lg:border-l lg:border-t-0 lg:py-2 lg:pl-10">
                <p className="kicker mb-3">See the Work</p>
                <p className="mb-5 text-sm leading-relaxed text-muted">
                  Explore the videos and conversations behind the numbers.
                </p>
                <div className="flex flex-col gap-3">
                <a
                  href={links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-xl border border-line bg-panel/60 px-4 py-3 transition-colors hover:border-accent/50"
                >
                  <span className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <YouTubeIcon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium text-white">Watch on YouTube</span>
                  </span>
                  <ArrowIcon className="h-5 w-5 -rotate-45 text-muted transition-colors group-hover:text-accent" />
                </a>
                <a
                  href={links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-xl border border-line bg-panel/60 px-4 py-3 transition-colors hover:border-accent/50"
                >
                  <span className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <InstagramIcon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium text-white">See the Reels on Instagram</span>
                  </span>
                  <ArrowIcon className="h-5 w-5 -rotate-45 text-muted transition-colors group-hover:text-accent" />
                </a>
                </div>
              </div>
            </div>
          </div>

          <div className="no-print mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-white"
            >
              ← Back to the site
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
