# Homepage redesign: preview and launch handoff

Updated: 2026-09-27

## Saved state

- Repository: `BroadwaytheLyricist/bway-site`
- Working branch: `homepage-redesign-preview-v3`
- Last visual update before this handoff: `900f11ae99ffbf7271a80ac4f7d77543d24c7f6d`
- Live branch: `main` (still at `f6146994d47532726aaf3fe87822ad2382d0b116` when checked)
- GitHub comparison at this checkpoint: preview is 49 commits ahead of `main`, 0 behind. The handoff commit adds one more commit to the preview branch.
- Latest visual preview before this document: https://vercel.com/broadway-the-lyricist/bway-site/8QYM2xviHanbDaEnbShpyzFFMTiX

The work is committed on the GitHub preview branch. The live branch has not been updated.

## Implemented

- Hero: layered portrait, continuously moving smoke, entrance movement, and brand marquee.
- About: separate stage background and portrait with entrance movement, tuned edge lighting, and a bottom fade.
- Latest Uploads and Playlists: stage backdrop, card entrance movement, channel content and playlist links.
- Blog: homepage feature, article reading-page textures, and a dedicated `/blog` listing with a dark workspace background and a moving desk/laptop/mic layer.
- Original Music: navy studio treatment, moving artist portrait, real Bandcamp embed for **Off Broadway EP (Unmastered) Deluxe Edition**, full Bandcamp catalog link, and links for Spotify, Apple Music, Amazon Music, YouTube Music, TIDAL, and Deezer.
- Contact: social links and updated section styling.
- Reduced-motion styling for the moving visual layers.

Key code: `src/app/page.tsx`, `src/components/sections/`, `src/app/blog/`, `src/app/globals.css`, `src/lib/site.ts`. Image and smoke files live under `public/images/` and `public/videos/`.

## Before moving to the live branch

1. Review the latest preview at desktop and mobile widths, including scroll movement, portrait crops, smoke, article layout, and the music card. The last music adjustment places the hands behind the translucent left edge of the Bandcamp frame; this still needs a visual sign-off in the browser.
2. Test an actual play/pause interaction in the Bandcamp embed. The local and Vercel production builds pass, but a build does not prove third-party audio playback.
3. Check the Latest Uploads feed and all three featured playlist destinations. `YOUTUBE_API_KEY` enables API-backed channel metadata; the video section has curated fallbacks when live data is unavailable. Keep the key in Vercel environment settings, not in Git.
4. Send one contact-form test and confirm delivery. `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL` are described in `.env.example`. A verified sender is needed for delivery beyond Resend's test-account address.
5. Confirm the music destination links. The current Spotify button leads to the verified **Tryna Get It** track; replace it with the artist-profile URL if a full catalog destination is preferred. The supplied Amazon Music, YouTube Music, and Bandcamp URLs are already configured.
6. When the preview is approved for launch, open a pull request from `homepage-redesign-preview-v3` into `main`, review its diff and deployment checks, and merge only after explicit launch approval. Verify the production domain immediately afterward.

## Rollback reference

The production `main` commit was `f6146994d47532726aaf3fe87822ad2382d0b116` at this checkpoint. If `main` changes before launch, record its then-current commit before merging. Reverting the launch merge/commit restores the prior production code without discarding the preview branch.
