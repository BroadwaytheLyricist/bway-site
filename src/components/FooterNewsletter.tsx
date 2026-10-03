"use client";

import { usePathname } from "next/navigation";
import NewsletterForm from "@/components/NewsletterForm";

// Footer signup. Hidden on individual blog posts, which have their own card,
// and on the newsletter confirm page, where the fan has just signed up.
export default function FooterNewsletter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/blog/") || pathname?.startsWith("/newsletter")) return null;

  return (
    <div className="mt-10 w-full max-w-xl">
      <p className="text-base text-white sm:text-lg">
        Get the latest conversations, straight to your inbox.
      </p>
      <NewsletterForm
        source="footer"
        finePrint="No spam. Unsubscribe anytime."
        className="mt-4"
      />
    </div>
  );
}
