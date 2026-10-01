import { NextResponse } from "next/server";
import { refreshInstagramToken } from "@/lib/instagram-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Weekly Instagram token renewal, run by Vercel Cron (see vercel.json).
 * Vercel sends "Authorization: Bearer <CRON_SECRET>"; anything else is refused,
 * so nobody else can trigger it. The token itself is never returned.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET is not set." }, { status: 503 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const result = await refreshInstagramToken();
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
