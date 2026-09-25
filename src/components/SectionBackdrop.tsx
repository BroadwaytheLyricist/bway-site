type SectionBackdropProps = {
  image?: string;
  position?: string;
  mirror?: boolean;
  className?: string;
};

/**
 * Decorative, deliberately soft echo of a section's foreground artwork.
 * Kept out of the accessibility tree and isolated behind the real content.
 */
export default function SectionBackdrop({
  image,
  position = "center",
  mirror = true,
  className = "",
}: SectionBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className={`section-atmosphere absolute inset-0 overflow-hidden ${className}`}
    >
      {image && (
        <div
          className={`section-atmosphere-image absolute inset-[-8%] bg-cover bg-no-repeat ${
            mirror ? "scale-x-[-1]" : ""
          }`}
          style={{ backgroundImage: `url("${image}")`, backgroundPosition: position }}
        />
      )}
      <div className="section-atmosphere-wash absolute inset-0" />
      <div className="section-atmosphere-glow section-atmosphere-glow-left" />
      <div className="section-atmosphere-glow section-atmosphere-glow-right" />
    </div>
  );
}
