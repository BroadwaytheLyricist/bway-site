"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = ComponentProps<typeof Link>;

export default function HomeSectionLink({ onClick, scroll, ...props }: Props) {
  const pathname = usePathname();
  const crossingPages = pathname !== "/";

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
          // Keep the route transition from animating through the whole homepage.
          document.documentElement.style.scrollBehavior = "auto";
        }
      }}
    />
  );
}
