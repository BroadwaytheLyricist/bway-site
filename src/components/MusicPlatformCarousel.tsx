import type { CSSProperties } from "react";
import { links } from "@/lib/site";

const platforms = [
  { label: "Bandcamp", href: links.bandcamp, icon: "bandcamp" },
  { label: "Spotify", href: links.spotify, icon: "spotify" },
  { label: "Apple Music", href: links.appleMusic, icon: "applemusic" },
  { label: "Amazon Music", href: links.amazonMusic, icon: "amazonmusic" },
  { label: "YouTube Music", href: links.youtubeMusic, icon: "youtubemusic" },
] as const;

export default function MusicPlatformCarousel() {
  return (
    <nav className="music-platforms mt-10" aria-label="Listen on your preferred music platform">
      <div className="music-platforms-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="music-platforms-group" aria-hidden={copy === 1 ? true : undefined}>
            {platforms.map(({ label, href, icon }) => (
              <a
                key={`${copy}-${label}`}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={copy === 1 ? -1 : undefined}
                className="music-platform-link group"
              >
                <span
                  aria-hidden="true"
                  className={`music-platform-icon ${icon === "amazonmusic" ? "music-platform-icon-wide" : ""}`}
                  style={{ "--platform-icon": `url('/images/music-platforms/${icon}.svg')` } as CSSProperties}
                />
                <span>{label}</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
}
