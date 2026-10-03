// Client-safe types and constants for the newsletter signup.
// (Server-only token logic lives in newsletter-token.ts.)

export const NEWSLETTER_SOURCES = ["blog", "footer"] as const;
export type NewsletterSource = (typeof NEWSLETTER_SOURCES)[number];

export type NewsletterState = {
  status: "idle" | "success" | "error";
  message: string;
};
