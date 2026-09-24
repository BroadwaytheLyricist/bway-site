/**
 * Central site configuration: real links, nav, and content constants.
 * Single source of truth so a future CMS swap is a localized change.
 */

export const YOUTUBE_CHANNEL_ID = "UCSReMFrM5-41HxZoT5FAmSg";

export const links = {
  youtube: `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`,
  instagram: "https://www.instagram.com/broadwaythelyricist",
  tiktok: "https://www.tiktok.com/@broadwaythelyricist",
  facebook:
    "https://www.facebook.com/people/Broadway-The-Lyricist/61571489602613/",
  email: "Ramcorpmanagement@gmail.com",
  mediaKit: "/media-kit",
} as const;

export const nav = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Videos", href: "/#videos" },
  { label: "Playlists", href: "/#playlists" },
  { label: "Blog", href: "/blog" },
  { label: "Media Kit", href: "/media-kit" },
  { label: "Contact", href: "/#contact" },
] as const;

export const marqueeTags = [
  "Culture",
  "History",
  "Deep Dives",
  "Reactions",
  "Debates",
] as const;

/**
 * Hand-picked featured deep-dive uploads (full long-form videos, not Shorts).
 * IDs verified from the channel's RSS feed. Swap as the client supplies features.
 */
export const featuredVideos = [
  {
    id: "dojslb4-TYU",
    title: "Hip-Hop Fans Are Their Own Worst Enemy",
  },
  {
    id: "frc26xh_FlE",
    title: "Hip-Hop Snobs Are the Worst Thing About Hip-Hop",
  },
  {
    id: "QzJHQpv8j4w",
    title: "The Co-Sign Paradox",
  },
] as const;

export const playlists = [
  {
    title: "Rappers We Don't Talk About Enough",
    description:
      "Long-form spotlights on great MCs who deserve more conversation.",
    href: `${links.youtube}/playlists`,
    image: "/images/playlists/rappers.jpg",
  },
  {
    title: "Albums We Don't Talk About Enough",
    description:
      "Revisiting overlooked albums, context, and why the music still matters.",
    href: `${links.youtube}/playlists`,
    image: "/images/playlists/albums.jpg",
  },
  {
    title: "Hip Hop Didn't Tell You",
    description:
      "Context, debates, and the culture conversations hiding in plain sight.",
    href: `${links.youtube}/playlists`,
    image: "/images/playlists/hh-didnt-tell-you.jpg",
  },
] as const;

export const stats = [
  { value: "1M+", label: "Social Views" },
  { value: "25+", label: "Years in Hip-Hop" },
  { value: "3×", label: "Award-Nominated Artist" },
] as const;

export const channelTagline =
  "Deep dives. Reactions. Debates. The hip-hop conversations we should be having.";

export const businessEmail = links.email;
