import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";

export default function About() {
  return (
    <section
      id="about"
      className="relative isolate min-h-[760px] overflow-hidden bg-bg py-24 sm:py-32 lg:min-h-[820px]"
    >
      <Image
        src="/images/about-stage.webp"
        alt="A dark stage lit in teal and orange"
        fill
        sizes="100vw"
        className="-z-30 object-cover object-center"
      />
      <div className="absolute inset-0 -z-20 bg-gradient-to-l from-bg/96 via-bg/64 to-bg/12" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-bg via-transparent to-bg/25" />

      <div
        aria-hidden="true"
        className="about-subject absolute -bottom-[7%] -left-[28%] -z-10 h-[112%] w-[112%] sm:-left-[18%] sm:w-[92%] lg:-bottom-[9%] lg:-left-[9%] lg:h-[122%] lg:w-[68%]"
      >
        <Image
          src="/images/about-subject.png"
          alt=""
          fill
          sizes="(max-width: 640px) 112vw, (max-width: 1024px) 92vw, 68vw"
          className="object-contain object-bottom drop-shadow-[0_0_16px_rgba(31,182,255,0.28)]"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="ml-auto max-w-xl lg:max-w-[34rem]">
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

          <div className="mt-8 space-y-5 text-base leading-relaxed text-white/72 sm:text-lg lg:pr-4">
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

          <blockquote className="mt-8 border-l-2 border-accent bg-bg/20 py-1 pl-5 backdrop-blur-[2px]">
            <p className="font-display text-xl leading-snug text-white sm:text-2xl">
              His mission is simple: to create the hip-hop conversations we
              should be having.
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
