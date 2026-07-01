import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import { ArrowIcon, PlayIcon } from "@/components/icons";
import { links, playlists } from "@/lib/site";

type Playlist = (typeof playlists)[number];
const hasImage = (p: Playlist): p is Playlist & { image: string } =>
  "image" in p && typeof p.image === "string";

export default function Playlists() {
  return (
    <section id="playlists" className="bg-panel py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            kicker="Playlists"
            title={
              <>
                Browse <span className="text-accent">The Series</span>
              </>
            }
          />
          <a
            href={`${links.youtube}/playlists`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-accent"
          >
            All playlists
            <ArrowIcon className="h-4 w-4" />
          </a>
        </div>

        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          Recurring series and themed collections — pick a lane and binge the
          full run on YouTube.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.slice(0, 3).map((playlist) => (
            <a
              key={playlist.url}
              href={playlist.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-panel-2 transition-all hover:-translate-y-1 hover:border-accent/50"
            >
              <div className="relative aspect-video overflow-hidden">
                {hasImage(playlist) ? (
                  <Image
                    src={playlist.image}
                    alt={playlist.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-end bg-gradient-to-br from-accent/35 via-panel-2 to-bg p-5">
                    <h3 className="font-display text-2xl leading-[0.95] text-white">
                      {playlist.title}
                    </h3>
                  </div>
                )}

                {/* Play affordance: darken + centered circle on hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/30">
                  <span className="inline-flex h-14 w-14 scale-90 items-center justify-center rounded-full bg-accent text-white opacity-0 shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                    <PlayIcon className="h-6 w-6" />
                  </span>
                </div>

                {/* Count badge — YouTube-style, bottom-right corner */}
                <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-md bg-black/75 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white backdrop-blur">
                  <PlayIcon className="h-3 w-3" />
                  {playlist.count} videos
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 p-5">
                <p className="text-sm text-muted">Watch the full series</p>
                <ArrowIcon className="h-5 w-5 -rotate-45 text-muted transition-colors group-hover:text-accent" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
