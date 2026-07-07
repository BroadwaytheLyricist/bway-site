# Client Handoff: Virtual Call Setup with Claude Code

This document is for a live handoff call where the client receives the Broadway The Lyricist website, imports it into their own GitHub/Vercel accounts, configures the required services, launches the production domain, and verifies the site with Claude Code.

## Message to send the client before the call

Hi — before our website handoff call, please have these ready:

- Access to the GitHub account or organization that should own the website repo.
- Access to the Vercel account or team that should host the live site.
- Access to the domain/DNS account for the final website domain.
- A Resend account/API key for the contact form.
- The inbox where website contact-form messages should be delivered.
- A verified sender email in Resend, if you already have one.
- A Google/YouTube Data API key if you want live YouTube stats in the media kit.
- Claude Code installed and signed in on your computer if you want to run the handoff prompt yourself.

I will provide the website repo, the Vercel deployment guidance, the exact environment variable names, DNS instructions, post-launch verification checks, and a copy-paste Claude Code prompt to help import, deploy, and verify the site.

## What this project is

- **Framework:** Next.js 16 App Router, React 19, Tailwind CSS v4.
- **Primary routes:** `/` homepage and `/media-kit` partnership media kit.
- **Source entry points:** `src/app/page.tsx`, `src/app/media-kit/page.tsx`, `src/app/layout.tsx`.
- **Site config:** `src/lib/site.ts` contains social links, nav links, business email, YouTube channel id, featured videos, and playlist links.
- **Media kit config:** `src/lib/media-kit.ts` contains media kit text, stats, recognition cards, social proof screenshots, studio assets, and partnership offerings.
- **Current production host:** `https://bway-site.vercel.app`.
- **Current metadata base:** `src/app/layout.tsx` uses `https://bway-site.vercel.app` so social preview images resolve to a working asset.

## Required accounts

Have these accounts ready before the call:

1. **GitHub**
   - A client-owned GitHub account or organization.
   - Permission to receive a repository transfer or create/import a new private repository.

2. **Vercel**
   - A client-owned Vercel account or team.
   - GitHub connected to Vercel.
   - Permission to import a GitHub repository and add custom domains.

3. **Resend**
   - Needed for the contact form.
   - Create an API key.
   - For production delivery, verify a sending domain in Resend.

4. **Domain registrar / DNS provider**
   - Login for the domain that should go live, for example `broadwaythelyricist.com`.
   - Ability to change DNS records.

5. **Google Cloud / YouTube Data API**
   - Optional but recommended for live YouTube channel stats on the media kit.
   - The latest videos feed works without this key.

6. **Claude Code**
   - Install and sign in before the call.
   - The client should be able to run terminal commands locally.

## What the client must prepare before the call

Bring these exact values or decisions:

- GitHub username or organization name that should own the repo.
- Vercel team/account that should own the deployment.
- Production domain to use.
- Whether `www` should redirect to the apex domain or the apex should redirect to `www`.
- Resend API key.
- Contact form recipient email.
- Verified sender email for Resend, ideally something like `Broadway The Lyricist <contact@yourdomain.com>`.
- Google Cloud YouTube Data API key, if live media-kit channel stats should be enabled.
- Access to the email inbox receiving form submissions.
- Access to the domain registrar/DNS dashboard.

## GitHub ownership setup

Recommended ownership model:

1. Create a client-owned GitHub organization or use the client’s existing account.
2. Transfer or import the repository into that owner.
3. Keep the repository private until launch is approved.
4. Give the developer temporary admin/maintainer access during the handoff call.
5. After launch, reduce developer access to collaborator or remove access if the client wants full ownership.

During the call, confirm:

- The repo exists under the client owner.
- The default branch is `main`.
- The latest commit is present.
- Vercel is connected to that GitHub repo.

## Vercel setup

Import the GitHub repo into Vercel as a Next.js project.

Use the defaults unless Vercel detects something unusual:

- **Framework preset:** Next.js.
- **Install command:** `npm install`.
- **Build command:** `npm run build`.
- **Output directory:** leave default.
- **Root directory:** repository root.
- **Production branch:** `main`.

The project does not currently use `vercel.json`; deployment is configured through Vercel’s dashboard and the GitHub integration.

## Environment variables

These are the env vars used by the code.

| Variable | Required? | Where used | Purpose |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | Required for contact form delivery | `src/app/actions.ts` | Sends contact-form emails through Resend. |
| `CONTACT_TO_EMAIL` | Recommended | `src/app/actions.ts` | Inbox that receives contact-form submissions. Defaults to `links.email` in `src/lib/site.ts` if unset. Current fallback is `RamcorpManagment@gmail.com`. |
| `CONTACT_FROM_EMAIL` | Recommended for production | `src/app/actions.ts` | Sender shown on emails. Defaults to `Broadway The Lyricist <onboarding@resend.dev>`, which is only safe for test delivery to the Resend account owner. |
| `YOUTUBE_API_KEY` | Optional | `src/lib/youtube.ts` | Enables live YouTube subscriber/view/video stats on `/media-kit`. If missing, the media kit falls back to manual placeholder stats. |

Set these in Vercel:

1. Project → Settings → Environment Variables.
2. Add each variable for **Production**.
3. Also add them for **Preview** if the client wants preview deployments to behave like production.
4. Redeploy after changing env vars.

### Resend contact-form notes

The contact form is implemented in `src/app/actions.ts`.

Behavior:

- It validates name, email, subject, and message.
- It has a honeypot field to silently ignore simple bots.
- If `RESEND_API_KEY` is missing, it does not pretend to send; it shows the visitor an error telling them to email directly.
- If Resend rejects the message, the app logs the error and shows a generic retry message.

Production recommendation:

- Verify the client’s sending domain in Resend.
- Set `CONTACT_FROM_EMAIL` to a sender on that verified domain.
- Set `CONTACT_TO_EMAIL` to the inbox Broadway actually checks.
- Submit a real test message after launch.

## YouTube behavior

The YouTube integration has two separate parts.

### Latest videos on the homepage

- Code: `src/lib/youtube.ts` → `getLatestVideos(2)`.
- UI: `src/components/sections/LatestVideos.tsx`.
- Source: public YouTube RSS feed for `YOUTUBE_CHANNEL_ID` in `src/lib/site.ts`.
- Current channel id: `UCSReMFrM5-41HxZoT5FAmSg`.
- No API key required.
- Revalidates hourly with `next: { revalidate: 3600 }`.
- Filters out Shorts by probing `/shorts/<id>` and keeping regular uploads.
- Never throws to the page; failures return an empty array so the UI can fall back gracefully.

### Media-kit channel stats

- Code: `src/lib/youtube.ts` → `getChannelStats()`.
- UI: `src/app/media-kit/page.tsx`.
- Requires `YOUTUBE_API_KEY`.
- Uses the YouTube Data API `channels?part=statistics` endpoint.
- Revalidates hourly.
- If the key is missing or the API fails, the media kit uses manual fallback values.

## Domain and DNS setup

Current working production URL is:

- `https://bway-site.vercel.app`

The custom domain should be connected inside Vercel before changing app metadata back to the custom domain.

Steps:

1. In Vercel, open the project.
2. Go to Settings → Domains.
3. Add the production domain, for example `broadwaythelyricist.com`.
4. Add the `www` version too, for example `www.broadwaythelyricist.com`.
5. Follow the exact DNS records Vercel shows for that project/domain.

Common Vercel DNS pattern:

- Apex/root domain: add an **A** record for `@` pointing to the IP Vercel shows. Vercel docs commonly show `76.76.21.21` as the example apex A record.
- `www` subdomain: add a **CNAME** record for `www` pointing to Vercel’s CNAME target, commonly `cname.vercel-dns.com`.

Use Vercel’s dashboard as the source of truth because it validates the domain and shows the exact required records.

After DNS verifies:

1. Visit the custom domain.
2. Confirm `/` returns 200.
3. Confirm `/media-kit` returns 200.
4. Confirm `/images/og/broadway-social-preview.jpg` returns 200 on the custom domain.
5. Only then update `src/app/layout.tsx` so `metadataBase` uses the custom domain instead of `https://bway-site.vercel.app`.
6. Commit, push, and redeploy.

## Post-launch verification checklist

Run these checks after the Vercel deployment is live.

### Site pages

- Homepage returns 200.
- `/media-kit` returns 200.
- Header nav links work.
- Media kit print/download button works visually.
- Latest videos section loads or shows the graceful fallback.
- YouTube links open the correct channel/videos.

### Contact form

- Submit a test inquiry with a real email.
- Confirm success message appears.
- Confirm email arrives in `CONTACT_TO_EMAIL`.
- Confirm Reply-To uses the visitor’s submitted email.
- If it fails, check Vercel Function logs and Resend logs.

### Social preview

Check these URLs:

```bash
curl -sL -A 'Twitterbot/1.0' https://bway-site.vercel.app/ | grep -E 'og:image|twitter:image'
curl -sL -A 'Twitterbot/1.0' https://bway-site.vercel.app/media-kit | grep -E 'og:image|twitter:image'
curl -I https://bway-site.vercel.app/images/og/broadway-social-preview.jpg
```

Expected result:

- `og:image` points to `https://bway-site.vercel.app/images/og/broadway-social-preview.jpg` until custom-domain metadata is updated.
- `twitter:image` points to the same asset.
- The image asset returns 200.

After the custom domain is connected and `metadataBase` is changed, repeat the same checks with the custom domain.

### Platform cache refresh

If a social app still shows an old preview after the tags are correct:

1. Confirm the current `og:image` URL returns 200.
2. Use each platform’s share/debug tool to rescrape the page.
3. If needed, rename the image file to a versioned filename such as `broadway-social-preview-v2.jpg`, update metadata, redeploy, and rescrape.

## Copy-paste Claude Code prompt for the client

Use this prompt during the handoff call after the client has GitHub, Vercel, Resend, and DNS access ready.

```text
You are helping me import, deploy, configure, and verify the Broadway The Lyricist website.

Work in phases and ask before destructive actions.
Do not expose secret values in chat or logs.
Do not commit or push unless I explicitly approve.

Repository:
- GitHub repo: <PASTE CLIENT-OWNED REPO URL HERE>
- Production branch: main
- Framework: Next.js App Router

Production target:
- Temporary Vercel domain should work first.
- Final custom domain: <PASTE DOMAIN HERE>

Environment variables to configure in Vercel:
- RESEND_API_KEY=<PASTE OR ENTER SECURELY IN VERCEL DASHBOARD>
- CONTACT_TO_EMAIL=<PASTE CONTACT INBOX>
- CONTACT_FROM_EMAIL=<PASTE VERIFIED RESEND SENDER>
- YOUTUBE_API_KEY=<PASTE OPTIONAL YOUTUBE DATA API KEY OR LEAVE UNSET>

Please do the following:

1. Inspect the repo without changing files.
   - Read package.json, README.md, .env.example, src/app/actions.ts, src/lib/youtube.ts, src/lib/site.ts, src/app/layout.tsx, and src/app/media-kit/page.tsx.
   - Summarize scripts, env vars, contact form behavior, YouTube behavior, metadataBase, and deployment assumptions.

2. Confirm GitHub and Vercel ownership.
   - Verify I own or have admin access to the GitHub repo.
   - Verify the Vercel project is connected to this repo and deploys from main.

3. Configure Vercel environment variables.
   - Tell me exactly where to enter each variable.
   - Wait for me to confirm the variables are saved.
   - Do not print secret values.

4. Trigger a production deployment from main.
   - If using Vercel Git integration, push or redeploy only after I confirm.
   - If using Vercel dashboard, guide me through clicking Redeploy.

5. Verify production.
   - Check / returns 200.
   - Check /media-kit returns 200.
   - Check /images/og/broadway-social-preview.jpg returns 200.
   - Check og:image and twitter:image on / and /media-kit.
   - Submit or guide me through submitting one contact-form test and checking Resend/Vercel logs if needed.

6. Configure custom domain.
   - Add <PASTE DOMAIN HERE> and www.<PASTE DOMAIN HERE> in Vercel.
   - Tell me the exact DNS records Vercel shows.
   - Wait while I update DNS.
   - Verify DNS in Vercel.
   - Once the custom domain serves the Vercel site and the OG image asset returns 200 on that domain, update src/app/layout.tsx metadataBase to the custom domain, then ask for approval before committing.

7. Final report.
   - List production URL, custom domain status, env vars configured by name only, contact-form status, YouTube stats status, and social preview status.
```

## Final call agenda

1. Confirm client account access.
2. Transfer/import GitHub repo.
3. Import Vercel project from GitHub.
4. Add env vars.
5. Deploy temporary Vercel URL.
6. Verify pages, contact form, YouTube/feed behavior, and social preview.
7. Add custom domain and DNS.
8. Verify custom domain.
9. Update `metadataBase` to custom domain only after custom domain assets return 200.
10. Commit final domain metadata change after client approval.

## Known handoff note

The app currently uses `https://bway-site.vercel.app` as `metadataBase` because that domain serves the deployed app and OG image asset successfully. Do not switch metadata to `broadwaythelyricist.com` until that domain is connected to the Vercel project and serves `/images/og/broadway-social-preview.jpg` with HTTP 200.
