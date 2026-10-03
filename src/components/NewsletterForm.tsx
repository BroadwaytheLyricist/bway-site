"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { subscribeNewsletter } from "@/app/newsletter-actions";
import type { NewsletterSource, NewsletterState } from "@/lib/newsletter-types";

const initialState: NewsletterState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-accent w-full shrink-0 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {pending ? "Sending…" : "Subscribe"}
    </button>
  );
}

type NewsletterFormProps = {
  source: NewsletterSource;
  finePrint: string;
  className?: string;
};

export default function NewsletterForm({ source, finePrint, className = "" }: NewsletterFormProps) {
  const [state, formAction] = useActionState(subscribeNewsletter, initialState);
  const inputId = `newsletter-email-${source}`;

  if (state.status === "success") {
    return (
      <div className={className} role="status" aria-live="polite">
        <p className="rounded-2xl border border-accent/40 bg-accent/10 px-5 py-4 text-sm leading-relaxed text-white">
          <span className="font-semibold text-accent">Almost there.</span> {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className={className}>
      <input type="hidden" name="source" value={source} />

      {/* Spam trap: hidden from people and screen readers, off the tab order. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor={`signup_time-${source}`}>Leave this field empty</label>
        <input
          id={`signup_time-${source}`}
          name="signup_time"
          type="text"
          tabIndex={-1}
          autoComplete="one-time-code"
        />
      </div>

      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={inputId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@email.com"
          aria-invalid={state.status === "error"}
          aria-describedby={state.status === "error" ? `${inputId}-error` : undefined}
          className={`min-h-[52px] w-full min-w-0 flex-1 rounded-full border bg-bg px-5 text-base text-white outline-none transition-colors placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/20 ${
            state.status === "error" ? "border-red-500" : "border-line"
          }`}
        />
        <SubmitButton />
      </div>

      {state.status === "error" && (
        <p id={`${inputId}-error`} role="alert" className="mt-2 text-sm text-red-400">
          {state.message}
        </p>
      )}
      <p className="mt-3 text-xs text-muted">{finePrint}</p>
    </form>
  );
}
