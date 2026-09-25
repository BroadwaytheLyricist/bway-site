import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import VideoEmbed from "@/components/VideoEmbed";
import { ArrowIcon, PlayIcon } from "@/components/icons";
import { links, playlists } from "@/lib/site";
import { getLatestVideos } from "@/lib/youtube";

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function LatestVideos() {
  const videos = await getLatestVideos(2);

  return (
    <section id="videos" className="relative isolate overflow-hidden bg-panel py-24 sm:py-32">
      <div aria-hidden="true" className="absolute inset-0 -z-20 grid md:grid-cols-2">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-cover bg-center opacity-[0.19] blur-[4px] scale-[1.025]"
            style={{ backgroundImage: `url(https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg)` }}
          />
        ))}
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-panel/86" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            kicker="Latest Uploads"
            title={
              <>
                Fresh From <span className="text-accent">The Channel</span>
              </>
            }
          />
          <a
            href={links.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-accent"
          >
            View all on YouTube
            <ArrowIcon className="h-4 w-4" />
          </a>
        </div>

        {videos.length > 0 ? (
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {videos.map((video) => (
              <article key={video.id} className="flex flex-col gap-4">
                <VideoEmbed embedUrl={video.embedUrl} title={video.title} />
                <div>
                  {video.published && (
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      {formatDate(video.published)}
                    </p>
                  )}
                  <h3 className="mt-2 text-lg font-semibold leading-snug text-white">
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-accent"
                    >
                      {video.title}
                    </a>
                  </h3>
                </div>
              </article>
            ))}
          </div>
        ) : (
          // Graceful fallback when the RSS feed is unavailable.
          <div className="mt-12 rounded-2xl border border-line bg-panel-2 p-10 text-center">
            <p className="text-lg text-muted">
              New deep dives drop regularly on YouTube.
            </p>
            <a
              href={links.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent mt-6 inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              <PlayIcon className="h-4 w-4" />
              Watch on YouTube
            </a>
          </div>
        )}

        <div className="mt-16 border-t border-line pt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="kicker">Playlists</p>
              <h3 className="mt-2 font-display text-2xl text-white sm:text-3xl">
                Explore the Series
              </h3>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              Recurring conversations, organized for the way you want to watch.
            </p>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            {playlists.slice(0, 3).map((playlist, index) => (
              <article
                key={playlist.title}
                className="group overflow-hidden border border-line bg-bg/75 transition-all hover:-translate-y-0.5 hover:border-accent/50"
              >
                <a
                  href={playlist.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block aspect-video overflow-hidden bg-panel-2"
                  aria-label={`Watch ${playlist.title} on YouTube`}
                >
                  {playlist.image && (
                    <Image
                      src={playlist.image}
                      alt={playlist.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                    />
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/25">
                    <span className="flex h-12 w-12 scale-90 items-center justify-center rounded-full bg-accent text-white opacity-0 shadow-xl transition-all group-hover:scale-100 group-hover:opacity-100">
                      <PlayIcon className="h-5 w-5" />
                    </span>
                  </span>
                </a>
                <a
                  href={playlist.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-24 items-center justify-between gap-4 p-5"
                >
                  <span>
                    <span className="font-display text-sm text-accent/70">0{index + 1}</span>
                    <span className="mt-1 block font-semibold leading-snug text-white group-hover:text-accent">{playlist.title}</span>
                  </span>
                  <ArrowIcon className="h-5 w-5 shrink-0 text-muted transition-all group-hover:translate-x-1 group-hover:text-accent" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
