import type { CSSProperties } from "react";

type SmokeDriftProps = {
  /** Horizontal center of the warm (orange) wisp, e.g. "50%". */
  warmX?: string;
  /** Horizontal center of the cool (blue) haze, e.g. "36%". */
  coolX?: string;
  className?: string;
};

/**
 * Slow, looping stage smoke that layers over a background photo.
 * Purely decorative: hidden from screen readers and never blocks clicks.
 * The drift is switched off for visitors who prefer reduced motion
 * (see globals.css).
 */
export default function SmokeDrift({
  warmX = "50%",
  coolX = "36%",
  className = "",
}: SmokeDriftProps) {
  const vars = {
    "--smoke-warm-x": warmX,
    "--smoke-cool-x": coolX,
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={vars}
    >
      <div className="smoke-layer smoke-cool">
        <span />
      </div>
      <div className="smoke-layer smoke-warm">
        <span />
      </div>
    </div>
  );
}
