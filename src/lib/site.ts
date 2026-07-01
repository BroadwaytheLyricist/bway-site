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
  email: "RamcorpManagment@gmail.com",
  mediaKit: "/media-kit",
} as const;

export const nav = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Videos", href: "/#videos" },
  { label: "Playlists", href: "/#playlists" },
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
    title: "Who Really Controls Hip Hop? The Prison Money Trail No One Talks About",
  },
  {
    id: "HbVsTl3A-tg",
    title: "Hip Hop Is The Only Genre That Tells Rappers To Retire",
  },
] as const;

/**
 * Curated channel playlists surfaced on the homepage. Titles, video counts,
 * and IDs are the channel's real playlists (verified from the public
 * /playlists listing); `url` deep-links to each individual playlist.
 */
export const playlists = [
  {
    title: "Albums We Don't Talk About Enough",
    count: 21,
    url: "https://www.youtube.com/playlist?list=PL-XCphQVML5rF7JfxRu4qfJ3MZ5sJPbr4",
    image: "/images/playlists/albums-we-dont-talk-about-enough.jpg",
  },
  {
    title: "Hip Hop Didn't Tell You",
    count: 18,
    url: "https://www.youtube.com/playlist?list=PL-XCphQVML5oTIfxhp3-1kSwtF7EXOCEH",
    image: "/images/playlists/hip-hop-didnt-tell-you.jpg",
  },
  {
    title: "Where Are They Now?",
    count: 9,
    url: "https://www.youtube.com/playlist?list=PL-XCphQVML5pI1a4c1_j1i9k8D5zq0LOz",
    image: "/images/playlists/where-are-they-now.jpg",
  },
  {
    title: "Rappers We Don't Talk About Enough",
    count: 17,
    url: "https://www.youtube.com/playlist?list=PL-XCphQVML5q0MkQlXg1kXe3fzZGVY3RU",
  },
  {
    title: "Lyric Videos",
    count: 13,
    url: "https://www.youtube.com/playlist?list=PL-XCphQVML5px0xGcaiNcae2rdNz5Wdlf",
  },
  {
    title: "Your Favorite Artists' Worst Songs",
    count: 11,
    url: "https://www.youtube.com/playlist?list=PL-XCphQVML5rwTYRrTAeboSw3zoi8tJ1a",
  },
] as const;
