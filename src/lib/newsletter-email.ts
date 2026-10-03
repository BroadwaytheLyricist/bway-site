import { Resend } from "resend";
import { createConfirmToken } from "@/lib/newsletter-token";
import type { NewsletterSource } from "@/lib/newsletter-types";

// Shared by every signup spot (blog card, footer, Bar Lounge) so they all send
// the same "tap to confirm" email from hello@. Nobody is added to the list
// until they tap the link.

export function newsletterReady() {
  return !!(process.env.RESEND_API_KEY && process.env.NEWSLETTER_SECRET);
}

function confirmEmailHtml(confirmUrl: string) {
  return `
<!doctype html>
<html>
  <head>
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <style>:root { color-scheme: light dark; supported-color-schemes: light dark; }</style>
  </head>
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

export async function sendConfirmEmail(
  email: string,
  source: NewsletterSource,
  origin: string,
): Promise<boolean> {
  const token = createConfirmToken(email, source);
  const confirmUrl = `${origin}/newsletter/confirm?token=${encodeURIComponent(token)}`;

  const resend = new Resend(process.env.RESEND_API_KEY);
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
    return false;
  }
  return true;
}
