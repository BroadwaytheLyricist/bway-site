"use client";

import { DocIcon } from "@/components/icons";

/**
 * Triggers the browser's print dialog so the media-kit page can be saved as a
 * PDF that always matches what's on screen (no separate file to drift).
 */
export default function PrintButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      <DocIcon className="h-4 w-4" />
      Download / Print
    </button>
  );
}
