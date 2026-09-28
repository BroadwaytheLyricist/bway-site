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

// Structured data: tells Google this "Broadway" is a hip-hop creator (not a
// theater lyricist) and links every profile to one identity.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Broadway The Lyricist",
      alternateName: "Broadway the Lyricist",
      url: siteUrl,
      jobTitle: "Hip-Hop Commentator & Content Creator",
      description:
        "Hip-Hop commentary, original music, and cultural storytelling from Broadway the Lyricist.",
      knowsAbout: [
        "Hip-hop",
        "Hip-hop history",
        "Rap music",
        "Music commentary",
      ],
      sameAs: [
        "https://www.youtube.com/channel/UCSReMFrM5-41HxZoT5FAmSg",
        "https://www.instagram.com/broadwaythelyricist",
        "https://www.tiktok.com/@broadwaythelyricist",
        "https://www.facebook.com/people/Broadway-The-Lyricist/61571489602613/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Broadway The Lyricist",
      description:
        "Hip-Hop commentary, original music, and the conversations we should be having.",
      inLanguage: "en-US",
      publisher: { "@id": `${siteUrl}/#person` },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Broadway the Lyricist | Hip-Hop Commentary & Original Music",
  description:
    "Hip-Hop commentary, cultural storytelling, and original music from Broadway the Lyricist. Watch videos, explore series, read the blog, and hear the music.",
  alternates: { canonical: "/" },
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
    title: "Broadway the Lyricist | Hip-Hop Commentary & Original Music",
    description:
      "Hip-Hop commentary, cultural storytelling, and original music. The Hip-Hop conversations we should be having.",
    url: siteUrl,
    siteName: "Broadway The Lyricist",
    images: [socialPreviewImage],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Broadway the Lyricist | Hip-Hop Commentary & Original Music",
    description:
      "Hip-Hop commentary, cultural storytelling, and original music from Broadway the Lyricist.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
