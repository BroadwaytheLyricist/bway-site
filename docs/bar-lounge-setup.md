# The Bar Lounge: player records and launch setup

## Start here

You do not need Supabase or Kit to launch guest play. Launch the visual update and guest games first. Later, connect Supabase for player accounts and shared rankings. Add Kit only when you want to send email updates. The detailed configuration below is a reference for that later stage.

## What is ready

The preview includes guest XP, cumulative tier progression, seven achievement badges, a player record screen, weekly/all-time leaderboard screens, email-code sign-in, and a server-scored database implementation. The supplied transparent PNG replaces the Lounge hero portrait. The page reuses the homepage stage photograph, diagonal lighting and moving smoke, while the portrait pixels remain unchanged. The Bar Lounge appears in the shared desktop/mobile navigation and footer.

Guest XP and badges work immediately in the same browser. Accounts and shared rankings require the Supabase setup below. Kit is optional, and Google Forms is not needed. Guest progress is separate from verified account progress and is not imported into competitive rankings.

## Brand comparison

| Element | Main site | Bar Lounge after this update |
|---|---|---|
| Brand orange | `#ff5a1f` | Same shared `--color-accent` token for active links and accents |
| Primary buttons | Gradient `#ff6a2b` to `#ff4d0f` | Same shared gradient tokens |
| Display font | Anton | Anton for headings, tier labels, Lounge branding and mode navigation |
| Body and controls | Inter | Inter for body copy, forms, and primary/secondary buttons |
| Main surfaces | Midnight navy `#0a0e17`, panels `#0d1320` | Same homepage stage photo, diagonal lighting and smoke; navy play and record panels |
| Tier colors | Not used | Green, gold, orange, red and purple indicate the five tiers |
| Global navigation/footer | Shared components | Same components, unchanged |

Amber/gold remains an atmosphere and icon treatment, while the action orange matches the main brand. Small mode descriptions and actions were enlarged for mobile readability. The five tier panels reorganize on narrow screens rather than shrinking into unreadable columns.

## How player records work

| Record | Location | Who can see it |
|---|---|---|
| Verified email and authentication identity | Supabase Auth | Account owner/admin; not returned by leaderboard endpoints |
| Display name, XP, correct answers, total answers, rounds, best streak, perfect rounds, cipher wins and completed modes | `lounge_players` | That signed-in player through the profile endpoint; site owner in Supabase |
| Current question, server start time, answers/guesses and score | `lounge_runs` | Server and site owner |
| Completed round score, XP and completion timestamp | `lounge_rounds` | Server and site owner; public rankings receive aggregates only |
| Earned badge ID and award timestamp | `lounge_badges` | Server and site owner; player UI shows earned badges |
| Newsletter consent and successful Kit submission time | `lounge_players` | Server and site owner |
| Newsletter subscriber/confirmation/unsubscribe state | Kit | Site owner and subscriber |
| Guest XP, badges and daily puzzle guesses | Browser local storage | That browser; removable by clearing browser data |

Player accounts persist across devices after signing in with the same verified email. The app uses HttpOnly session cookies and checks the authenticated account before reading or changing a run. All private tables have row-level security enabled and no browser-role access. The service key is server-only.

Server clocks determine timed scores. Future ranked mystery clues are not sent until their reveal time. A database transaction records the completed round, XP and badges together; repeated requests do not count a round twice. Daily Cipher attempts resume from the database and each player has one run per daily puzzle.

The weekly leaderboard counts XP earned since Monday at midnight in America/New_York. Resetting the weekly view does not delete rounds, lifetime XP or badges. Ties use rounds played and then a stable player-ID order. Public output contains display name, XP, rounds and accuracy only.

XP: 25 per finished round, plus 1 per 10 score points. Five lifetime tiers start at 0, 1,000, 3,000, 7,000 and 15,000 XP. Achievements recognize a first round, a solved cipher, a perfect timed round, five consecutive correct answers, all three modes, ten completed rounds, and the top tier.

## Required: Supabase

1. Create an account at https://supabase.com and a project named **Bar Lounge**. Keep the database password in your password manager.
2. Open the project's SQL Editor and run `supabase/bar-lounge.sql` from this repository.
3. In Authentication, enable email sign-in. In the Magic Link email template, include the code variable `{{ .Token }}` so players can enter an email code on the site. Keep the code expiration short enough for a normal sign-in session.
4. Configure a custom SMTP sender in Supabase Authentication settings. Resend is a supported option; verify a domain and choose a sender such as `login@broadwaythelyricist.com`. Supabase's built-in test sender does not deliver public visitor sign-ins: it is limited to pre-authorized project-team addresses.
5. Add these encrypted environment variables to the **Preview** environment of the Vercel `bway-site` project, scoped to `homepage-redesign-preview-v3` if desired:

   | Variable | Value |
   |---|---|
   | `SUPABASE_URL` | Project URL from Supabase |
   | `SUPABASE_ANON_KEY` | Project anon API key used for Auth requests |
   | `SUPABASE_SERVICE_ROLE_KEY` | Project service-role API key; server-only |

6. Redeploy the preview. Verify a real email code, complete a round, confirm XP and badges, sign in on a second device, and check the leaderboard. Add the same settings to Production only when launching that version.

Do not paste API keys into chat, commit them, or give the service key a `NEXT_PUBLIC_` prefix. Enter them directly in Vercel's environment settings.

You can manage player records in Supabase's Table Editor. To export email addresses with stats, run this owner-only SQL query in the SQL Editor, then download the result as CSV:

```sql
select u.email, p.display_name, p.xp, p.rounds, p.correct, p.total,
       p.best_streak, p.perfect_rounds, p.cipher_wins, p.modes,
       p.newsletter_consent_at, p.kit_synced_at, p.created_at
from public.lounge_players p
join auth.users u on u.id = p.id
order by p.created_at desc;
```

Use the Kit subscriber list for newsletter broadcasts. A verified game email alone does not enroll a player in newsletters. To remove an account and its game records, delete the user in Supabase Auth; related records cascade. Newsletter unsubscribe state remains managed separately in Kit. Enable backups appropriate to your Supabase plan before public launch.

## Optional: Kit

1. Create your creator account at https://kit.com using your business email. The Free plan is a starting option; verify current limits on https://kit.com/pricing.
2. Set the creator name to **Broadway the Lyricist**, configure and verify your newsletter sender, and complete Kit's sending-account details.
3. Under Grow → Landing Pages & Forms, create a dedicated **Bar Lounge Updates** form. Keep the incentive/confirmation email enabled and turn automatic subscriber confirmation off. Customize the confirmation email to explain that subscribers will receive Broadway videos and Bar Lounge updates.
4. In Settings → Developer, create a **V4 API key** for this account. Add it to Vercel as `KIT_API_KEY`. Add the numeric form ID as `KIT_FORM_ID`. Both stay server-side.
5. Redeploy. Sign in to the Lounge, explicitly check the optional newsletter box, and subscribe. Verify that the address enters the dedicated form, receives the confirmation email and becomes active only after confirming. Test unsubscribe through a Kit email.

Kit is independent of game scoring. Player XP, rounds and badges do not need to be copied into Kit. The integration creates new subscribers as inactive, preserving existing subscribers' state, then adds the address to the dedicated form. Kit submissions only happen after the player explicitly chooses newsletter updates. Failed subscriptions show a retry message without losing the saved game profile.

Live Kit delivery must be tested with your real configured form before enabling newsletter signup publicly. No broadcasts are sent by this implementation.

## Google Forms

No Google Form is necessary for registration, stats, badges or newsletter signup. The website already has the needed profile/sign-in and optional newsletter controls. A future feedback survey could use Google Forms, but it is not part of the player record system.

## Validation

- TypeScript, ESLint and the production build pass.
- Browser checks cover guest XP, perfect-round/streak badges, daily award deduplication, reload persistence, leaderboard unavailable states, and layouts at 390, 768 and 1440 pixels.
- Isolated PostgreSQL checks cover the schema, atomic awards, duplicate submissions, private-table permissions, badge timestamps and weekly/all-time aggregation.
- End-to-end API checks against an isolated Supabase-shaped test adapter cover email-code sign-in/session cookies, owned runs, server timing, ignored client score fields, saved daily guesses, timed clue visibility, durable XP/badges, and cross-origin rejection.
- Real Supabase sign-in delivery and live Kit signup remain launch checks after account configuration.

Official references: https://supabase.com/docs/guides/auth/auth-email-passwordless · https://supabase.com/docs/guides/auth/auth-smtp · https://developers.kit.com/api-reference/authentication · https://developers.kit.com/api-reference/subscribers/create-a-subscriber · https://developers.kit.com/api-reference/forms/add-subscriber-to-form-by-email-address
