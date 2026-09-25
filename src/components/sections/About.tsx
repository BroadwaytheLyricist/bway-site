import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";

export default function About() {
  return (
    <section id="about" className="relative isolate overflow-hidden bg-bg py-24 sm:py-32">
      {/* A soft, full-width echo lets the studio environment dissolve into the
          section while the untouched source photo stays crisp in front. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/images/about.jpg"
          alt=""
          fill
          sizes="100vw"
          className="scale-110 object-cover object-center opacity-25 blur-3xl"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,14,23,.62),rgba(10,14,23,.88)_56%,#0a0e17_88%)]" />
        <div className="absolute inset-0 bg-gradient-to-y from-bg/80 via-transparent to-bg/90" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          {/* Photo */}
          <div className="relative order-1 isolate">
            <div className="absolute inset-[10%] -z-10 rounded-[3rem] bg-[radial-gradient(circle,rgba(255,90,31,.3),rgba(20,108,180,.16)_46%,transparent_72%)] blur-3xl" />
            <div className="relative aspect-[4/5] overflow-visible">
              {/* Soft environmental plate: recognizable, but recessed. */}
              <Image
                src="/images/about.jpg"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="about-environment object-cover object-center"
              />

              {/* Sharp foreground is the exact same source photograph, masked
                  around Broadway, the microphone, and boom arm for depth. */}
              <Image
                src="/images/about.jpg"
                alt="Broadway The Lyricist behind the mic in his studio"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="about-subject object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/55 via-transparent to-transparent" />
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
