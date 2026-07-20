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
const socialPreviewImage = {
  url: "/images/og/broadway-social-preview.jpg",
  width: 1200,
  height: 630,
  alt: "Broadway The Lyricist social preview",
};

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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Broadway The Lyricist — Hip-Hop History & Commentary",
    description:
      "Deep dives. Reactions. Debates. The hip-hop conversations we should be having — long-form, unfiltered, on record.",
    url: siteUrl,
    siteName: "Broadway The Lyricist",
    images: [socialPreviewImage],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Broadway The Lyricist — Hip-Hop History & Commentary",
    description:
      "Deep dives. Reactions. Debates. The hip-hop conversations we should be having.",
    images: [socialPreviewImage],
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
