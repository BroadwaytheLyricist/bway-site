"use client";

import { useLayoutEffect } from "react";

export default function AnchorLanding() {
  useLayoutEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const target = id && document.getElementById(id);
    if (!target) {
      document.documentElement.style.scrollBehavior = "";
      return;
    }

    const html = document.documentElement;
    html.style.scrollBehavior = "auto";
    target.scrollIntoView({ behavior: "auto", block: "start" });
    const frame = requestAnimationFrame(() => {
      html.style.scrollBehavior = "";
    });

    return () => {
      cancelAnimationFrame(frame);
      html.style.scrollBehavior = "";
    };
  }, []);

  return null;
}
