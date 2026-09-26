"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import SectionHeading from "@/components/SectionHeading";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const subjectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const subject = subjectRef.current;
    if (!section || !subject) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      subject.style.setProperty("--about-x", "0px");
      subject.style.setProperty("--about-opacity", "1");
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (viewport - rect.top) / (viewport * 0.72)));
      const eased = 1 - Math.pow(1 - progress, 3);
      subject.style.setProperty("--about-x", `${(eased - 1) * 180}px`);
      subject.style.setProperty("--about-opacity", `${0.18 + eased * 0.82}`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative isolate min-h-[820px] overflow-hidden bg-bg py-24 sm:py-32 lg:min-h-[940px]"
    >
      <Image
        src="/images/stage-bg-v2.jpg"
        alt="A dark stage lit in teal and orange"
        fill
        sizes="100vw"
        className="-z-30 object-cover object-center"
      />
      <div className="absolute inset-0 -z-20 bg-gradient-to-l from-bg/84 via-bg/42 to-transparent" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-bg/48 via-transparent to-bg/10" />

      <div aria-hidden="true" className="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden lg:w-[56%]">
        <div
          ref={subjectRef}
          className="about-subject absolute -bottom-[1%] -left-[42%] h-[106%] w-[150%] sm:-left-[28%] sm:w-[128%] lg:-bottom-[2%] lg:-left-[16%] lg:h-[112%] lg:w-[132%]"
        >
          <Image
            src="/images/about-subject-v3.png"
            alt=""
            fill
            sizes="(max-width: 640px) 150vw, (max-width: 1024px) 128vw, 74vw"
            className="object-contain object-bottom"
          />
        </div>
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
