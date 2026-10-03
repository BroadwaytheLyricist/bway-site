"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { createConfirmToken } from "@/lib/newsletter-token";
import {
  NEWSLETTER_SOURCES,
  type NewsletterSource,
  type NewsletterState,
} from "@/lib/newsletter-types";

const emailSchema = z.email("Enter a valid email address.").max(200);

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

function confirmEmailHtml(confirmUrl: string) {
  return `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#0a0e17;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0e17;">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#111827;border-radius:16px;border:1px solid #1f2937;">
            <tr>
              <td style="padding:36px 32px;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;color:#ff5a1f;">Tap In</p>
                <h1 style="margin:0 0 16px;font-size:26px;line-height:1.2;color:#ffffff;">One tap and you're in.</h1>
                <p style="margin:0 0 28px;font-size:16px;line-height:1.6;color:#c9d1dc;">
                  Confirm your email to get new videos, blog stories, and The Bar Lounge drops, straight from Broadway to your inbox.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:999px;background:#ff5a1f;">
                      <a href="${confirmUrl}" style="display:inline-block;padding:14px 32px;font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:999px;">Confirm my email</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:28px 0 0;font-size:13px;line-height:1.6;color:#9aa4b2;">
                  This link works for 7 days. If you didn't sign up, ignore this email and you won't hear from us.
                </p>
              </td>
            </tr>
          </table>
          <p style="margin:20px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6b7280;">
            Broadway the Lyricist &middot; broadwaythelyricist.com
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
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

  const parsed = emailSchema.safeParse(String(formData.get("email") ?? "").trim().toLowerCase());
  if (!parsed.success) {
    return { status: "error", message: "Enter a valid email address." };
  }
  const email = parsed.data;

  const rawSource = String(formData.get("source") ?? "");
  const source: NewsletterSource = (NEWSLETTER_SOURCES as readonly string[]).includes(rawSource)
    ? (rawSource as NewsletterSource)
    : "footer";

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !process.env.NEWSLETTER_SECRET) {
    console.warn("[newsletter] RESEND_API_KEY or NEWSLETTER_SECRET not set.");
    return { status: "error", message: "Signups aren't open yet. Check back soon." };
  }

  try {
    const token = createConfirmToken(email, source);
    const confirmUrl = `${await siteOrigin()}/newsletter/confirm?token=${encodeURIComponent(token)}`;

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from:
        process.env.NEWSLETTER_FROM_EMAIL ??
        "Broadway the Lyricist <hello@broadwaythelyricist.com>",
      to: email,
      subject: "Tap to confirm: Broadway the Lyricist",
      html: confirmEmailHtml(confirmUrl),
      text: `One tap and you're in.\n\nConfirm your email to get new videos, blog stories, and The Bar Lounge drops from Broadway the Lyricist:\n${confirmUrl}\n\nThis link works for 7 days. If you didn't sign up, ignore this email and you won't hear from us.`,
    });

    if (error) {
      console.error("[newsletter] Resend error:", error);
      return { status: "error", message: "That didn't go through. Try again in a minute." };
    }

    return { status: "success", message: CHECK_INBOX };
  } catch (err) {
    console.error("[newsletter] Unexpected error:", err);
    return { status: "error", message: "That didn't go through. Try again in a minute." };
  }
}
