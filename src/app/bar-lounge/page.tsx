import type { Metadata } from "next";
import BarLoungeDemo from "./round";

export const metadata: Metadata = {
  title: "The Bar Lounge | Round Preview",
  description: "A private preview of The Bar Lounge daily Hip-Hop knowledge round.",
  robots: { index: false, follow: false },
};

export default function BarLoungePage() {
  return <BarLoungeDemo />;
}
