import SectionHeading from "@/components/SectionHeading";
import { ArrowIcon, PlayIcon } from "@/components/icons";
import { links } from "@/lib/site";

const destinations = [
  { label: "Apple Music", href: links.appleMusic },
  { label: "TIDAL", href: links.tidal },
  { label: "Deezer", href: links.deezer },
] as const;

export default function Music() {
  return (
    <section id="music" className="relative overflow-hidden bg-panel py-24 sm:py-32">
      <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_75%_30%,rgba(255,90,31,.34),transparent_32%),linear-gradient(120deg,transparent_15%,rgba(255,255,255,.025)_50%,transparent_80%)]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="03"
          kicker="Original Music"
          title={<>Broadway <span className="text-accent">On Record</span></>}
        />

        <div className="mt-12 grid overflow-hidden border border-line bg-bg/80 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-[#15100e] p-10">
            <div className="absolute h-72 w-72 rounded-full border border-white/10 bg-[repeating-radial-gradient(circle,#171717_0,#171717_3px,#0b0b0b_4px,#0b0b0b_6px)] shadow-2xl sm:h-80 sm:w-80" />
            <div className="absolute h-28 w-28 rounded-full bg-accent shadow-[0_0_50px_rgba(255,90,31,.35)]" />
            <div className="relative z-10 text-center">
              <p className="font-display text-3xl leading-none text-white">Broadway</p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.32em] text-white/70">The Lyricist</p>
            </div>
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            <p className="kicker">Featured Release</p>
            <h3 className="mt-3 font-display text-4xl leading-none text-white sm:text-5xl">God Is the Only GOAT</h3>
            <p className="mt-5 max-w-xl leading-relaxed text-muted">
              The recording artist behind the commentary. Stream the featured release and explore Broadway&apos;s catalog across your preferred platform.
            </p>

            <div className="mt-8 border border-line bg-panel/80 p-5">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                  <PlayIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">God Is the Only GOAT</p>
                  <p className="mt-1 text-xs text-muted">Player connection ready</p>
                  <div className="mt-3 h-px bg-white/10"><div className="h-px w-1/3 bg-accent" /></div>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {destinations.map((destination) => (
                <a key={destination.label} href={destination.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 border border-white/15 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white hover:border-accent hover:text-accent">
                  {destination.label}<ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>
            <p className="mt-5 text-xs leading-relaxed text-muted">
              The on-page player will be activated when the master audio or an embeddable SoundCloud/Bandcamp track is connected.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
