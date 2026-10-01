type SectionHeadingProps = {
  as?: "h1" | "h2";
  index?: string;
  kicker: string;
  title: React.ReactNode;
  className?: string;
};

export default function SectionHeading({
  as: Heading = "h2",
  index,
  kicker,
  title,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={className}>
      <p className="kicker flex items-center gap-3">
        {index && <span>{index}</span>}
        <span className="h-px w-8 bg-accent/60" />
        <span>{kicker}</span>
      </p>
      <Heading className="mt-4 font-display text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
        {title}
      </Heading>
    </div>
  );
}
