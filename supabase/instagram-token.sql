-- Run once in your Supabase SQL Editor.
-- Stores the auto-renewed Instagram access token. Private: only the site's
-- server (service role key) can read or write it; browsers cannot.
create table if not exists public.site_secrets (
  name text primary key,
  value text not null,
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.site_secrets enable row level security;
revoke all on public.site_secrets from anon, authenticated;
grant select, insert, update on public.site_secrets to service_role;
