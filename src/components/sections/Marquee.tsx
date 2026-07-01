import { marqueeTags } from "@/lib/site";

export default function Marquee() {
  // Duplicate the list so the -50% translate loop is seamless.
  const items = [...marqueeTags, ...marqueeTags];

  return (
    <section
      aria-hidden="true"
      className="overflow-hidden border-y border-line bg-panel py-6"
    >
      {/* Soft edge fade so tags dissolve in/out at the sides instead of hard-cutting */}
      <div className="[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-8 pr-8">
          {items.map((tag, i) => (
            <div key={`${tag}-${i}`} className="flex items-center gap-8">
              <span className="font-display text-2xl tracking-wide text-white/80 transition-colors hover:text-white sm:text-3xl">
                {tag}
              </span>
              <span className="h-2 w-2 rotate-45 bg-accent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
