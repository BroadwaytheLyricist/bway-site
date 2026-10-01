"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Journey = { path: string; hash: string; lounge: boolean; label: string };

/** Shared zoom between site destinations, with amber light only at the Lounge entrance. */
export default function LoungeEntrance() {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<"leaving" | "arriving" | null>(null);
  const [journey, setJourney] = useState<Journey | null>(null);
  const destination = useRef<Journey | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const previousScrollBehavior = useRef("");

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    destination.current = null;
    delete document.documentElement.dataset.pageTransition;
    delete document.documentElement.dataset.pageDestination;
    document.documentElement.style.removeProperty("--page-zoom-y");
    document.documentElement.style.scrollBehavior = previousScrollBehavior.current;
    setPhase(null);
    setJourney(null);
  };

  /** Puts the new page at its top, or at the requested section. Uses the plain
   *  scroll calls every browser supports (iOS Safari included). */
  const toTop = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const landOn = (target: Journey) => {
    const section = target.hash ? document.getElementById(decodeURIComponent(target.hash.slice(1))) : null;
    if (section) section.scrollIntoView(true);
    else toTop();
    return section;
  };

  const arrive = () => {
    const target = destination.current;
    if (!target) return;
    const section = landOn(target);
    document.documentElement.style.setProperty("--page-zoom-y", `${window.scrollY + window.innerHeight * .48}px`);
    setPhase("arriving");
    timers.current.push(setTimeout(() => {
      const heading = section?.querySelector<HTMLElement>("h1, h2") ?? document.querySelector<HTMLElement>("main h1");
      heading?.setAttribute("tabindex", "-1");
      heading?.focus({ preventScroll: true });
      reset();
      // Safari can ignore a scroll made while the page is locked mid-transition,
      // leaving the new page at the old page's position. Once scrolling is
      // unlocked, land again so every page opens at its top (or its section).
      // Don't trust Safari's reported position here: land unconditionally, then
      // once more shortly after, in case late layout nudges the page.
      requestAnimationFrame(() => landOn(target));
      timers.current.push(setTimeout(() => landOn(target), 150));
    }, target.lounge ? 480 : 320));
  };
  const arriveRef = useRef(arrive);
  useEffect(() => { arriveRef.current = arrive; });

  useEffect(() => {
    const enter = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || !["http:", "https:"].includes(url.protocol) || url.pathname.startsWith("/api/") || /\.[a-z0-9]+$/i.test(url.pathname)) return;
      const samePage = url.pathname === pathname && url.search === window.location.search;
      if (samePage && !url.hash) return;
      if (samePage && !document.getElementById(decodeURIComponent(url.hash.slice(1)))) return;
      event.preventDefault();
      if (destination.current) return;
      const target = { path: url.pathname, hash: url.hash, lounge: url.pathname === "/bar-lounge", label: link.textContent?.trim() || "Home" };
      destination.current = target;
      setJourney(target);
      previousScrollBehavior.current = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      document.documentElement.style.setProperty("--page-zoom-y", `${window.scrollY + window.innerHeight * .48}px`);
      document.documentElement.dataset.pageDestination = target.lounge ? "lounge" : "page";
      router.prefetch(url.pathname);
      setPhase("leaving");
      timers.current.push(setTimeout(() => {
        if (!samePage) {
          // The old page is fully hidden behind the transition cover now. Unlock
          // scrolling and reset to the top *before* the new page loads, so it can
          // never inherit the old page's scroll position (iOS Safari ignores
          // scroll changes made while the page is locked).
          delete document.documentElement.dataset.pageTransition;
          document.body.style.overflow = "";
          toTop();
        }
        router.push(url.pathname + url.search + url.hash, { scroll: false });
        if (samePage) arriveRef.current();
      }, target.lounge ? 520 : 260));
      // Recover cleanly if a navigation is interrupted or cannot complete.
      timers.current.push(setTimeout(reset, 4500));
    };
    document.addEventListener("click", enter, true);
    return () => document.removeEventListener("click", enter, true);
  }, [pathname, router]);

  useEffect(() => {
    if (!destination.current || pathname !== destination.current.path) return;
    const frame = requestAnimationFrame(() => arriveRef.current());
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (phase) document.documentElement.dataset.pageTransition = phase;
    else delete document.documentElement.dataset.pageTransition;
    return () => { delete document.documentElement.dataset.pageTransition; };
  }, [phase]);

  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    delete document.documentElement.dataset.pageTransition;
    delete document.documentElement.dataset.pageDestination;
    document.documentElement.style.removeProperty("--page-zoom-y");
  }, []);

  return phase && journey ? <div className="page-entrance" aria-live="polite" role="status"><span className="sr-only">Entering {journey.label}</span>{journey.lounge && <div className="page-entrance-light" aria-hidden="true" />}</div> : null;
}
