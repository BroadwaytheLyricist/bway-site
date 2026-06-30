# Broadway The Lyricist

A custom [Next.js](https://nextjs.org) marketing site for **Broadway The Lyricist** — a hip-hop history & commentary creator. It's a single-page site with a hero, about, an auto-updating YouTube video feed, a media kit, and a contact form that emails submissions via [Resend](https://resend.com).

Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, and `next/font` (Anton + Inter). The page lives at `src/app/page.tsx`; the root layout is `src/app/layout.tsx`. Site-wide config (links, nav, featured videos, YouTube channel id) lives in `src/lib/site.ts`.

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The contact form needs `RESEND_API_KEY` to actually send. Without it the form fails gracefully and tells the visitor to email directly — everything else (including the YouTube feed) works without any env vars.

## Environment variables

Copy `.env.example` to `.env.local` and set these:

| Variable | Required | What it does |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes (to send mail) | Resend API key. If unset, the contact form returns an error and logs a warning instead of sending. |
| `CONTACT_TO_EMAIL` | No | Inbox that receives contact-form submissions. Defaults to `links.email` (`RamcorpManagment@gmail.com`) in `src/lib/site.ts` when unset. |
| `CONTACT_FROM_EMAIL` | No | The `From` header. Defaults to `Broadway The Lyricist <onboarding@resend.dev>` (Resend's shared test sender). |

These names match `src/app/actions.ts` exactly.

## Contact form email

The contact form is a server action (`src/app/actions.ts`) that sends through Resend.

**Important — the default sender only delivers to you.** Resend's shared test sender `onboarding@resend.dev` (the `CONTACT_FROM_EMAIL` default) only delivers to **the email address of the Resend account owner**. Because `CONTACT_TO_EMAIL` is unset by default, `toEmail` falls back to `RamcorpManagment@gmail.com` — and Resend will **reject** that send unless that address is the account owner's own email.

To reliably deliver in production, do **one** of:

- **Verify a sending domain** in Resend, then set `CONTACT_FROM_EMAIL` to an address on that domain (e.g. `Broadway The Lyricist <contact@yourdomain.com>`). This lets you send to any recipient, including `RamcorpManagment@gmail.com`.
- **Or** set `CONTACT_TO_EMAIL` to the Resend account owner's email so the test sender is allowed to deliver to it.

Until one of those is done, submissions may silently fail at Resend even though `RESEND_API_KEY` is set.

## YouTube auto-feed

The "Videos" section auto-updates from the channel's RSS feed — no manual editing needed.

- Channel id: `YOUTUBE_CHANNEL_ID` in `src/lib/site.ts`.
- Fetcher: `getLatestVideos()` in `src/lib/youtube.ts`, which reads the channel's public RSS feed.
- It's revalidated hourly (ISR, `revalidate: 3600`), so new uploads appear within an hour.
- It never throws — on any fetch/parse failure it returns an empty array and the UI shows a graceful fallback (e.g. the hand-picked `featuredVideos` in `src/lib/site.ts`).

## Build & deploy

```bash
npm run build
npm start   # run the production build locally
```

Deploy to [Vercel](https://vercel.com/new). Set `RESEND_API_KEY` (and `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` as needed) in the project's Environment Variables, then deploy.
