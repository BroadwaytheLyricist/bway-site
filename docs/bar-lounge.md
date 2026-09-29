# Bar Lounge soft launch

`/bar-lounge` holds the active round. The blog index and participating article link to it. Responses are private emails via Resend; an answer is never an email subscription. The email form separately adds a consenting address to a Kit form, which can handle the welcome/confirmation flow and broadcasts.

## Connect delivery before inviting visitors

1. Keep the existing verified Resend sender and `RESEND_API_KEY`. Set `BAR_LOUNGE_TO_EMAIL` to the inbox for answers, or reuse `CONTACT_TO_EMAIL`. A test sender only delivers to the Resend account owner's address.
2. Create a Kit form called `The Second Listen`, configure its confirmation/welcome email and unsubscribe settings, then set `KIT_API_KEY` and the numeric `KIT_FORM_ID` in Vercel's encrypted environment settings. Verify the sending domain in Kit before the first broadcast. No key belongs in browser-side code.
3. Submit one answer and one consented signup on the preview deployment; confirm the answer reaches the inbox and the signup appears under the correct Kit form. Without those settings, the forms display an honest connection error.

## Publish a new round

Update `src/lib/bar-lounge.ts` with the new article slug, question, and round ID. The current article module is added automatically. When the answer is ready, publish a follow-up in the article and email the reveal through Kit; don't feature a participant's name without permission. No audio sample is bundled with the first round. Future audio clues require a cleared recording or an authorized player; avoid adding a short unlicensed clip directly to `public/`.
