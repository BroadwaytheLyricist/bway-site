import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";

export default function About() {
  return (
    <section id="about" className="bg-bg py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Photo */}
          <div className="relative order-1">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line">
              <Image
                src="/images/about.jpg"
                alt="Broadway The Lyricist behind the mic in his studio"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/40 to-transparent" />
            </div>
            {/* Accent frame accent */}
            <div className="absolute -bottom-4 -right-4 -z-10 hidden h-32 w-32 rounded-2xl bg-accent/20 blur-2xl sm:block" />
          </div>

          {/* Copy */}
          <div className="order-2">
            <SectionHeading
              index="01"
              kicker="About"
              title={
                <>
                  The Voice Behind
                  <br />
                  The <span className="text-accent">Commentary</span>
                </>
              }
            />

            <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
              <p>
                Broadway The Lyricist is a hip-hop commentator, content creator,
                and recording artist dedicated to preserving and discussing
                hip-hop culture through thoughtful analysis, artist
                retrospectives, album discussions, reactions, and historical deep
                dives.
              </p>
              <p>
                Through long-form YouTube content, short-form social media
                content, and community engagement, Broadway explores the stories,
                albums, artists, and moments that helped shape hip-hop culture.
              </p>
            </div>

            <blockquote className="mt-8 border-l-2 border-accent pl-5">
              <p className="font-display text-xl leading-snug text-white sm:text-2xl">
                His mission is simple: to create the hip-hop conversations we
                should be having.
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
