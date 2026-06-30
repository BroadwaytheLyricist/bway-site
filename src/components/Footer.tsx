import Image from "next/image";
import { links, nav } from "@/lib/site";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
} from "@/components/icons";

const socials = [
  { label: "YouTube", href: links.youtube, Icon: YouTubeIcon },
  { label: "Instagram", href: links.instagram, Icon: InstagramIcon },
  { label: "TikTok", href: links.tiktok, Icon: TikTokIcon },
  { label: "Facebook", href: links.facebook, Icon: FacebookIcon },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <a href="/#home" className="flex items-center gap-3" aria-label="Broadway The Lyricist — home">
            <Image
              src="/images/logo.png"
              alt="Broadway The Lyricist"
              width={48}
              height={48}
              className="h-11 w-auto"
            />
            <span className="font-display text-xl tracking-wide">
              Broadway<span className="text-accent">.</span>
            </span>
          </a>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Footer">
            {nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-sm font-medium text-muted transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-line pt-6 text-center text-sm text-muted">
          © {new Date().getFullYear()} Broadway The Lyricist. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
