import { XMLParser } from "fast-xml-parser";
import { YOUTUBE_CHANNEL_ID } from "@/lib/site";

export type YouTubeVideo = {
  id: string;
  title: string;
  published: string;
  url: string;
  embedUrl: string;
};

type RawEntry = {
  "yt:videoId"?: string;
  title?: string;
  published?: string;
};

const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  // Always treat <entry> as a list, even when the feed has a single item.
  isArray: (name) => name === "entry",
});

/**
 * Server-side fetch of the channel's RSS feed, revalidated hourly (ISR).
 * Returns the latest `count` videos. Never throws — on any failure it
 * returns an empty array so the UI can render a graceful fallback.
 */
export async function getLatestVideos(count = 2): Promise<YouTubeVideo[]> {
  try {
    const res = await fetch(FEED_URL, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "Mozilla/5.0 (compatible; BroadwayTheLyricist/1.0)" },
    });

    if (!res.ok) return [];

    const xml = await res.text();
    const data = parser.parse(xml) as {
      feed?: { entry?: RawEntry[] };
    };

    const entries = data.feed?.entry ?? [];

    return entries
      .map((entry): YouTubeVideo | null => {
        const id = entry["yt:videoId"];
        if (!id) return null;
        return {
          id,
          title: entry.title ?? "Untitled",
          published: entry.published ?? "",
          url: `https://www.youtube.com/watch?v=${id}`,
          embedUrl: `https://www.youtube.com/embed/${id}`,
        };
      })
      .filter((v): v is YouTubeVideo => v !== null)
      .slice(0, count);
  } catch {
    return [];
  }
}

export type ChannelStats = {
  subscribers: number;
  views: number;
  videos: number;
};

const STATS_URL = (key: string) =>
  `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${YOUTUBE_CHANNEL_ID}&key=${key}`;

/**
 * Live channel statistics via the YouTube Data API (server-side only).
 * Revalidated hourly (ISR). Returns null on any failure or missing key so the
 * UI can fall back to the manually-maintained figures.
 */
export async function getChannelStats(): Promise<ChannelStats | null> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch(STATS_URL(key), { next: { revalidate: 3600 } });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      items?: { statistics?: Record<string, string> }[];
    };
    const s = data.items?.[0]?.statistics;
    if (!s) return null;

    return {
      subscribers: Number(s.subscriberCount),
      views: Number(s.viewCount),
      videos: Number(s.videoCount),
    };
  } catch {
    return null;
  }
}

/** Compact number formatting: 859 → "859", 123417 → "123.4K", 1_200_000 → "1.2M". */
export function formatCompact(n: number): string {
  if (n >= 1_000_000) {
    return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (n >= 10_000) {
    return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return n.toLocaleString("en-US");
}
