"use server";

import { Resend } from "resend";
import { links } from "@/lib/site";
import {
  contactSchema,
  type ContactInput,
  type ContactState,
} from "@/lib/contact-schema";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function submitContact(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Silently succeed on honeypot hits so bots get no signal — checked before
  // validation so a bot that fills only this field can't learn which fields
  // are required.
  const honeypot = String(formData.get("contact_time") ?? "");
  if (honeypot) {
    console.log("[contact] honeypot tripped");
    return { status: "success", message: "Thanks — your message was sent." };
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: Partial<Record<keyof ContactInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactInput;
      if (key && !errors[key]) errors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      errors,
    };
  }

  const { name, email, subject, message } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL ?? links.email;
  // Resend requires a verified domain; falls back to their shared test sender.
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL ??
    "Broadway The Lyricist <onboarding@resend.dev>";

  if (!apiKey) {
    // Email isn't configured yet (no API key). Don't pretend it sent.
    console.warn("[contact] RESEND_API_KEY not set — submission not emailed.");
    return {
      status: "error",
      message:
        "The contact form isn't connected yet. Please email us directly in the meantime.",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `New website message: ${subject}`,
      text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
          <h2 style="margin:0 0 12px">New website message</h2>
          <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <hr style="border:none;border-top:1px solid #ddd;margin:16px 0" />
          <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
        </div>
      `,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return {
        status: "error",
        message: "Something went wrong sending your message. Please try again.",
      };
    }

    return {
      status: "success",
      message: "Thanks — your message was sent. We'll be in touch soon.",
    };
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return {
      status: "error",
      message: "Something went wrong sending your message. Please try again.",
    };
  }
}
