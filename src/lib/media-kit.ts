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
  tagline: "Hip-Hop Commentary • Music Journalism • Cultural Storytelling",
  positioning:
    "Broadway the Lyricist blends documentary-style storytelling, music journalism, premium studio production, and creator-tech expertise into content built for long-form engagement and high-retention short-form discovery — connecting with passionate hip-hop audiences across every platform.",

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
    topReel: "95.9K+",
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
   * YouTube view counts are live-verified; Instagram counts are reported.
   */
  topContent: [
    {
      title: "5 Songs Fans Made Me Hate",
      views: "95.9K",
      platform: "Instagram Reel",
      url: "https://www.instagram.com/p/DTZCg5IDjOp/",
    },
    {
      title: "Knicks In 4",
      views: "65K",
      platform: "Instagram Reel",
      url: "https://www.instagram.com/p/DaBmUJRPdlR/",
    },
    {
      title: "Not The Dusky!?",
      views: "23.3K",
      platform: "Instagram Reel",
      url: "https://www.instagram.com/p/DX-kj1AOWHA/",
    },
    {
      title: "Drake Was Supposed To Be Over",
      views: "4.4K",
      platform: "YouTube",
      url: "https://www.youtube.com/watch?v=tU0TyPqz8kc",
    },
    {
      title: "The Genius Behind Liquid Swords",
      views: "2.7K",
      platform: "YouTube",
      url: "https://www.youtube.com/watch?v=9d8_mX0TNvU",
    },
  ],

  recognition: {
    featured: [
      {
        name: "Questlove",
        credit: "Musician • Producer • Academy Award–Winning Filmmaker • The Roots",
        note: "Engaged directly with Broadway The Lyricist content.",
      },
      {
        name: "Cam'ron",
        credit: "Hip-Hop Artist • Co-Host of It Is What It Is • ESPN Contributor",
        note: "Engaged directly with Broadway The Lyricist content.",
      },
      {
        name: "Grandmaster Flash",
        credit: "Hip-Hop Pioneer • Grandmaster Flash & The Furious Five",
        note: "Engaged directly with Broadway The Lyricist content.",
      },
      {
        name: "Posdnuos (Plug One)",
        credit: "Legendary Hip-Hop Artist • Founding Member of De La Soul",
        note: "Followed Broadway The Lyricist after discovering his content.",
      },
    ],
    validation: [
      { name: "A-Plus", credit: "Souls of Mischief • Hieroglyphics" },
      { name: "Ishmael Butler", credit: "Digable Planets • Shabazz Palaces" },
      { name: "Nature", credit: "Queensbridge Veteran • The Firm Affiliate" },
      { name: "Radha Blank", credit: "Actress • Filmmaker • Playwright • Rapper" },
      { name: "Lyric Perez", credit: "Revolt • Complex • Red Bull Media House" },
    ],
  },

  /** Screenshot social proof — real engagement, shown as-is. */
  socialProof: [
    {
      src: "/images/media-kit/social/questlove.jpg",
      alt: "Questlove engaging with Broadway The Lyricist on Instagram",
    },
    {
      src: "/images/media-kit/social/hieroaplus.jpg",
      alt: "A-Plus (Souls of Mischief) engaging with Broadway The Lyricist",
    },
    {
      src: "/images/media-kit/social/djflash.jpg",
      alt: "DJ Flash engaging with Broadway The Lyricist on a DJ culture post",
    },
    {
      src: "/images/media-kit/social/camron.jpg",
      alt: "Direct audience engagement on a Broadway The Lyricist reel",
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
