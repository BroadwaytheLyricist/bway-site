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
  appleMusic: "https://music.apple.com/us/album/off-broadway-single/1482177233",
  tidal: "https://tidal.com/video/356030437",
  deezer: "https://www.deezer.com/en/artist/6865951",
} as const;

export const nav = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Videos", href: "/#videos" },
  { label: "Blog", href: "/blog" },
  { label: "Music", href: "/#music" },
  { label: "Media Kit", href: "/media-kit" },
  { label: "Contact", href: "/#contact" },
] as const;

export const brandTagline = "The Hip-Hop Conversations We Should Be Having";

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
type Playlist = {
  title: string;
  count?: number;
  url: string;
  image?: string;
};

export const playlists: Playlist[] = [
  {
    title: "Hip Hop Didn't Tell You",
    url: "https://www.youtube.com/playlist?list=PL-XCphQVML5oTIfxhp3-1kSwtF7EXOCEH",
    image: "/images/playlists-v3/hip-hop-didnt-tell-you.webp",
  },
  {
    title: "Hip Hop, Sports & Culture",
    url: "https://www.youtube.com/playlist?list=PLH_y27XKyoFE",
    image: "/images/playlists-v3/hip-hop-sports-culture.webp",
  },
  {
    title: "Albums We Don't Talk About Enough",
    url: "https://www.youtube.com/playlist?list=PL-XCphQVML5rF7JfxRu4qfJ3MZ5sJPbr4",
    image: "/images/playlists-v3/albums-we-dont-talk-about-enough.webp",
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

export const stats = [
  { value: "1M+", label: "Social Views" },
  { value: "25+", label: "Years in Hip-Hop" },
  { value: "3×", label: "Award-Nominated Artist" },
] as const;

export const channelTagline =
  "Deep dives. Reactions. Debates. The Hip-Hop conversations we should be having.";

export const businessEmail = links.email;
