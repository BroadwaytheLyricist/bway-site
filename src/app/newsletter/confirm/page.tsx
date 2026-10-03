import type { Metadata } from "next";
import Link from "next/link";
import { Resend } from "resend";
import { verifyConfirmToken } from "@/lib/newsletter-token";
import type { NewsletterSource } from "@/lib/newsletter-types";

export const metadata: Metadata = {
  title: "Confirm your email | Broadway the Lyricist",
  robots: { index: false, follow: false },
};

// Always run on request: confirming writes to Resend.
export const dynamic = "force-dynamic";

type ConfirmPageProps = {
  searchParams: Promise<{ token?: string }>;
};

type Outcome = "confirmed" | "expired" | "invalid" | "error";

// Not secret: these only identify the list in Resend. Env vars can override.
const SEGMENT_ID =
  process.env.NEWSLETTER_SEGMENT_ID ?? "354e4b66-d20f-400c-9eb1-6f68a1350495";
const TOPIC_ID =
  process.env.NEWSLETTER_TOPIC_ID ?? "4de8cb72-686f-4516-8339-b70f6466b892";

// Only reached after the fan taps the confirm link, so this is always an
// explicit opt-in. It touches Resend only: Bar Lounge accounts and progress
// live in Supabase and are never changed by subscribing or unsubscribing.
async function addToList(email: string, source: NewsletterSource): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[newsletter] RESEND_API_KEY not set.");
    return false;
  }

  const resend = new Resend(apiKey);
  const label = source === "blog" ? "Blog" : "Footer";
  const optIn = [{ id: TOPIC_ID, subscription: "opt_in" as const }];

  // New fan: create the contact, opted in to the Newsletter topic.
  const created = await resend.contacts.create({
    email,
    unsubscribed: false,
    segments: [{ id: SEGMENT_ID }],
    topics: optIn,
    properties: { source: label },
  });
  if (!created.error) return true;

  // If the "source" property isn't set up in Resend, still save the fan.
  if (/propert/i.test(created.error.message)) {
    const retry = await resend.contacts.create({
      email,
      unsubscribed: false,
      segments: [{ id: SEGMENT_ID }],
      topics: optIn,
    });
    if (!retry.error) return true;
  }

  // Already a contact (for example a Bar Lounge player who just opted in, or
  // a fan re-subscribing): opt them in without touching anything else.
  const updated = await resend.contacts.update({ email, unsubscribed: false });
  if (updated.error) {
    console.error("[newsletter] create failed:", created.error, "update failed:", updated.error);
    return false;
  }
  const topic = await resend.contacts.topics.update({ email, topics: optIn });
  if (topic.error) {
    console.error("[newsletter] topic opt-in failed:", topic.error);
    return false;
  }
  const added = await resend.contacts.segments.add({ email, segmentId: SEGMENT_ID });
  if (added.error && !/already/i.test(added.error.message)) {
    console.error("[newsletter] segment add failed:", added.error);
  }
  return true;
}

const copy: Record<Outcome, { kicker: string; title: React.ReactNode; body: string }> = {
  confirmed: {
    kicker: "You're in",
    title: (
      <>
        Welcome to the <span className="text-accent">Conversation</span>.
      </>
    ),
    body: "New videos, blog stories, and The Bar Lounge drops are headed your way. Every email has an unsubscribe link at the bottom.",
  },
  expired: {
    kicker: "Link expired",
    title: "That link has expired.",
    body: "Confirmation links work for 7 days. Sign up again at the bottom of any page and you'll get a fresh one.",
  },
  invalid: {
    kicker: "Link not recognized",
    title: "That link doesn't work.",
    body: "It may have been copied incompletely. Sign up again at the bottom of any page and you'll get a fresh one.",
  },
  error: {
    kicker: "Not finished",
    title: "We couldn't confirm you yet.",
    body: "Something went wrong on our end. Tap the link in your email again in a minute.",
  },
};

export default async function ConfirmPage({ searchParams }: ConfirmPageProps) {
  const { token } = await searchParams;

  let outcome: Outcome;
  try {
    const verified = verifyConfirmToken(token);
    if (!verified.ok) {
      outcome = verified.reason;
    } else {
      outcome = (await addToList(verified.email, verified.source)) ? "confirmed" : "error";
    }
  } catch (err) {
    console.error("[newsletter] confirm failed:", err);
    outcome = "error";
  }

  const { kicker, title, body } = copy[outcome];

  return (
    <section className="flex min-h-[70vh] items-center bg-bg pb-24 pt-36">
      <div className="mx-auto w-full max-w-2xl px-5 sm:px-8">
        <p className="kicker flex items-center gap-3">
          <span className="h-px w-8 bg-accent/60" />
          <span>{kicker}</span>
        </p>
        <h1 className="mt-4 font-display text-5xl leading-[0.95] text-white sm:text-6xl">
          {title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">{body}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/blog"
            className="btn-accent inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold text-white"
          >
            Read the blog
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-line px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:border-accent"
          >
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
