import NewsletterForm from "@/components/NewsletterForm";

// End-of-post signup card. The footer form is hidden on blog posts, so
// readers only ever see this one.
export default function BlogNewsletterCard() {
  return (
    <section
      aria-labelledby="blog-newsletter-heading"
      className="relative mt-16 overflow-hidden rounded-3xl border border-line bg-panel-2 px-6 py-9 shadow-xl shadow-black/20 sm:px-10 sm:py-12"
    >
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-accent" />
      <p className="kicker flex items-center gap-3">
        <span className="h-px w-8 bg-accent/60" />
        <span>Tap In</span>
      </p>
      <h2
        id="blog-newsletter-heading"
        className="mt-4 font-display text-4xl leading-[0.95] text-white sm:text-5xl"
      >
        Stay Up On the Latest <span className="text-accent">Conversations</span>.
      </h2>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
        New videos, blog stories, and The Bar Lounge drops, straight from
        Broadway to your inbox. No spam.
      </p>
      <NewsletterForm
        source="blog"
        finePrint="You'll get one confirmation email first. Unsubscribe anytime."
        className="mt-7 max-w-xl"
      />
    </section>
  );
}
