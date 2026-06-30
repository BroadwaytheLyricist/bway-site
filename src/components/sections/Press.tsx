import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { ArrowIcon, MailIcon } from "@/components/icons";
import { links } from "@/lib/site";

export default function Press() {
  return (
    <section id="press" className="bg-panel py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="overflow-hidden rounded-3xl border border-line bg-panel-2">
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <SectionHeading
                index="03"
                kicker="Press"
                title={
                  <>
                    Booking, Brands &amp; <span className="text-accent">Media</span>
                  </>
                }
              />
              <p className="mt-6 text-lg leading-relaxed text-muted">
                For interviews, podcast appearances, brand partnerships, and press
                inquiries, reach out directly. Partnership and media materials are
                available on request.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <a
                href={`mailto:${links.email}`}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-panel p-5 transition-colors hover:border-accent/50"
              >
                <span className="flex items-center gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <MailIcon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                      Press &amp; Booking
                    </span>
                    <span className="block text-sm font-medium text-white">
                      {links.email}
                    </span>
                  </span>
                </span>
                <ArrowIcon className="h-5 w-5 text-muted transition-colors group-hover:text-accent" />
              </a>

              <Link
                href={links.mediaKit}
                className="btn-accent rounded-full px-6 py-3 text-center text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                View Media Kit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
