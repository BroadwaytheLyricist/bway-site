"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = ComponentProps<typeof Link>;

export default function SectionAnchorLink({ onClick, scroll, ...props }: Props) {
  const pathname = usePathname();
  const destination = typeof props.href === "string"
    ? props.href.split("#")[0] || "/"
    : props.href.pathname || "/";
  const crossingPages = pathname !== destination;
  const hasHash = typeof props.href === "string"
    ? props.href.includes("#")
    : Boolean(props.href.hash);

  return (
    <Link
      {...props}
      scroll={crossingPages ? false : scroll}
      onClick={(event) => {
        onClick?.(event);
        if (
          !event.defaultPrevented &&
          event.button === 0 &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey
        ) {
          const html = document.documentElement;
          if (crossingPages) {
            // Cross-page anchors arrive directly, without sweeping through the old page.
            html.style.scrollBehavior = "auto";
          } else if (hasHash && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            // Only movement to a section on this page should be smooth.
            html.style.scrollBehavior = "smooth";
            window.setTimeout(() => {
              if (html.style.scrollBehavior === "smooth") html.style.scrollBehavior = "";
            }, 900);
          }
        }
      }}
    />
  );
}
