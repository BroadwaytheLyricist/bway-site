"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { nav } from "@/lib/site";
import { CloseIcon, MenuIcon } from "@/components/icons";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scrolling while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-line bg-bg/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:h-20">
        <Link
          href="/#home"
          className="flex items-center gap-3"
          aria-label="Broadway The Lyricist home"
        >
          <Image
            src="/images/logo.png"
            alt="Broadway The Lyricist"
            width={72}
            height={72}
            priority
            className="h-14 w-auto lg:h-16"
          />
        </Link>

        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={
                item.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className="text-sm font-medium text-muted transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#contact"
            className="btn-accent hidden rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 lg:inline-flex"
          >
            Contact
          </Link>

          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-white lg:hidden"
          >
            {open ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`border-t border-line bg-bg lg:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <nav
          className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4"
          aria-label="Mobile"
        >
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={
                item.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-base font-medium text-muted transition-colors hover:bg-panel hover:text-accent"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/#contact"
            onClick={() => setOpen(false)}
            className="btn-accent mt-2 rounded-full px-5 py-3 text-center text-sm font-semibold text-white"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
