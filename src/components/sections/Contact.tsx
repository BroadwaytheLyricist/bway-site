"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import SectionHeading from "@/components/SectionHeading";
import { ArrowIcon, MailIcon } from "@/components/icons";
import { submitContact } from "@/app/actions";
import type { ContactState } from "@/lib/contact-schema";
import { links } from "@/lib/site";

const initialState: ContactState = { status: "idle", message: "" };

const fieldBase =
  "w-full rounded-xl border bg-panel-2 px-4 py-3 text-white placeholder:text-muted/70 outline-none transition-colors focus:border-accent";

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
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          {/* Left: intro */}
          <div>
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
              Got a collaboration, booking, or just want to weigh in on the
              culture? Send a message and it&apos;ll land straight in the inbox.
            </p>
            <a
              href={`mailto:${links.email}`}
              className="mt-8 inline-flex items-center gap-3 text-sm font-medium text-white transition-colors hover:text-accent"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                <MailIcon className="h-5 w-5" />
              </span>
              {links.email}
            </a>
          </div>

          {/* Right: form */}
          <form action={formAction} className="flex flex-col gap-5" noValidate>
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
