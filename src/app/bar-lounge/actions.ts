"use server";

import { Resend } from "resend";
import { z } from "zod";
import { getBarLoungeRound } from "@/lib/bar-lounge";
import { links } from "@/lib/site";

export type LoungeState = { status: "idle" | "success" | "error"; message: string };

const answerSchema = z.object({
  round: z.string().max(80),
  name: z.string().trim().min(2).max(60),
  answer: z.string().trim().min(2).max(800),
});
const emailSchema = z.email();

export async function submitLoungeAnswer(
  _previous: LoungeState,
  formData: FormData,
): Promise<LoungeState> {
  if (formData.get("lounge_time")) return { status: "success", message: "Your answer is in." };
  const parsed = answerSchema.safeParse({
    round: formData.get("round"),
    name: formData.get("name"),
    answer: formData.get("answer"),
  });
  if (!parsed.success) return { status: "error", message: "Add your name and answer, then try again." };

  const round = getBarLoungeRound(parsed.data.round);
  if (!round || round.status !== "open") return { status: "error", message: "This round is closed." };
  if (!process.env.RESEND_API_KEY) return { status: "error", message: "Answers aren't connected yet. Please try again later." };

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "Broadway The Lyricist <onboarding@resend.dev>",
      to: process.env.BAR_LOUNGE_TO_EMAIL ?? process.env.CONTACT_TO_EMAIL ?? links.email,
      subject: `Bar Lounge answer: ${round.title}`,
      text: `Round: ${round.id}\nName: ${parsed.data.name}\n\nAnswer:\n${parsed.data.answer}\n\nThe participant did not subscribe by submitting this answer. Ask permission before publicly crediting them.`,
    });
    if (error) throw error;
    return { status: "success", message: "Your answer is in. Check back for the reveal." };
  } catch (error) {
    console.error("[bar-lounge] answer delivery failed", error);
    return { status: "error", message: "We couldn't send that answer. Please try again." };
  }
}

export async function subscribeToLounge(
  _previous: LoungeState,
  formData: FormData,
): Promise<LoungeState> {
  if (formData.get("lounge_time")) return { status: "success", message: "Thanks for joining." };
  const email = emailSchema.safeParse(formData.get("email"));
  if (!email.success || !formData.get("consent")) {
    return { status: "error", message: "Enter a valid email and confirm you want to receive updates." };
  }

  const apiKey = process.env.KIT_API_KEY;
  const formId = process.env.KIT_FORM_ID;
  if (!apiKey || !formId || !/^\d+$/.test(formId)) {
    return { status: "error", message: "The email list isn't connected yet. Please check back soon." };
  }

  try {
    const headers = { "Content-Type": "application/json", "X-Kit-Api-Key": apiKey };
    const created = await fetch("https://api.kit.com/v4/subscribers", {
      method: "POST", headers, cache: "no-store",
      body: JSON.stringify({ email_address: email.data }),
    });
    if (!created.ok) throw new Error(`Kit subscriber request: ${created.status}`);
    const added = await fetch(`https://api.kit.com/v4/forms/${formId}/subscribers`, {
      method: "POST", headers, cache: "no-store",
      body: JSON.stringify({ email_address: email.data, referrer: "https://broadwaythelyricist.com/bar-lounge" }),
    });
    if (!added.ok) throw new Error(`Kit form request: ${added.status}`);
    return { status: "success", message: "You're on the list. Look out for the next round in your inbox." };
  } catch (error) {
    console.error("[bar-lounge] signup failed", error);
    return { status: "error", message: "We couldn't add you right now. Please try again later." };
  }
}
