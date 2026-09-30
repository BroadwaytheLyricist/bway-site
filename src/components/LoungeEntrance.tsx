"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

/** A brief room entrance for links across the site; native link behavior remains available. */
export default function LoungeEntrance() {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<"leaving" | "arriving" | null>(null);
  const busy = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const enter = (event: MouseEvent) => {
      if (pathname === "/bar-lounge" || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href="/bar-lounge"]');
      if (!link || link.target === "_blank" || link.hasAttribute("download") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      event.preventDefault();
      if (busy.current) return;
      busy.current = true;
      document.documentElement.dataset.loungeSource = pathname === "/" && window.scrollY < window.innerHeight ? "home" : "page";
      document.documentElement.style.setProperty("--lounge-departure-y", `${window.scrollY + window.innerHeight * .48}px`);
      router.prefetch("/bar-lounge");
      setPhase("leaving");
      timers.current.push(setTimeout(() => router.push("/bar-lounge"), 520));
      // Never leave the entrance overlay up if navigation is interrupted or fails.
      timers.current.push(setTimeout(() => { busy.current = false; setPhase(null); }, 4500));
    };
    document.addEventListener("click", enter, true);
    return () => document.removeEventListener("click", enter, true);
  }, [pathname, router]);

  useEffect(() => {
    if (pathname !== "/bar-lounge" || !busy.current) return;
    const frame = requestAnimationFrame(() => setPhase("arriving"));
    timers.current.push(setTimeout(() => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      busy.current = false;
      setPhase(null);
      const title = document.querySelector<HTMLElement>("[data-lounge-room] h1");
      title?.setAttribute("tabindex", "-1");
      title?.focus({ preventScroll: true });
    }, 480));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (phase) document.documentElement.dataset.loungeTransition = phase;
    else {
      delete document.documentElement.dataset.loungeTransition;
      delete document.documentElement.dataset.loungeSource;
      document.documentElement.style.removeProperty("--lounge-departure-y");
    }
    return () => { delete document.documentElement.dataset.loungeTransition; };
  }, [phase]);

  useEffect(() => () => { timers.current.forEach(clearTimeout); delete document.documentElement.dataset.loungeTransition; }, []);

  return phase ? <div className="lounge-entrance" aria-live="polite" role="status"><span className="sr-only">Entering The Bar Lounge</span><div className="lounge-entrance-light" aria-hidden="true" /></div> : null;
}
