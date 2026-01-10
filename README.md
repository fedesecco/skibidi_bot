# Gangyoo

Gangyoo is a Telegram group bot that generates replies via Google Gemini when it is
mentioned. The prompt and command catalog live inside this repo so they can be
versioned and updated alongside the code.

## How it works

- The bot responds only when mentioned and only if the chat ID is whitelisted.
- The system prompt lives in `src/ai/prompt.ts`.
- Command keywords and example replies live in `src/ai/commands.ts`.
- The AI returns JSON with `inferredCommand` and `responseText`, then the
  backend can alter the message before sending it.
- Cron jobs can call `generateCronReply` from `src/ai/index.ts` to get an
  `{ inferredCommand, responseText }` object from structured payloads.

## Setup

1. Copy `.env.example` to `.env`.
2. Set these required values:
   - `TELEGRAM_BOT_TOKEN`
   - `GEMINI_API_KEY`
   - `ALLOWED_CHAT_IDS` (comma-separated chat IDs, e.g. `-100123, -100456`)
3. Optional:
   - `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` (to resolve [random_user] using
     stored chat members)

## Usage

Mention the bot in a whitelisted group chat:

- `@Gangyoo can you register me?`
- `@Gangyoo nominate someone for today`

## Manual webhook toggle

Use this when you want to run local polling while Cloud Run is deployed.

1. Disable the webhook (enables polling):
```powershell
$token = "<BOT_TOKEN>"
Invoke-RestMethod -Method Post "https://api.telegram.org/bot$token/deleteWebhook"
```
2. Re-enable the webhook for Cloud Run:
```powershell
$token = "<BOT_TOKEN>"
$webhook = "https://<your-cloud-run-url>"
Invoke-RestMethod -Method Post "https://api.telegram.org/bot$token/setWebhook?url=$webhook"
```
3. Optional: check webhook status:
```powershell
$token = "<BOT_TOKEN>"
Invoke-RestMethod "https://api.telegram.org/bot$token/getWebhookInfo"
```

Note: if Cloud Run starts with `WEBHOOK_URL` set, it will re-register the webhook.
## Scripts

- `npm run dev` start the bot in watch mode
- `npm run build` compile TypeScript
- `npm run start` run the compiled bot

