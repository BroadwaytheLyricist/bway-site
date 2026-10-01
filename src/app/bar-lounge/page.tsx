import type { Metadata } from "next";
import BarLoungeDemo from "./round";

const title = "The Bar Lounge: Hip-Hop Trivia | Broadway the Lyricist";
const description = "Test your Hip-Hop knowledge with daily puzzles, artist clues and timed trivia. Earn XP and badges in The Bar Lounge by Broadway the Lyricist.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/bar-lounge" },
  openGraph: {
    title, description, url: "/bar-lounge", type: "website",
    siteName: "Broadway The Lyricist",
    images: [{ url: "/images/og/broadway-social-preview.jpg", width: 1200, height: 630, alt: "Broadway the Lyricist" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/og/broadway-social-preview.jpg"] },
};

export default function BarLoungePage() {
  return <BarLoungeDemo />;
}
