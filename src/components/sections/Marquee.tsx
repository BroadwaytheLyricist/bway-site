import Image from "next/image";
import { brandTagline } from "@/lib/site";

export default function Marquee() {
  const items = Array.from({ length: 6 }, () => brandTagline);

  return (
    <section
      aria-label={brandTagline}
      className="relative z-10 -mt-9 overflow-hidden border-y border-white/10 bg-panel/95 py-5 shadow-2xl backdrop-blur sm:-mt-11 sm:py-6"
    >
      {/* Soft edge fade so tags dissolve in/out at the sides instead of hard-cutting */}
      <div className="[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div aria-hidden="true" className="flex w-max animate-marquee items-center gap-8 pr-8">
          {items.map((tag, i) => (
            <div key={`${tag}-${i}`} className="flex items-center gap-8">
              <span className="font-display text-2xl tracking-wide text-white/90 sm:text-3xl">
                The Hip-Hop Conversations We <span className="text-accent">Should</span> Be Having
              </span>
              <span className="relative block h-9 w-9 shrink-0 sm:h-10 sm:w-10">
                <Image
                  src="/images/logo.png"
                  alt=""
                  fill
                  sizes="40px"
                  className="object-contain drop-shadow-[0_0_10px_rgba(255,90,31,0.35)]"
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
