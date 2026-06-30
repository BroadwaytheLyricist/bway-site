import SectionHeading from "@/components/SectionHeading";
import VideoEmbed from "@/components/VideoEmbed";
import { featuredVideos } from "@/lib/site";

export default function Featured() {
  return (
    <section id="featured" className="bg-bg py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="02"
          kicker="Featured"
          title={
            <>
              Start With These <span className="text-accent">Deep Dives</span>
            </>
          }
        />
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          Long-form breakdowns on the stories, debates, and history that shaped
          the culture — the place to start if you&apos;re new here.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {featuredVideos.map((video) => (
            <article key={video.id} className="flex flex-col gap-4">
              <VideoEmbed
                embedUrl={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
              />
              <h3 className="text-lg font-semibold leading-snug text-white">
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  {video.title}
                </a>
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
