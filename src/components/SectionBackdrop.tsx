import Image from "next/image";

type SectionBackdropProps = {
  /** Images to echo behind the section (local paths or full URLs). Up to 3. */
  images: string[];
  /** Overall strength of the glow, 0 to 1. */
  intensity?: number;
};

/**
 * Bokeh backdrop: a mirrored, heavily blurred echo of a section's own
 * imagery sitting behind its content, so no section reads as an empty void
 * and the whole page shares the hero's stage-light feel.
 *
 * Decorative only: hidden from screen readers, never blocks clicks, and uses
 * tiny image sizes because the blur hides detail anyway. The parent section
 * needs `relative isolate overflow-hidden`.
 */
export default function SectionBackdrop({
  images,
  intensity = 0.55,
}: SectionBackdropProps) {
  const srcs = images.filter(Boolean).slice(0, 3);
  if (srcs.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Mirrored, blurred echo of the section's imagery */}
      <div
        className="absolute -inset-[12%] flex scale-x-[-1] blur-[56px] saturate-150"
        style={{ opacity: intensity }}
      >
        {srcs.map((src, i) => (
          <div key={`${src}-${i}`} className="relative h-full flex-1">
            {src.startsWith("http") ? (
              // Remote thumbnails (YouTube) are blurred beyond recognition, so
              // a plain tag at a small size is all we need here.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <Image
                src={src}
                alt=""
                fill
                sizes="256px"
                className="object-cover"
              />
            )}
          </div>
        ))}
      </div>

      {/* Soft light orbs for the bokeh feel */}
      <div className="absolute left-[8%] top-[18%] h-48 w-48 rounded-full bg-accent/15 blur-3xl" />
      <div className="absolute bottom-[14%] right-[10%] h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />

      {/* Fade into the page color at the top and bottom so sections flow
          into each other with no hard seams, and keep text legible. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-panel) 0%, color-mix(in srgb, var(--color-panel) 55%, transparent) 22%, color-mix(in srgb, var(--color-panel) 55%, transparent) 78%, var(--color-panel) 100%)",
        }}
      />
    </div>
  );
}
