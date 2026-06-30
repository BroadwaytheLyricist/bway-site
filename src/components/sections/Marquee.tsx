import { marqueeTags } from "@/lib/site";

export default function Marquee() {
  // Duplicate the list so the -50% translate loop is seamless.
  const items = [...marqueeTags, ...marqueeTags];

  return (
    <section
      aria-hidden="true"
      className="border-y border-line bg-panel py-5 overflow-hidden"
    >
      <div className="flex w-max animate-marquee items-center gap-8 pr-8">
        {items.map((tag, i) => (
          <div key={`${tag}-${i}`} className="flex items-center gap-8">
            <span className="font-display text-2xl tracking-wide text-white/80 sm:text-3xl">
              {tag}
            </span>
            <span className="h-2 w-2 rotate-45 bg-accent" />
          </div>
        ))}
      </div>
    </section>
  );
}
