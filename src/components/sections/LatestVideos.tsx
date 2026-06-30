import SectionHeading from "@/components/SectionHeading";
import VideoEmbed from "@/components/VideoEmbed";
import { ArrowIcon, PlayIcon } from "@/components/icons";
import { links } from "@/lib/site";
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
    <section id="videos" className="bg-panel py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
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
      </div>
    </section>
  );
}
