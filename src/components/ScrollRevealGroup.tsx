"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function ScrollRevealGroup({
  children,
  className,
  direction = "up",
}: {
  children: ReactNode;
  className: string;
  direction?: "up" | "side";
}) {
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const group = groupRef.current;
    if (!group || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = Array.from(group.querySelectorAll<HTMLElement>("[data-reveal-item]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-visible", "true");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
    );

    cards.forEach((card) => {
      if (card.getBoundingClientRect().top < window.innerHeight) card.dataset.visible = "true";
      observer.observe(card);
    });
    group.dataset.ready = "true";
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={groupRef} className={`scroll-reveal-group ${className}`} data-direction={direction}>
      {children}
    </div>
  );
}
