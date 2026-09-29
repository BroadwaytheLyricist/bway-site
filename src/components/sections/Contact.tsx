"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import SectionHeading from "@/components/SectionHeading";
import ScrollRevealGroup from "@/components/ScrollRevealGroup";
import {
  ArrowIcon,
  DocIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  TikTokIcon,
  YouTubeIcon,
} from "@/components/icons";
import { submitContact } from "@/app/actions";
import type { ContactState } from "@/lib/contact-schema";
import { links } from "@/lib/site";

const initialState: ContactState = { status: "idle", message: "" };

const socials = [
  { label: "YouTube", handle: "Broadway the Lyricist", href: links.youtube, Icon: YouTubeIcon },
  { label: "Instagram", handle: "@broadwaythelyricist", href: links.instagram, Icon: InstagramIcon },
  { label: "TikTok", handle: "@broadwaythelyricist", href: links.tiktok, Icon: TikTokIcon },
  { label: "Facebook", handle: "Broadway The Lyricist", href: links.facebook, Icon: FacebookIcon },
];

const fieldBase =
  "w-full rounded-xl border bg-bg px-4 py-3 text-white placeholder:text-muted/70 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-accent inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Sending…" : "Send Message"}
      {!pending && <ArrowIcon className="h-4 w-4" />}
    </button>
  );
}

export default function Contact() {
  const [state, formAction] = useActionState(submitContact, initialState);

  return (
    <section id="contact" className="relative isolate overflow-hidden bg-panel py-24 sm:py-32">
      <div aria-hidden="true" className="absolute inset-0 -z-30 bg-[url('/images/stage-bg-v2.jpg')] bg-cover bg-center opacity-70" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-panel/86 via-panel/74 to-panel/62" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left: intro + contact detail cards */}
          <div className="flex flex-col">
            <SectionHeading
              index="05"
              kicker="Contact"
              title={
                <>
                  Let&apos;s <span className="text-accent">Talk</span>
                </>
              }
            />
            <p className="mt-6 text-lg leading-relaxed text-muted">
              For interviews, appearances, bookings, and brand partnerships,
              send a message or email me directly.
            </p>

            {/* Contact detail cards — matched surfaces so the column carries weight */}
            <div className="mt-8 flex flex-col gap-4">
              <a
                href={`mailto:${links.email}`}
                className="group flex items-center gap-4 rounded-2xl border border-line bg-panel-2 p-5 transition-colors hover:border-accent/50"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <MailIcon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    Email
                  </span>
                  <span className="block truncate text-sm font-medium text-white">
                    {links.email}
                  </span>
                </span>
                <ArrowIcon className="ml-auto h-5 w-5 shrink-0 text-muted transition-colors group-hover:text-accent" />
              </a>

              <Link
                href={links.mediaKit}
                className="group flex items-center gap-4 rounded-2xl border border-line bg-panel-2 p-5 transition-colors hover:border-accent/50"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <DocIcon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    Partnerships
                  </span>
                  <span className="block text-sm font-medium text-white">
                    View Media Kit
                  </span>
                </span>
                <ArrowIcon className="ml-auto h-5 w-5 shrink-0 text-muted transition-colors group-hover:text-accent" />
              </Link>
            </div>

          </div>

          {/* Right: form card */}
          <form
            action={formAction}
            className="flex flex-col gap-5 rounded-3xl border border-line bg-panel-2 p-6 shadow-xl shadow-black/20 sm:p-8"
            noValidate
          >
            {/* Honeypot — visually hidden, off the tab order. Named to avoid
                browser autofill (a "company" field gets autofilled, causing
                silent fake-success submissions from real users). */}
            <div className="absolute left-[-9999px]" aria-hidden="true">
              <label htmlFor="contact_time">Leave this field empty</label>
              <input
                id="contact_time"
                name="contact_time"
                type="text"
                tabIndex={-1}
                autoComplete="one-time-code"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-white">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  className={`${fieldBase} ${
                    state.errors?.name ? "border-red-500" : "border-line"
                  }`}
                />
                {state.errors?.name && (
                  <p className="mt-1.5 text-sm text-red-400">{state.errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-white">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@email.com"
                  className={`${fieldBase} ${
                    state.errors?.email ? "border-red-500" : "border-line"
                  }`}
                />
                {state.errors?.email && (
                  <p className="mt-1.5 text-sm text-red-400">{state.errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="mb-2 block text-sm font-medium text-white">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                placeholder="Interview, booking, or partnership?"
                className={`${fieldBase} ${
                  state.errors?.subject ? "border-red-500" : "border-line"
                }`}
              />
              {state.errors?.subject && (
                <p className="mt-1.5 text-sm text-red-400">{state.errors.subject}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-white">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Tell me about your idea and timeline…"
                className={`${fieldBase} resize-y ${
                  state.errors?.message ? "border-red-500" : "border-line"
                }`}
              />
              {state.errors?.message && (
                <p className="mt-1.5 text-sm text-red-400">{state.errors.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <SubmitButton />
              {state.status === "success" && (
                <p role="status" className="text-sm font-medium text-green-400">
                  {state.message}
                </p>
              )}
              {state.status === "error" && (
                <p role="alert" className="text-sm font-medium text-red-400">
                  {state.message}
                </p>
              )}
            </div>
          </form>
        </div>

        <div className="mt-20 border-t border-white/15 pt-14 sm:mt-24 sm:pt-16">
          <p className="kicker text-center">Stay Connected</p>
          <h2 className="mx-auto mt-4 max-w-5xl text-center font-display text-4xl leading-[0.95] text-white sm:text-5xl lg:text-6xl">
            Follow Me On <span className="text-accent">Social Media</span>
          </h2>

          <ScrollRevealGroup className="mt-10 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4" direction="up">
            {socials.map(({ label, handle, href, Icon }) => (
              <a
                key={label}
                data-reveal-item
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow Broadway the Lyricist on ${label}`}
                className="group flex min-h-40 flex-col justify-between border-t border-white/25 py-5 transition-colors hover:border-accent focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                <span className="flex items-start justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-accent/50 bg-accent/10 text-accent transition-transform duration-300 group-hover:-translate-y-1 group-hover:border-accent group-hover:bg-accent/20 group-focus-visible:bg-accent/20">
                    <Icon className="h-6 w-6" />
                  </span>
                  <ArrowIcon className="h-5 w-5 -rotate-45 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent" />
                </span>
                <span className="block">
                  <span className="block font-display text-2xl leading-none text-white transition-colors group-hover:text-accent sm:text-3xl">{label}</span>
                  <span className="mt-2 block text-sm text-muted">{handle}</span>
                </span>
              </a>
            ))}
          </ScrollRevealGroup>
        </div>
      </div>
    </section>
  );
}
