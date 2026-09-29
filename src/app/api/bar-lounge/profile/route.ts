import { z } from "zod";
import { currentPlayer, db, kitReady, sameOrigin, storageReady, subscribeToKit } from "@/lib/bar-lounge/storage";
import type { PlayerStats } from "@/lib/bar-lounge/progression";
export const runtime = "nodejs";
const headers = { "Cache-Control": "no-store" };
export async function GET() {
  try {
    const user = await currentPlayer();
    if (!user) return Response.json({ configured: storageReady(), kitConfigured: kitReady(), player: null }, { headers });
    const rows = await db<(PlayerStats & { id: string; display_name: string; newsletter_consent_at: string | null; kit_synced_at: string | null })[]>(`lounge_players?id=eq.${user.id}&select=id,display_name,xp,rounds,correct,total,best_streak,perfect_rounds,cipher_wins,modes,newsletter_consent_at,kit_synced_at`);
    return Response.json({ configured: true, kitConfigured: kitReady(), player: rows[0] ?? null }, { headers });
  } catch { return Response.json({ error: "Unable to load saved progress. Please retry." }, { status: 503, headers }); }
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Invalid origin." }, { status: 403, headers });
  try {
    const user = await currentPlayer();
    if (!user?.email) return Response.json({ error: "Sign in first." }, { status: 401, headers });
    const parsed = z.object({ newsletter: z.literal(true) }).safeParse(await request.json());
    if (!parsed.success || !kitReady()) return Response.json({ error: "Newsletter signup is not available yet." }, { status: 400, headers });
    const [player] = await db<{ display_name: string }[]>(`lounge_players?id=eq.${user.id}&select=display_name`);
    await db(`lounge_players?id=eq.${user.id}`, "PATCH", { newsletter_consent_at: new Date().toISOString() });
    await subscribeToKit(user.email, player.display_name);
    await db(`lounge_players?id=eq.${user.id}`, "PATCH", { kit_synced_at: new Date().toISOString() });
    return Response.json({ ok: true }, { headers });
  } catch (e) { return Response.json({ error: e instanceof Error ? e.message : "Unable to subscribe." }, { status: 503, headers }); }
}
