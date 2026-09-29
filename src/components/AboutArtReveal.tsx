"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function AboutArtReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.dataset.visible = "true";
      observer.disconnect();
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    if (element.getBoundingClientRect().top < window.innerHeight) element.dataset.visible = "true";
    element.dataset.ready = "true";
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={className}>{children}</div>;
}
