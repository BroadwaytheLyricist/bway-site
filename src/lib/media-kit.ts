/**
 * Media kit content — merged from the original Partnership Deck PDF and the
 * updated HTML kit, restyled for the site. Single source of truth for the
 * `/media-kit` page.
 *
 * Live figures (YouTube subscribers / views / videos) come from the YouTube
 * Data API at request time; the Instagram + reel figures below are maintained
 * manually — update them periodically until a social API is wired up.
 */

export const mediaKit = {
  edition: "Media Kit · 2026",
  tagline: "Hip-Hop Commentary • Original Music • Cultural Storytelling",
  positioning:
    "Broadway the Lyricist blends documentary-style storytelling, Hip-Hop commentary, original music, premium studio production, and creator-tech expertise into content built for long-form engagement and high-retention short-form discovery — connecting with passionate Hip-Hop audiences across every platform.",

  portrait: {
    src: "/images/media-kit/portrait.jpg",
    alt: "Broadway The Lyricist on camera in the studio",
  },

  /** Marketplace status badges from the original deck. */
  badges: [
    "Creator Marketplace Access",
    "Paid Partnership Eligible",
    "Gifts Eligible",
  ],

  /**
   * Manually-maintained stats. YouTube subscriber/view/video counts are pulled
   * live and override their placeholders here on render.
   */
  manualStats: {
    instagramFollowers: "2,746",
    instagramViews30d: "37K+",
    instagramReached: "26.7K",
    topReel: "96.2K+",
  },

  audience: [
    "Predominantly male audience",
    "35–54 primary demographic",
    "United States–based viewership",
    "Hip-hop + creator-tech crossover",
    "High engagement through commentary & discussion",
  ],

  /**
   * Top-performing content (client-selected), Instagram + YouTube.
   * A `url` makes the card link out; cards without a `url` render static.
   * Reel counts are curated manually. YouTube video counts refresh via the API.
   */
  topContent: [
    {
      title: "5 Songs Fans Made Me Hate",
      views: "96.2K",
      platform: "Instagram Reel",
      url: "https://www.instagram.com/reel/DTZCg5IDjOp/",
      thumbnail: "/images/media-kit/content/five-songs.webp",
    },
    {
      title: "The Goal Post Keeps Moving",
      views: "78.3K",
      platform: "Instagram Reel",
      url: "https://www.instagram.com/reel/DaBmUJRPdlR/",
      thumbnail: "/images/media-kit/content/goal-post.webp",
    },
    {
      title: "Not The Dusky!?",
      views: "23.5K",
      platform: "Instagram Reel",
      url: "https://www.instagram.com/reel/DX-kj1AOWHA/",
      thumbnail: "/images/media-kit/content/not-the-dusky.webp",
    },
    {
      title: "Wait...Tom Hardy Can Actually Rap?!",
      views: "13K",
      platform: "YouTube",
      url: "https://www.youtube.com/watch?v=ewvHgIO3RGQ",
      thumbnail: "https://i.ytimg.com/vi/ewvHgIO3RGQ/hqdefault.jpg",
      youtubeId: "ewvHgIO3RGQ",
    },
    {
      title: "Drake Was Supposed To Be Over",
      views: "6.8K",
      platform: "YouTube",
      url: "https://www.youtube.com/watch?v=tU0TyPqz8kc",
      thumbnail: "https://i.ytimg.com/vi/tU0TyPqz8kc/hqdefault.jpg",
      youtubeId: "tU0TyPqz8kc",
    },
    {
      title: "The Genius Behind Liquid Swords",
      views: "5.6K",
      platform: "YouTube",
      url: "https://www.youtube.com/watch?v=9d8_mX0TNvU",
      thumbnail: "https://i.ytimg.com/vi/9d8_mX0TNvU/hqdefault.jpg",
      youtubeId: "9d8_mX0TNvU",
    },
  ],

  /** Proof-backed recognition cards — each screenshot stays attached to its person. */
  recognition: [
    {
      name: "Questlove",
      credit: "Musician • Producer • Academy Award–Winning Filmmaker • The Roots",
      note: "Engaged directly with Broadway The Lyricist content.",
      proof: {
        src: "/images/media-kit/social/questlove.jpg",
        alt: "Questlove commenting on Broadway The Lyricist's Instagram content",
        width: 1320,
        height: 599,
      },
    },
    {
      name: "Cam'ron",
      credit: "Hip-Hop Artist • Media Personality • Co-Host of It Is What It Is • ESPN Contributor",
      note: "Engaged directly with Broadway The Lyricist content.",
      proof: {
        src: "/images/media-kit/social/camron.jpg",
        alt: "Cam'ron engaging with Broadway The Lyricist on Instagram",
        width: 1320,
        height: 498,
      },
    },
    {
      name: "Grandmaster Flash",
      credit: "Hip-Hop Pioneer • Founding Member of Grandmaster Flash & The Furious Five",
      note: "Engaged directly with Broadway The Lyricist content.",
      proof: {
        src: "/images/media-kit/social/djflash.jpg",
        alt: "Grandmaster Flash engaging directly with Broadway The Lyricist",
        width: 1320,
        height: 672,
      },
    },
    {
      name: "Posdnuos (Plug One)",
      credit: "Legendary Hip-Hop Artist • Founding Member of De La Soul",
      note: "Followed Broadway The Lyricist after discovering his content.",
      proof: {
        src: "/images/media-kit/social/posdnuos.jpg",
        alt: "Posdnuos from De La Soul following Broadway The Lyricist from his reel",
        width: 1320,
        height: 202,
      },
    },
    {
      name: "A-Plus",
      credit: "Hip-Hop Artist • Founding Member of Souls of Mischief",
      note: "Engaged directly with Broadway The Lyricist content.",
      proof: {
        src: "/images/media-kit/social/hieroaplus.jpg",
        alt: "A-Plus from Souls of Mischief commenting on Broadway The Lyricist's content",
        width: 1320,
        height: 320,
      },
    },
    {
      name: "Ishmael Butler",
      credit: "Hip-Hop Artist • Digable Planets • Shabazz Palaces",
      note: "Connected directly with Broadway The Lyricist through Instagram.",
      proof: {
        src: "/images/media-kit/social/ishmael-butler.jpg",
        alt: "Ishmael Butler of Shabazz Palaces messaging with Broadway The Lyricist",
        width: 1320,
        height: 2450,
      },
    },
    {
      name: "Nature",
      credit: "Hip-Hop Artist • Queensbridge Veteran • The Firm Affiliate",
      note: "Shared direct conversation and engagement with Broadway The Lyricist.",
      proof: {
        src: "/images/media-kit/social/nature.jpg",
        alt: "Nature messaging with Broadway The Lyricist on Instagram",
        width: 1113,
        height: 1955,
      },
    },
    {
      name: "Radha Blank",
      credit: "Actress • Filmmaker • Playwright • Rapper",
      note: "Shared encouragement and direct support for Broadway The Lyricist.",
      proof: {
        src: "/images/media-kit/social/radha-blank.jpg",
        alt: "Radha Blank sending encouragement to Broadway The Lyricist",
        width: 1320,
        height: 2123,
      },
    },
    {
      name: "Buckwild",
      credit: "Producer • D.I.T.C.",
      note: "Commented on Broadway The Lyricist's Hip-Hop discussion and followed the account.",
      proof: {
        src: "/images/media-kit/social/buckwild-follow.webp",
        alt: "Verified producer Buckwild following Broadway The Lyricist on Instagram",
        width: 1320,
        height: 262,
      },
      secondaryProof: {
        src: "/images/media-kit/social/buckwild-comment.webp",
        alt: "Buckwild commenting on Broadway The Lyricist's Instagram discussion",
        width: 1320,
        height: 498,
      },
    },
    {
      name: "Lyric Perez",
      credit: "Creative Producer • Revolt • Complex Networks • Red Bull Media House",
      note: "Verified creative producer engaged with Broadway The Lyricist content.",
      proof: {
        src: "/images/media-kit/social/lyric-perez.jpg",
        alt: "Lyric Perez commenting on Broadway The Lyricist's Instagram content",
        width: 1320,
        height: 556,
      },
    },
  ],

  gear: [
    "Canon EOS R50",
    "Shure MV7+",
    "RODECaster Duo",
    "SmallRig Creator Ecosystem",
    "Elgato Cam Link 4K",
    "Cinematic RGB Studio Lighting",
    "DaVinci Resolve",
  ],

  studio: [
    {
      src: "/images/media-kit/studio/desk-shure.jpg",
      alt: "Shure MV7+ and MacBook at the creator desk",
    },
    {
      src: "/images/media-kit/studio/canon-rgb.jpg",
      alt: "Canon EOS R50 with RGB tube lighting and a Shure mic on the boom arm",
    },
    {
      src: "/images/media-kit/studio/smallrig-light.jpg",
      alt: "SmallRig RGB studio light on a stand",
    },
    {
      src: "/images/media-kit/studio/godox-softbox.jpg",
      alt: "Godox softbox studio lighting",
    },
    {
      src: "/images/media-kit/studio/canon-shelf.jpg",
      alt: "Canon EOS R50 on an RGB-lit shelf",
    },
    {
      src: "/images/media-kit/studio/production-workspace.jpg",
      alt: "Creator workspace with camera, Shure microphone, laptop, and audio console",
    },
  ],

  capabilities: [
    "Long-form video production",
    "Short-form video & Instagram Reels",
    "Livestream production",
    "Podcast production",
    "Cross-platform content repurposing",
    "Multi-platform distribution",
  ],

  partnerships: [
    "Sponsored Reels",
    "Long-Form Integrations",
    "Product Reviews",
    "Studio Integrations",
    "Podcast Sponsorships",
    "Creator Technology Features",
    "Affiliate Partnerships",
    "Event Coverage",
  ],
};