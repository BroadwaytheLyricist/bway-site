import SectionHeading from "@/components/SectionHeading";
import {
  ArrowIcon,
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
} from "@/components/icons";
import { links } from "@/lib/site";

const socials = [
  {
    label: "YouTube",
    handle: "Broadway the Lyricist",
    href: links.youtube,
    Icon: YouTubeIcon,
  },
  {
    label: "Instagram",
    handle: "@broadwaythelyricist",
    href: links.instagram,
    Icon: InstagramIcon,
  },
  {
    label: "TikTok",
    handle: "@broadwaythelyricist",
    href: links.tiktok,
    Icon: TikTokIcon,
  },
  {
    label: "Facebook",
    handle: "Broadway The Lyricist",
    href: links.facebook,
    Icon: FacebookIcon,
  },
];

export default function Follow() {
  return (
    <section id="follow" className="bg-bg py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="04"
          kicker="Follow"
          title={
            <>
              Join The <span className="text-accent">Conversation</span>
            </>
          }
        />
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          New deep dives, reactions, and debates across every platform. Follow
          along and add your voice.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {socials.map(({ label, handle, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-6 rounded-2xl border border-line bg-panel p-6 transition-all hover:-translate-y-1 hover:border-accent/50"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white transition-colors group-hover:bg-accent group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <ArrowIcon className="h-5 w-5 -rotate-45 text-muted transition-colors group-hover:text-accent" />
              </div>
              <div>
                <p className="font-display text-xl tracking-wide text-white">
                  {label}
                </p>
                <p className="mt-1 text-sm text-muted">{handle}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
