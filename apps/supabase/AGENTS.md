<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project rules (apps/supabase)

- **Stack:** Next.js 16.3 (App Router, `src/proxy.ts`, webpack builder), React 19.3, `@supabase/ssr` 0.12 + `@supabase/supabase-js` 2.117, Tailwind CSS 4 (JS config via `@config` in `src/app/globals.css`), TipTap 3, TypeScript 6, ESLint 10 flat config.
- **Supabase:**
  - Use `await createClient()` from `@/lib/supabase/server` in server code, and `createClient()` from `@/lib/supabase/client` in the browser.
  - Never use a service-role key.
  - RLS is on for every table, so writes must run as the acting user.
  - Do not run `supabase db push`, apply migrations or run SQL against the remote project unless the user asks. Add new migrations to `../../supabase/migrations`.
- **Async request APIs:** `cookies()`, `headers()`, `params`, `searchParams` must be awaited.
- **Content safety:**
  - Post/comment HTML goes through `sanitizeContent()` (`src/lib/sanitize.ts`).
  - Uploads use `uploadUserFile()` (`src/lib/storage.ts`, path `<user_id>/...`).
- **UI language:** English only. Keep strings short and in sentence case.
- **Verification before claiming done:** `pnpm lint`, `pnpm check-types`, `pnpm build` (repo root) and `pnpm test:e2e` (app on port 3104; set `E2E_USER_EMAIL` / `E2E_USER_PASSWORD` for the authenticated specs).
- **Git:** do not commit or push unless asked.
