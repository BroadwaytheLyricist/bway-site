import Image from "next/image";
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
                aria-label={`Listen on ${label} (opens in a new tab)`}
                className="music-platform-link"
              >
                <Image
                  aria-hidden="true"
                  alt=""
                  src={`/images/music-platforms/${icon}.png`}
                  width={icon === "amazonmusic" ? 160 : 68}
                  height={icon === "amazonmusic" ? 32 : 68}
                  className="music-platform-logo"
                />
              </a>
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
}
