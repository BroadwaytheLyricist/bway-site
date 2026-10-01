/**
 * Live Instagram numbers for the Media Kit, mirroring src/lib/youtube.ts.
 *
 * Uses the Instagram API with Instagram Login (graph.instagram.com). The access
 * token comes from src/lib/instagram-token.ts, which renews itself weekly.
 * Every function returns null / {} on any failure so the page falls back to
 * the manually maintained numbers in src/lib/media-kit.ts. Results are cached
 * for one hour, the same as the YouTube stats.
 *
 * Needs the token's permissions to include instagram_business_basic (followers,
 * media list) and instagram_business_manage_insights (views, reach).
 */

import { getInstagramToken } from "@/lib/instagram-token";

const API = "https://graph.instagram.com";
const CACHE = { next: { revalidate: 3600 } } as const;
const DAY = 24 * 60 * 60;

export type InstagramStats = {
  followers: number | null;
  views30d: number | null;
  reach30d: number | null;
};

async function getJson(path: string, params: Record<string, string>) {
  const key = await getInstagramToken();
  if (!key) return null;
  const url = new URL(`${API}/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set("access_token", key);
  try {
    const res = await fetch(url.toString(), CACHE);
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Reads a metric's value from an insights response (total_value or summed daily values). */
export function readMetric(payload: unknown, name: string): number | null {
  const data = (payload as { data?: unknown[] } | null)?.data;
  if (!Array.isArray(data)) return null;
  const metric = data.find(
    (m): m is { name: string; total_value?: { value?: number }; values?: { value?: number }[] } =>
      typeof m === "object" && m !== null && (m as { name?: string }).name === name,
  );
  if (!metric) return null;
  if (typeof metric.total_value?.value === "number") return metric.total_value.value;
  if (Array.isArray(metric.values) && metric.values.length > 0) {
    return metric.values.reduce((sum, v) => sum + (typeof v.value === "number" ? v.value : 0), 0);
  }
  return null;
}

/** Followers plus 30-day views and accounts reached. Null when Instagram isn't configured or fails. */
export async function getInstagramStats(): Promise<InstagramStats | null> {
  if (!(await getInstagramToken())) return null;

  const until = Math.floor(Date.now() / 1000);
  const since = until - 30 * DAY + 60; // the API rejects ranges longer than 30 days

  const [profile, insights] = await Promise.all([
    getJson("me", { fields: "followers_count" }),
    getJson("me/insights", {
      metric: "views,reach",
      period: "day",
      metric_type: "total_value",
      since: String(since),
      until: String(until),
    }),
  ]);

  const followers =
    typeof profile?.followers_count === "number" ? profile.followers_count : null;
  const views30d = readMetric(insights, "views");
  const reach30d = readMetric(insights, "reach");

  if (followers === null && views30d === null && reach30d === null) return null;
  return { followers, views30d, reach30d };
}

/** Pulls the shortcode out of a reel or post URL, e.g. ".../reel/DTZCg5IDjOp/" → "DTZCg5IDjOp". */
export function shortcodeOf(url: string): string | null {
  const match = url.match(/instagram\.com\/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
}

/**
 * Live view counts for the Media Kit's featured reels, keyed by shortcode.
 * Finds each reel in the account's media list by its permalink, then reads its
 * "views" insight. Missing or failed reels are simply left out.
 */
export async function getReelViews(urls: string[]): Promise<Record<string, number>> {
  const wanted = new Set(urls.map(shortcodeOf).filter((c): c is string => !!c));
  if (wanted.size === 0 || !(await getInstagramToken())) return {};

  const ids: Record<string, string> = {};
  let after: string | undefined;
  for (let page = 0; page < 6 && Object.keys(ids).length < wanted.size; page++) {
    const params: Record<string, string> = { fields: "id,permalink", limit: "100" };
    if (after) params.after = after;
    const res = await getJson("me/media", params);
    const items = (res?.data as { id?: string; permalink?: string }[] | undefined) ?? [];
    for (const item of items) {
      const code = item.permalink ? shortcodeOf(item.permalink) : null;
      if (code && item.id && wanted.has(code)) ids[code] = item.id;
    }
    after = (res?.paging as { cursors?: { after?: string }; next?: string } | undefined)?.next
      ? (res?.paging as { cursors?: { after?: string } }).cursors?.after
      : undefined;
    if (!after) break;
  }

  const entries = await Promise.all(
    Object.entries(ids).map(async ([code, id]) => {
      const views = readMetric(await getJson(`${id}/insights`, { metric: "views" }), "views");
      return views === null ? null : ([code, views] as const);
    }),
  );
  return Object.fromEntries(entries.filter((e): e is readonly [string, number] => e !== null));
}
