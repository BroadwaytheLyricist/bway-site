"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import SectionHeading from "@/components/SectionHeading";
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
  { label: "YouTube", href: links.youtube, Icon: YouTubeIcon },
  { label: "Instagram", href: links.instagram, Icon: InstagramIcon },
  { label: "TikTok", href: links.tiktok, Icon: TikTokIcon },
  { label: "Facebook", href: links.facebook, Icon: FacebookIcon },
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
    <section id="contact" className="bg-panel py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
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
              Interviews, podcast appearances, brand partnerships, bookings, or
              just want to weigh in on the culture? Send a message and it&apos;ll
              land straight in the inbox — partnership and media materials are in
              the kit below.
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

            {/* Follow — merged in so "reach out" and "follow along" live together */}
            <div className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
                Follow along
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {socials.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-panel-2 text-white transition-all hover:-translate-y-1 hover:border-accent/50 hover:text-accent"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: form card */}
          <form
            action={formAction}
            className="flex flex-col gap-5 rounded-3xl border border-line bg-panel-2 p-6 shadow-xl shadow-black/20 sm:p-8"
            noValidate
          >
            {/* Honeypot — visually hidden, off the tab order */}
            <div className="absolute left-[-9999px]" aria-hidden="true">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
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
                placeholder="What's this about?"
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
                placeholder="Tell us more…"
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
      </div>
    </section>
  );
}
