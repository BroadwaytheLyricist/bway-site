"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { newsletterReady, sendConfirmEmail } from "@/lib/newsletter-email";
import {
  type NewsletterSource,
  type NewsletterState,
} from "@/lib/newsletter-types";

const emailSchema = z.email("Enter a valid email address.").max(200);

// Only the website forms use this action. The Bar Lounge has its own route.
const FORM_SOURCES: NewsletterSource[] = ["blog", "footer"];

const CHECK_INBOX =
  "Check your inbox. Tap the link in the email from hello@broadwaythelyricist.com to confirm.";

// Builds the confirm link on whatever domain the form was used on, so a
// Vercel preview sends preview links and the live site sends live links.
async function siteOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "broadwaythelyricist.com";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function subscribeNewsletter(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  // Spam trap: real people never see this field. Bots get a fake success.
  if (String(formData.get("signup_time") ?? "")) {
    console.log("[newsletter] honeypot tripped");
    return { status: "success", message: CHECK_INBOX };
  }

  const typed = String(formData.get("email") ?? "").trim();
  const parsed = emailSchema.safeParse(typed.toLowerCase());
  if (!parsed.success) {
    return { status: "error", message: "Enter a valid email address.", email: typed };
  }
  const email = parsed.data;

  const rawSource = String(formData.get("source") ?? "");
  const source: NewsletterSource = (FORM_SOURCES as string[]).includes(rawSource)
    ? (rawSource as NewsletterSource)
    : "footer";

  if (!newsletterReady()) {
    console.warn("[newsletter] RESEND_API_KEY or NEWSLETTER_SECRET not set.");
    return { status: "error", message: "Signups aren't open yet. Check back soon.", email };
  }

  try {
    const sent = await sendConfirmEmail(email, source, await siteOrigin());
    if (!sent) {
      return { status: "error", message: "That didn't go through. Try again in a minute.", email };
    }
    return { status: "success", message: CHECK_INBOX };
  } catch (err) {
    console.error("[newsletter] Unexpected error:", err);
    return { status: "error", message: "That didn't go through. Try again in a minute.", email };
  }
}
