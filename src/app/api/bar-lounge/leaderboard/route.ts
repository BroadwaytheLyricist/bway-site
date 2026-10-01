import { db, storageReady } from "@/lib/bar-lounge/storage";
export const runtime = "nodejs";
const headers = { "Cache-Control": "no-store" };
export async function GET(request: Request) {
  if (!storageReady()) return Response.json({ configured: false, entries: [] }, { headers });
  try {
    const entries = await db("rpc/lounge_leaderboard", "POST", { p_weekly: new URL(request.url).searchParams.get("period") !== "all" });
    return Response.json({ configured: true, entries }, { headers });
  } catch { return Response.json({ error: "Rankings are temporarily unavailable." }, { status: 503, headers }); }
}
