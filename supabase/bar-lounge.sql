-- Run once in your Supabase SQL Editor. No private table is browser-accessible.
create table if not exists public.lounge_players (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 24),
  xp integer not null default 0, rounds integer not null default 0,
  correct integer not null default 0, total integer not null default 0,
  best_streak integer not null default 0, perfect_rounds integer not null default 0,
  cipher_wins integer not null default 0, modes text[] not null default '{}',
  newsletter_consent_at timestamptz, kit_synced_at timestamptz,
  created_at timestamptz not null default now()
);
create table if not exists public.lounge_runs (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.lounge_players(id) on delete cascade,
  daily_key text, state jsonb not null, version integer not null default 0,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  unique(player_id, daily_key)
);
create table if not exists public.lounge_rounds (
  id uuid primary key references public.lounge_runs(id) on delete cascade,
  player_id uuid not null references public.lounge_players(id) on delete cascade,
  mode text not null check (mode in ('daily','practice','clues')),
  points integer not null, xp integer not null, correct integer not null,
  total integer not null, best_streak integer not null, won boolean not null default false,
  completed_at timestamptz not null default now()
);
create table if not exists public.lounge_badges (
  player_id uuid not null references public.lounge_players(id) on delete cascade,
  badge_id text not null, awarded_at timestamptz not null default now(),
  primary key(player_id, badge_id)
);
create index if not exists lounge_rounds_week_idx on public.lounge_rounds(completed_at, player_id);
create index if not exists lounge_runs_player_idx on public.lounge_runs(player_id, created_at);
alter table public.lounge_players enable row level security;
alter table public.lounge_runs enable row level security;
alter table public.lounge_rounds enable row level security;
alter table public.lounge_badges enable row level security;
revoke all on public.lounge_players, public.lounge_runs, public.lounge_rounds, public.lounge_badges from anon, authenticated;
-- Newer Supabase projects do not grant table access to the server key automatically.
-- The site's server (service_role) needs these; browsers (anon, authenticated) stay locked out.
grant usage on schema public to service_role;
grant select, insert, update, delete on public.lounge_players, public.lounge_runs, public.lounge_rounds, public.lounge_badges to service_role;

-- A compare-and-swap plus award in one transaction. Concurrent submissions and
-- retries cannot record a round or XP twice. Called only by the server key.
create or replace function public.lounge_save_run(p_id uuid, p_player uuid, p_version integer, p_state jsonb, p_complete boolean)
returns boolean language plpgsql security definer set search_path = public as $$
declare affected integer; s public.lounge_players; pts integer; award integer; mode_name text;
begin
  update lounge_runs set state=p_state, version=version+1, completed=p_complete
    where id=p_id and player_id=p_player and version=p_version and completed=false;
  get diagnostics affected = row_count;
  if affected=0 then return false; end if;
  if not p_complete then return true; end if;
  pts := (p_state->>'score')::integer;
  award := 25 + pts/10;
  mode_name := p_state->>'mode';
  insert into lounge_rounds(id,player_id,mode,points,xp,correct,total,best_streak,won)
    values(p_id,p_player,mode_name,pts,award,(p_state->>'correct')::integer,(p_state->>'total')::integer,(p_state->>'best')::integer,coalesce((p_state->>'won')::boolean,false));
  update lounge_players set xp=xp+award, rounds=rounds+1,
    correct=correct+(p_state->>'correct')::integer, total=total+(p_state->>'total')::integer,
    best_streak=greatest(best_streak,(p_state->>'best')::integer),
    perfect_rounds=perfect_rounds+case when mode_name<>'daily' and (p_state->>'correct')::integer=(p_state->>'total')::integer then 1 else 0 end,
    cipher_wins=cipher_wins+case when mode_name='daily' and coalesce((p_state->>'won')::boolean,false) then 1 else 0 end,
    modes=case when mode_name=any(modes) then modes else array_append(modes,mode_name) end
    where id=p_player returning * into s;
  insert into lounge_badges(player_id,badge_id)
    select p_player, badge from (values
      ('first-round',s.rounds>0),('cipher',s.cipher_wins>0),('perfect',s.perfect_rounds>0),
      ('streak',s.best_streak>=5),('range',cardinality(s.modes)=3),('regular',s.rounds>=10),('floor',s.xp>=15000)
    ) as earned(badge,eligible) where eligible on conflict do nothing;
  return true;
end $$;
revoke all on function public.lounge_save_run(uuid,uuid,integer,jsonb,boolean) from public, anon, authenticated;
grant execute on function public.lounge_save_run(uuid,uuid,integer,jsonb,boolean) to service_role;

-- Only display names and aggregate scores leave this function, never emails.
create or replace function public.lounge_leaderboard(p_weekly boolean default true)
returns table(display_name text, xp bigint, rounds bigint, accuracy integer)
language sql stable security definer set search_path=public as $$
  select p.display_name, sum(r.xp)::bigint, count(*)::bigint,
    round(100.0*sum(r.correct)/nullif(sum(r.total),0))::integer
  from lounge_rounds r join lounge_players p on p.id=r.player_id
  where not p_weekly or r.completed_at >= (date_trunc('week', now() at time zone 'America/New_York') at time zone 'America/New_York')
  group by p.id,p.display_name order by sum(r.xp) desc, count(*) desc, p.id limit 25
$$;
revoke all on function public.lounge_leaderboard(boolean) from public, anon, authenticated;
grant execute on function public.lounge_leaderboard(boolean) to service_role;
