# Launch review: September 29, 2026

## Changes prepared

Removed the extra homepage Enter The Bar Lounge link. Fixed the homepage blog-image link's accessible name. Replaced the Lounge's Round Preview metadata with a production title, description, canonical URL and social metadata. Added the Lounge to the sitemap. Preview deployments inherit noindex/nofollow; production pages inherit index/follow. Clarified that guest progress stays in the same browser.

## Verification

Production build and ESLint passed. Browser sweep covered Home, About, Blog, the Tom Hardy article, Music, Media Kit and The Bar Lounge at 390, 768, 1024 and 1440 pixels. Navigation covered page and section transitions, footer/mobile links, Back and reduced motion. Guest tests covered Daily Cipher, a perfect eight-question practice round, deduplicated daily rewards, XP, streak and achievement badges, saved progress and leaderboard availability messages. Contact-field validation passed; no emails or newsletter subscriptions were sent.

## Limits and launch scope

The deployed Vercel preview redirects this test session to Vercel login, so browser verification used the matching local production build. The workspace blocked YouTube thumbnail requests with DNS errors; hosted thumbnails, third-party players and email delivery still require a check in the owner's authenticated preview session. This is not evidence that production thumbnails are broken.

Without Supabase, player records remain browser-local and shared rankings/sign-in show coming-soon messages. Kit is not connected in the tested environment. A separate Kit form can be embedded without coupling it to game accounts; the owner must supply a real Kit form embed code before subscriptions can be tested. Google Forms is not required for game records or the site's contact flow.

Production publishing remains pending the owner's explicit approval. The current changes are prepared only on homepage-redesign-preview-v3.

## Search preview

The illustrative review at /review/seo.html uses the exact page titles and descriptions extracted from the candidate. It is noindex and is excluded from the sitemap. Google may choose different titles, snippets or sitelinks. Metadata alone does not establish a ranking position.
