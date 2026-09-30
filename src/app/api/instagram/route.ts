import { NextResponse } from "next/server";

const INSTAGRAM_API_BASE = "https://graph.instagram.com";
const FIELDS = [
  "id",
  "caption",
  "media_type",
  "media_url",
  "permalink",
  "thumbnail_url",
  "timestamp",
  "username",
].join(",");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Instagram is not configured." },
      { status: 503 },
    );
  }

  try {
    const url = new URL(`${INSTAGRAM_API_BASE}/me/media`);
    url.searchParams.set("fields", FIELDS);
    url.searchParams.set("limit", "6");
    url.searchParams.set("access_token", token);

    const response = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    const payload = await response.json();

    if (!response.ok) {
      console.error("Instagram API request failed", {
        status: response.status,
        type: payload?.error?.type,
        code: payload?.error?.code,
        message: payload?.error?.message,
      });

      return NextResponse.json(
        { ok: false, error: "Instagram is temporarily unavailable." },
        { status: 502 },
      );
    }

    const posts = Array.isArray(payload?.data)
      ? payload.data.map((item: Record<string, unknown>) => ({
          id: item.id,
          caption: item.caption ?? "",
          mediaType: item.media_type,
          mediaUrl: item.media_url,
          permalink: item.permalink,
          thumbnailUrl: item.thumbnail_url ?? null,
          timestamp: item.timestamp,
          username: item.username,
        }))
      : [];

    return NextResponse.json(
      { ok: true, posts },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  } catch (error) {
    console.error("Instagram integration error", error);
    return NextResponse.json(
      { ok: false, error: "Instagram is temporarily unavailable." },
      { status: 502 },
    );
  }
}
