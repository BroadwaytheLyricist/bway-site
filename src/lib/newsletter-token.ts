import { createHmac, timingSafeEqual } from "node:crypto";
import { NEWSLETTER_SOURCES, type NewsletterSource } from "@/lib/newsletter-types";

// Confirmation links are signed so nobody can confirm an address they don't
// own, and nothing is stored until the fan taps the link.
const LINK_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

type TokenPayload = { e: string; s: NewsletterSource; x: number };

function secret() {
  const value = process.env.NEWSLETTER_SECRET;
  if (!value || value.length < 24) {
    throw new Error("NEWSLETTER_SECRET is missing or too short.");
  }
  return value;
}

function sign(data: string) {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

export function createConfirmToken(email: string, source: NewsletterSource) {
  const payload: TokenPayload = { e: email, s: source, x: Date.now() + LINK_LIFETIME_MS };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

export type VerifiedToken =
  | { ok: true; email: string; source: NewsletterSource }
  | { ok: false; reason: "invalid" | "expired" };

export function verifyConfirmToken(token: string | undefined): VerifiedToken {
  if (!token || !token.includes(".")) return { ok: false, reason: "invalid" };
  const [data, signature] = token.split(".");

  const expected = Buffer.from(sign(data));
  const given = Buffer.from(signature ?? "");
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return { ok: false, reason: "invalid" };
  }

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString()) as TokenPayload;
    if (typeof payload.e !== "string" || !NEWSLETTER_SOURCES.includes(payload.s)) {
      return { ok: false, reason: "invalid" };
    }
    if (Date.now() > payload.x) return { ok: false, reason: "expired" };
    return { ok: true, email: payload.e, source: payload.s };
  } catch {
    return { ok: false, reason: "invalid" };
  }
}
