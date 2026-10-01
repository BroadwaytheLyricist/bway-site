import "server-only";

/**
 * Self-renewing Instagram access token.
 *
 * Instagram tokens last 60 days. A weekly Vercel Cron job calls
 * /api/instagram/refresh, which trades the current token for a fresh 60-day
 * one and saves it in Supabase (public.site_secrets, server-only). The site
 * always reads the saved token first and falls back to the
 * INSTAGRAM_ACCESS_TOKEN environment variable, which also seeds the very
 * first renewal. If Supabase isn't configured, the env token is used as-is.
 */

const NAME = "instagram_access_token";

function storageReady() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function headers(): Record<string, string> {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  // New-style secret keys (sb_secret_...) go only in the apikey header;
  // legacy service_role keys (JWTs starting "eyJ") also go in Authorization.
  return key.startsWith("eyJ")
    ? { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" }
    : { apikey: key, "Content-Type": "application/json" };
}

async function readStored(fresh: boolean): Promise<string | null> {
  if (!storageReady()) return null;
  try {
    const res = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/site_secrets?name=eq.${NAME}&select=value`,
      {
        headers: headers(),
        // Page renders reuse the stored token for up to an hour; renewals read it fresh.
        ...(fresh ? { cache: "no-store" as const } : { next: { revalidate: 3600 } }),
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as { value?: string }[];
    return rows[0]?.value || null;
  } catch {
    return null;
  }
}

/** The token the site should use right now. */
export async function getInstagramToken(): Promise<string | null> {
  return (await readStored(false)) || process.env.INSTAGRAM_ACCESS_TOKEN || null;
}

export type RefreshResult = { ok: true; expiresAt: string } | { ok: false; error: string };

/** Trades the current token for a fresh 60-day token and saves it. */
export async function refreshInstagramToken(): Promise<RefreshResult> {
  if (!storageReady()) return { ok: false, error: "Supabase is not configured, so a renewed token cannot be saved." };

  const current = (await readStored(true)) || process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!current) return { ok: false, error: "No Instagram token found to renew." };

  let payload: { access_token?: string; expires_in?: number; error?: { message?: string } };
  try {
    const url = new URL("https://graph.instagram.com/refresh_access_token");
    url.searchParams.set("grant_type", "ig_refresh_token");
    url.searchParams.set("access_token", current);
    const res = await fetch(url.toString(), { cache: "no-store", signal: AbortSignal.timeout(10000) });
    payload = await res.json();
    if (!res.ok || !payload.access_token) {
      console.error("Instagram token renewal failed", res.status, payload?.error?.message);
      return { ok: false, error: "Instagram declined the renewal. The token may already be expired." };
    }
  } catch (error) {
    console.error("Instagram token renewal error", error);
    return { ok: false, error: "Instagram could not be reached." };
  }

  const expiresAt = new Date(Date.now() + (payload.expires_in ?? 60 * 24 * 60 * 60) * 1000).toISOString();
  try {
    const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/site_secrets?on_conflict=name`, {
      method: "POST",
      cache: "no-store",
      headers: { ...headers(), Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ name: NAME, value: payload.access_token, expires_at: expiresAt, updated_at: new Date().toISOString() }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.error("Saving renewed Instagram token failed", res.status);
      return { ok: false, error: "The token renewed, but saving it failed. Check that site_secrets exists in Supabase." };
    }
  } catch (error) {
    console.error("Saving renewed Instagram token error", error);
    return { ok: false, error: "The token renewed, but Supabase could not be reached." };
  }

  return { ok: true, expiresAt };
}
