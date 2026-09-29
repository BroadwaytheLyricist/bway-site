import "server-only";
import { cookies } from "next/headers";

export function storageReady() { return !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY); }
export function kitReady() { return !!(process.env.KIT_API_KEY && process.env.KIT_FORM_ID); }
export async function db<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${path}`, { method, cache: "no-store", headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=representation" }, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(10000) });
  if (!res.ok) { console.error("Bar Lounge database request failed", res.status, path.split("?")[0]); throw new Error("Player records are temporarily unavailable. Please try again."); }
  const value = await res.text(); return (value ? JSON.parse(value) : null) as T;
}
type AuthUser = { id: string; email?: string; user_metadata?: { display_name?: string } };
type Session = { access_token: string; refresh_token: string; expires_in: number; user: AuthUser };
export async function authRequest<T>(path: string, body?: unknown, token?: string): Promise<T> {
  const res = await fetch(`${process.env.SUPABASE_URL}/auth/v1/${path}`, { method: body === undefined ? "GET" : "POST", cache: "no-store", headers: { apikey: process.env.SUPABASE_ANON_KEY!, "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(res.status === 429 ? "Please wait before requesting another code." : "Sign-in could not be completed. Check your code or request a new one.");
  return await res.json() as T;
}
export async function saveSession(session: Session) {
  const jar = await cookies();
  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/api/bar-lounge" };
  jar.set("lounge-access", session.access_token, { ...options, maxAge: session.expires_in });
  jar.set("lounge-refresh", session.refresh_token, { ...options, maxAge: 60 * 60 * 24 * 30 });
}
export async function currentPlayer(): Promise<AuthUser | null> {
  if (!storageReady()) return null;
  const jar = await cookies();
  const access = jar.get("lounge-access")?.value;
  if (access) { try { return await authRequest<AuthUser>("user", undefined, access); } catch {} }
  const refresh = jar.get("lounge-refresh")?.value;
  if (refresh) { try { const session = await authRequest<Session>("token?grant_type=refresh_token", { refresh_token: refresh }); await saveSession(session); return session.user; } catch {} }
  return null;
}
export async function clearSession() { const jar = await cookies(); for (const name of ["lounge-access", "lounge-refresh"]) jar.set(name, "", { path: "/api/bar-lounge", maxAge: 0 }); }
export function sameOrigin(request: Request) { const origin = request.headers.get("origin"); return origin === new URL(request.url).origin; }
export async function subscribeToKit(email: string, name: string) {
  if (!kitReady()) return false;
  const send = async (path: string, body: object) => {
    const res = await fetch(`https://api.kit.com/v4/${path}`, { method: "POST", headers: { "Content-Type": "application/json", "X-Kit-Api-Key": process.env.KIT_API_KEY! }, body: JSON.stringify(body), signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error("Your player profile is saved, but newsletter signup failed. Please try again.");
  };
  // New addresses remain inactive until confirmation. Existing subscriber state
  // is preserved by Kit's upsert, including prior unsubscribe preferences.
  await send("subscribers", { email_address: email, first_name: name, state: "inactive" });
  await send(`forms/${encodeURIComponent(process.env.KIT_FORM_ID!)}/subscribers`, { email_address: email });
  return true;
}
export type { AuthUser, Session };
