import AboutPhoto from "@/components/sections/AboutPhoto";
import SectionHeading from "@/components/SectionHeading";

export default function About() {
  return (
    <section id="about" className="relative isolate overflow-hidden bg-bg py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.45fr_1fr] lg:gap-12">
          {/* Photo: layered like the hero (stage background + cut-out) */}
          <div className="relative order-1">
            <AboutPhoto />
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
