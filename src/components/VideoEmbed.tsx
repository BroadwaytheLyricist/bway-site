type VideoEmbedProps = {
  embedUrl: string;
  title: string;
};

export default function VideoEmbed({ embedUrl, title }: VideoEmbedProps) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-line bg-panel-2 transition-colors hover:border-accent/40">
      <div className="relative aspect-video w-full">
        <iframe
          src={embedUrl}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
