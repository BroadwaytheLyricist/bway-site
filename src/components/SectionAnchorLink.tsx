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

  return (
    <Link
      {...props}
      scroll={crossingPages ? false : scroll}
      onClick={(event) => {
        onClick?.(event);
        if (
          crossingPages &&
          !event.defaultPrevented &&
          event.button === 0 &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey
        ) {
          // Cross-page anchors should arrive directly, without a long vertical scroll.
          document.documentElement.style.scrollBehavior = "auto";
        }
      }}
    />
  );
}
