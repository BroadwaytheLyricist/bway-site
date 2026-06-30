import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://broadwaythelyricist.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Broadway The Lyricist — Hip-Hop History & Commentary",
  description:
    "Deep dives. Reactions. Debates. The hip-hop conversations we should be having — long-form, unfiltered, on record.",
  keywords: [
    "Broadway The Lyricist",
    "hip-hop commentary",
    "hip-hop history",
    "hip-hop deep dives",
    "music reactions",
  ],
  openGraph: {
    title: "Broadway The Lyricist — Hip-Hop History & Commentary",
    description:
      "Deep dives. Reactions. Debates. The hip-hop conversations we should be having — long-form, unfiltered, on record.",
    url: siteUrl,
    siteName: "Broadway The Lyricist",
    images: [{ url: "/images/hero.png", width: 1535, height: 1024 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Broadway The Lyricist — Hip-Hop History & Commentary",
    description:
      "Deep dives. Reactions. Debates. The hip-hop conversations we should be having.",
    images: ["/images/hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-white font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
