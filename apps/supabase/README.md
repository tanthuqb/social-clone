# `supabase` app (Next.js 16)

This is the main Suzu Social app. It uses the App Router, React 19, Supabase (Auth, Postgres, Storage, Realtime), Tailwind CSS 4 and TipTap 3.

## Develop

```bash
cp .env.example .env.local     # fill in the Supabase URL + anon key
pnpm dev                       # http://localhost:3000 (next dev --webpack)
```

`--webpack` is intentional: Turbopack does not transpile the workspace package `@suzu/ui` the way this app needs.

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` / `pnpm build` / `pnpm start` | Next.js dev / production build / serve |
| `pnpm lint` | `eslint .` (flat config from `@suzu/eslint-config/next`) |
| `pnpm check-types` | `next typegen && tsc --noEmit` |
| `pnpm test:e2e` | Playwright E2E suite (app on port 3104) |
| `pnpm test:e2e:ui` | Playwright UI mode |
| `pnpm test:e2e:install` | Download Chromium for Playwright |

## Layout

```
src/
  proxy.ts                  # Next 16 "proxy" (formerly middleware): refreshes the Supabase session
                            # with getClaims(); guards /settings/** and /notifications
  app/                      # routes: (app)/(outside) public pages, (app)/(inside) settings
    api/auth/*callback      # PKCE code exchange for OAuth / email confirmation / password reset
  components/               # feature components (feeds, comments, modals, settings, ...)
  lib/
    actions/*               # server actions (all writes run as the signed-in user, under RLS)
    api/*                   # server-side queries
    supabase/               # browser client, server client (async cookies()), proxy client
    sanitize.ts             # HTML sanitizer for post content (sanitize-html)
    storage.ts              # Storage paths (<user_id>/<file>) and public URLs
  hooks/useRealtimeTable.ts # one Realtime channel per subscription
e2e/                        # Playwright specs
```

## Conventions

- Server data access goes through `await createClient()` from `@/lib/supabase/server`. Never use a service-role key: RLS enforces ownership.
- `cookies()`, `headers()`, `params` and `searchParams` are async (Next 15+).
- Post/comment HTML must go through `sanitizeContent()`. Server actions do this on write, and `ContentCard` does it again on render.
- Uploads go to `<user_id>/...` via `uploadUserFile()`, which the Storage policies require.
- UI text is English.

## End-to-end tests

```bash
pnpm test:e2e:install
E2E_USER_EMAIL=... E2E_USER_PASSWORD=... pnpm test:e2e
```

- Playwright starts `next dev --webpack --port 3104` itself, or reuses a server already listening on 3104. The base URL is `http://localhost:3104`; you can override it with `PLAYWRIGHT_PORT` or `PLAYWRIGHT_BASE_URL`.
- Without `E2E_USER_EMAIL` and `E2E_USER_PASSWORD`, the authenticated specs are skipped with an explanatory message.
- Use a dedicated, **confirmed** test account.
- Public profile and post specs look up real URLs from the home feed. They skip when the feed is empty.
- Specs that create data delete it or toggle it back afterwards.
