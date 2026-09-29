import { z } from "zod";
import { authRequest, clearSession, db, sameOrigin, saveSession, storageReady, type Session } from "@/lib/bar-lounge/storage";
export const runtime = "nodejs";
const headers = { "Cache-Control": "no-store" };
const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("send"), email: z.string().email().max(254) }),
  z.object({ action: z.literal("verify"), email: z.string().email().max(254), code: z.string().regex(/^\d{6,8}$/), name: z.string().trim().min(2).max(24).regex(/^[\p{L}\p{N} _.'-]+$/u) }),
  z.object({ action: z.literal("logout") }),
]);
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Invalid origin." }, { status: 403, headers });
  if (!storageReady()) return Response.json({ error: "Player accounts are not open yet. Guest progress still works." }, { status: 503, headers });
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Use a valid email, code and display name (2–24 characters)." }, { status: 400, headers });
    const b = parsed.data;
    if (b.action === "logout") { await clearSession(); return Response.json({ ok: true }, { headers }); }
    if (b.action === "send") { await authRequest("otp", { email: b.email.toLowerCase(), create_user: true }); return Response.json({ ok: true }, { headers }); }
    const session = await authRequest<Session>("verify", { email: b.email.toLowerCase(), token: b.code, type: "email" });
    const players = await db<{ id: string }[]>(`lounge_players?id=eq.${session.user.id}&select=id`);
    if (!players.length) await db("lounge_players", "POST", { id: session.user.id, display_name: b.name });
    await saveSession(session);
    return Response.json({ ok: true }, { headers });
  } catch (e) { return Response.json({ error: e instanceof Error ? e.message : "Unable to sign in." }, { status: 400, headers }); }
}
