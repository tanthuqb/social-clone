# Next.js Latest + Server Actions + Realtime Refactor — Implementation Plan

> **Status (2026-09-24):**
> - Tasks 1–7 are **done**. They were committed on `refactor/nextjs-latest`: 1403910, 897717b, 83690c1, 0aa30dc, 959b4d9, b60749e, 8cf26fe, followed by fix commits b4fe301, ff222e8, b7a05b5 and 6dd48f3.
> - Task 8 was continued on branch `chore/upgrade-2026-09` (uncommitted):
>   - Step 1 (build/type-check/lint) passes.
>   - Step 2's smoke list is partly automated by the Playwright suite in `apps/supabase/e2e`: guest flows run live; authenticated flows need `E2E_USER_EMAIL` / `E2E_USER_PASSWORD`.
>   - Steps 3–4 (push, Vercel preview, production deploy) are **not done**. They are out of scope, and no deploy is allowed from the agent.
> - The 2026-09 upgrade also moved to Tailwind 4, TipTap 3, TypeScript 6 and ESLint 10. The "out of scope" note below is historical.
> - Also added: migration `20260924120000_rls_hardening_storage_and_integrity.sql`, which is not applied yet.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `apps/supabase` from Next.js 14 (pages of App Router with mixed client-side data access) to the latest Next.js, move all Supabase mutations behind server actions, and consolidate realtime updates (reaction/save/notification buttons) into shared realtime hooks.

**Architecture:** Three phases that each leave the app deployable: (1) framework upgrade via official codemods with async request APIs; (2) data-access refactor — every client-side `.insert/.update/.delete/.upsert` moves into `src/lib/actions/*` server actions that call the cookie-scoped Supabase server client and `revalidatePath`; (3) realtime consolidation — one `RealtimeProvider` + `useRealtimeTable` hook replaces the 5+ ad-hoc `supabase.channel(...)` blocks so buttons (like/dislike/save/follow/notification badge) update live for all viewers.

**Tech Stack:** Next.js latest (16.x line), React 19, TypeScript 5.x, @supabase/supabase-js 2.x, @supabase/ssr (latest), Supabase Realtime `postgres_changes`, Turborepo + pnpm.

## Global Constraints

- Monorepo root: `e:\UpWork\Project\social-facebook-clone`; app lives in `apps/supabase`.
- Package manager: pnpm 10 (`pnpm --filter supabase ...` for app-scoped installs).
- Supabase project ref: `hquzkxrchkajevzzbver`; env var names stay `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (URL keeps its trailing slash — storage URLs are built by string concatenation).
- RLS is now ON for all `public` tables. Writes MUST run as the acting user (cookie client), NEVER with the service key. Ownership columns: `user_id` everywhere except `notifications` (recipient = `user_noti_id`) and `profiles` (owner = `id`).
- `database.types.ts` is generated + a hand-written enum section at the bottom (`FeedPrivacy`, `ReactionState`, `UserPrivacy`, `FeedStatus`, `FeedType`) that must survive regeneration.
- The repo has no test suite. Verification gate for every task = `pnpm build` (root) + `npx tsc --noEmit` (in `apps/supabase`) + the manual smoke checklist in Task 8. Do not claim a task done without running both commands.
- Out of scope (do NOT do in this plan): Tailwind 4, Zod 4, Drizzle removal, typesense upgrade, UI redesign.
- Commit after every task with the message given in the task.

---

### Task 1: Upgrade Next.js/React with official codemods

**Files:**
- Modify: `apps/supabase/package.json` (next, react, react-dom, eslint-config-next, @next/eslint-plugin-next, @types/react, @types/react-dom)
- Modify: `apps/supabase/next.config.mjs` (whatever the codemod rewrites)
- Modify: `packages/ui/package.json` (react peer deps to `^19`)

**Interfaces:**
- Produces: a compiling app on Next latest; all later tasks assume `cookies()`/`headers()`/`params` are async.

- [x] **Step 1: Run the upgrade codemod** (it bumps deps and applies breaking-change codemods, including async request APIs):

```bash
cd apps/supabase
npx @next/codemod@canary upgrade latest
```

If prompted for individual codemods, accept `next-async-request-api` and all recommended ones.

- [x] **Step 2: Upgrade React across the workspace**

```bash
pnpm --filter supabase add react@latest react-dom@latest
pnpm --filter supabase add -D @types/react@latest @types/react-dom@latest
pnpm --filter @suzu/ui add -D react@latest react-dom@latest @types/react@latest
```

- [x] **Step 3: Make the Supabase server client async** — `apps/supabase/src/lib/supabase/server.ts` becomes:

```ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component; middleware refreshes sessions.
          }
        },
      },
    },
  );
}
```

Then update EVERY caller: `const supabase = createClient()` → `const supabase = await createClient()`. Find them with:

```bash
grep -rn "createClient()" src --include="*.ts*" | grep -v "supabase/client"
```

(`src/lib/supabase/client.ts` — the browser client — stays synchronous.)

- [x] **Step 4: Fix async `params`/`searchParams`** in every page/route that reads them (e.g. `src/app/(app)/(outside)/(feed)/p/[feedId]/page.tsx`, `u/[username]/page.tsx`, all `src/app/api/**/route.ts`). Pattern:

```ts
// before
const FeedDetailPage = async ({ params }: { params: { feedId: string } }) => {
  const feedId = params.feedId;
// after
const FeedDetailPage = async ({ params }: { params: Promise<{ feedId: string }> }) => {
  const { feedId } = await params;
```

The codemod handles most of these; verify none remain:

```bash
npx tsc --noEmit
```

- [x] **Step 5: Middleware** — if the installed Next major renamed `middleware.ts` to `proxy.ts`, follow the codemod's output; otherwise keep `src/middleware.ts` as is. Confirm the session-refresh flow still compiles (it calls `createClient(request)` from `src/lib/supabase/middleware.ts`, which is request-scoped and stays synchronous).

- [x] **Step 6: Fix remaining compile errors, then verify**

```bash
npx tsc --noEmit        # in apps/supabase — expect 0 errors
cd ../.. && pnpm build  # expect Tasks: 1 successful
```

Known likely breakages and their fixes:
- `@tiptap/*`: if peer-dep errors against React 19, `pnpm --filter supabase add @tiptap/react@latest @tiptap/starter-kit@latest` plus each `@tiptap/extension-*@latest` already in package.json (v3 line supports React 19; the extension API for the used extensions — Document, Paragraph, Text, Heading, Link, Image, Mention, Placeholder, Youtube, CharacterCount, HardBreak, Dropcursor — is source-compatible for basic configure() usage).
- `styled-components`/`swagger-ui-react`: if they block the build under React 19, dynamic-import them with `next/dynamic` and `ssr: false` in the pages that use them.

- [x] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: upgrade to latest Next.js + React 19 (async request APIs)"
```

### Task 2: Remove the dead NextAuth stack

**Files:**
- Delete: `apps/supabase/src/lib/supabase/authdb.ts`, `apps/supabase/src/lib/env.mjs`
- Modify: `apps/supabase/src/components/modals/auth/register-form.tsx`, `apps/supabase/src/components/settings/support.tsx` (drop `next-auth` imports)
- Modify: `apps/supabase/package.json` (remove `next-auth`, `@auth/core`, `@auth/drizzle-adapter`, `nodemailer`, `bcrypt`, `@types/bcrypt` IF unused after the sweep)

**Interfaces:**
- Produces: Supabase Auth is the only auth path (`supabase.auth.*` + `src/app/api/auth/*` routes).

- [x] **Step 1: Audit** — for each candidate package run `grep -rn "<pkg>" src --include="*.ts*"`; only remove packages with zero source hits after fixing the two components. The two known usages import types/`signIn` from `next-auth` — replace with the Supabase equivalents already used elsewhere in the same files (`supabase.auth.signInWithOAuth` / `Session` from `@supabase/supabase-js`).
- [x] **Step 2: Remove deps** — `pnpm --filter supabase remove next-auth @auth/core @auth/drizzle-adapter ...` (only the ones that audited clean).
- [x] **Step 3: Verify** — `npx tsc --noEmit` and `pnpm build` pass; sign-in / sign-out / OAuth callback routes under `src/app/api/auth/` compile untouched.
- [x] **Step 4: Commit** — `git commit -m "refactor: remove unused next-auth stack, Supabase Auth only"`.

### Task 3: Fix the four known column-name bugs (pre-refactor correctness)

**Files:**
- Modify: `apps/supabase/src/lib/api/commentEngagements/queries.ts` (two `.eq("parent_id" ...)` → `.eq("comment_id", ...)`)
- Modify: `apps/supabase/src/lib/api/comments/queries.ts` (`.eq("userId" as any, ...)` → `.eq("user_id", ...)`)
- Modify: `apps/supabase/src/lib/api/comments/mutations.ts` (`.update({ comment } as any)` → `.update({ content: <the html string> })` — the variable holds the edited comment body; `comments` has no `comment` column)
- Modify: `apps/supabase/src/components/modals/comments/comment-create-form.tsx` (`.eq("id", editing as any)` — `editing` is a boolean; pass the actual `commentId` being edited)

**Interfaces:**
- Produces: comment editing and comment-reaction lookups hit real columns; Task 4's actions copy the corrected calls.

- [x] **Step 1:** Apply the four fixes above, removing the `as any` casts they hid behind.
- [x] **Step 2:** `npx tsc --noEmit` — 0 errors (the casts are gone, so the types now check the column names).
- [x] **Step 3:** Manual smoke (dev server): edit a comment → content persists; react to a comment → reaction saved (check `comment_engagement` rows in Studio).
- [x] **Step 4: Commit** — `git commit -m "fix: correct comment/engagement column names"`.

### Task 4: Server actions for feeds + comments (write path)

**Files:**
- Modify: `apps/supabase/src/lib/actions/feed/actions.ts`, `src/lib/actions/commentEngagements/actions.ts` (extend — they already start with `"use server"`)
- Create: `apps/supabase/src/lib/actions/comments/actions.ts`
- Modify (consumers): `src/components/modals/feeds/components/content-form-feed.tsx`, `src/components/modals/feeds/feed-delete-form.tsx`, `src/components/modals/comments/comment-create-form.tsx`, `src/components/feeds/components/feed-pin.tsx`, `feed-unpin.tsx`

**Interfaces:**
- Consumes: `createClient` from Task 1 (async).
- Produces (exact signatures; every action returns `{ data: T | null; error: string | null }`):
  - `createCommentAction(input: { feed_id: string; content: string; parent_id?: string | null }): Promise<{ data: Comment | null; error: string | null }>`
  - `updateCommentAction(id: string, content: string): Promise<{ data: Comment | null; error: string | null }>`
  - `deleteCommentAction(id: string): Promise<{ data: null; error: string | null }>`
  - `togglePinAction(feedId: string, pin: boolean): Promise<{ data: null; error: string | null }>`

- [x] **Step 1: Write `comments/actions.ts`** following this template (identical error-shape for all):

```ts
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createCommentAction(input: {
  feed_id: string;
  content: string;
  parent_id?: string | null;
}) {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getUser();
  if (!session?.user) return { data: null, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("comments")
    .insert({ ...input, user_id: session.user.id })
    .select()
    .single();
  if (error) return { data: null, error: error.message };

  revalidatePath(`/p/${input.feed_id}`);
  return { data, error: null };
}
```

`updateCommentAction`/`deleteCommentAction`/`togglePinAction` follow the same shape (`.update({ content }).eq("id", id)`, `.delete().eq("id", id)`, `.update({ pin }).eq("id", feedId)` + `revalidatePath("/")`). RLS enforces ownership — do not add manual ownership checks beyond the auth guard.

- [x] **Step 2: Swap consumers** — in the five components listed above, replace direct `supabase.from(...).insert/update/delete` calls with the actions (components keep their optimistic `useState` updates; realtime in Task 6 reconciles other viewers). File uploads (`supabase.storage.from("suzu").upload`) STAY client-side — storage uploads from the browser are fine and avoid streaming files through actions.
- [x] **Step 3:** `npx tsc --noEmit` + `pnpm build` pass.
- [x] **Step 4:** Manual smoke: create feed with image, comment, edit comment, pin/unpin, delete feed.
- [x] **Step 5: Commit** — `git commit -m "refactor: feeds/comments writes via server actions"`.

### Task 5: Server actions for engagement, collections, follows, profile

**Files:**
- Modify: `src/lib/actions/feedEngagements/actions.ts`, `src/lib/actions/feedCollections/actions.ts`, `src/lib/actions/commentEngagements/actions.ts`, `src/lib/actions/user/actions.ts`
- Modify (consumers): `src/components/feeds/components/interactive-widget.tsx`, `feed-save.tsx`, `feed-unsave.tsx`, `src/components/master-layout/card-feed/footer-card.tsx`, `src/components/user/components/follow-button.tsx` (locate with `grep -rln 'from("user_follows")' src/components`), `src/components/settings/profile.tsx`, `src/components/modals/updateInformation/content-step-form.tsx`

**Interfaces:**
- Consumes: action template from Task 4.
- Produces:
  - `upsertFeedReactionAction(feedId: string, state: "like" | "dislike" | "neutral"): Promise<{ data: null; error: string | null }>` (uses `.upsert({ feed_id, user_id, state }, { onConflict: "user_id,feed_id" })` — the `unique_feed_engagement` index backs this)
  - `saveFeedAction(feedId: string)` / `unsaveFeedAction(feedId: string)`
  - `upsertCommentReactionAction(commentId: string, state: "like" | "dislike" | "neutral")`
  - `followAction(followingId: string)` / `unfollowAction(followingId: string)`
  - `updateProfileAction(input: Partial<Pick<Profile, "display_name" | "full_name" | "description" | "gender" | "avatar_url" | "birthday" | "website">>)`

- [x] **Step 1:** Implement the actions with the Task 4 template (auth guard → single supabase call → `revalidatePath` of the affected route: `/` for reactions/saves, `/u/[username]` for follows/profile).
- [x] **Step 2:** Swap the consumers; avatar upload to `avatars` bucket stays client-side, only the `profiles` row update moves into `updateProfileAction`.
- [x] **Step 3:** `npx tsc --noEmit` + `pnpm build`.
- [x] **Step 4:** Manual smoke: like/dislike a feed and a comment, save/unsave, follow/unfollow, edit profile with new avatar.
- [x] **Step 5: Commit** — `git commit -m "refactor: engagement/collections/follows/profile via server actions"`.

### Task 6: Realtime provider + live buttons

**Files:**
- Create: `apps/supabase/src/hooks/useRealtimeTable.ts`
- Modify: `src/components/feeds/components/interactive-widget.tsx`, `src/components/master-layout/card-feed/footer-card.tsx`, `src/components/comments/comment-form.tsx`, `src/components/feeds/feed-list.tsx`, `src/components/shared/navbar/nav-item.tsx`, `src/components/shared/footer/main-footer.tsx` (replace inline `supabase.channel(...)` blocks)

**Interfaces:**
- Produces:

```ts
useRealtimeTable(opts: {
  table: "feeds" | "comments" | "feed_engagement" | "comment_engagement" | "notifications" | "feed_collections";
  filter?: string;             // e.g. `feed_id=eq.${feedId}`
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  onChange: (payload: RealtimePostgresChangesPayload<Record<string, any>>) => void;
}): void
```

- [x] **Step 1: Write the hook** (single channel per subscription, cleaned up on unmount):

```ts
"use client";

import { useEffect } from "react";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export function useRealtimeTable({
  table,
  filter,
  event = "*",
  onChange,
}: {
  table: string;
  filter?: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  onChange: (payload: RealtimePostgresChangesPayload<Record<string, any>>) => void;
}) {
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`rt_${table}_${filter ?? "all"}`)
      .on(
        "postgres_changes",
        { event: event as any, schema: "public", table, ...(filter ? { filter } : {}) },
        onChange,
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, filter, event]);
}
```

- [x] **Step 2: Enable replication** — realtime events only flow for tables in the `supabase_realtime` publication. New migration (`supabase migration new enable_realtime_publication`):

```sql
alter publication supabase_realtime add table
  public.feeds,
  public.comments,
  public.feed_engagement,
  public.comment_engagement,
  public.feed_collections,
  public.notifications;
```

`supabase db push --linked --yes`. (RLS applies to realtime: anon/authed receive rows their SELECT policies allow — notifications only reach their recipient, which is exactly right for the badge.)

- [x] **Step 3: Swap the six components** to `useRealtimeTable`, e.g. in `interactive-widget.tsx`:

```ts
useRealtimeTable({
  table: "feed_engagement",
  filter: `feed_id=eq.${feed?.id}`,
  onChange: () => refreshCounts(),   // the component's existing count-reload fn
});
```

and delete the hand-rolled `supabase.channel(...)/removeChannel` blocks they replace. Notification badge (`nav-item.tsx`, `main-footer.tsx`) subscribes with `table: "notifications", filter: `user_noti_id=eq.${userId}``.

- [x] **Step 4:** `npx tsc --noEmit` + `pnpm build`.
- [x] **Step 5:** Manual smoke with two browsers (one logged-in, one anon): like a feed in A → count updates in B without reload; comment in A → appears in B; B's owner receives notification badge live.
- [x] **Step 6: Commit** — `git commit -m "feat: shared realtime hook, live engagement buttons and notification badge"`.

### Task 7: Delete the dead client-side data layer

**Files:**
- Review/trim: `src/lib/api/**` (queries used by server components STAY; mutation files whose logic moved into actions get deleted), `src/hooks/useInfiniteScroll.ts` (keep — read path), `src/modules/notifications/notifications.provider.ts`

**Interfaces:**
- Consumes: everything green from Tasks 4–6.

- [x] **Step 1:** For each file in `src/lib/api/*/mutations.ts`: `grep -rn "<exported fn>" src` — delete functions with zero remaining imports; delete the file when empty.
- [x] **Step 2:** `npx tsc --noEmit` + `pnpm build`.
- [x] **Step 3: Commit** — `git commit -m "chore: remove superseded client-side mutation layer"`.

### Task 8: Final verification + deploy

- [x] **Step 1:** Full local pass: `pnpm build`, `npx tsc --noEmit`, `pnpm lint` (lint may carry pre-existing warnings; no NEW errors).
- [ ] **Step 2:** Manual smoke checklist (dev server, two browsers):
  - register/login (email + Google OAuth), logout
  - create feed (text, image upload, youtube link), edit, pin, delete
  - comment, nested reply, edit comment, react to comment
  - like/dislike feed — live in second browser
  - save/unsave to collection; collection page lists it
  - follow/unfollow; follow notification arrives live
  - profile edit + avatar upload
  - search users/feeds; feed detail page as anonymous visitor
- [ ] **Step 3:** Push branch, verify the Vercel preview deployment builds and the smoke list passes on the preview URL.
- [ ] **Step 4:** Merge to `main` → production deploy; re-run the smoke list on production.

## Self-Review Notes

- Spec coverage: latest Next.js (Task 1), server actions everywhere writes happen (Tasks 4–5), realtime buttons incl. notifications (Task 6), correctness fixes the refactor would otherwise copy (Task 3), auth stack simplification the upgrade forces a decision on (Task 2), cleanup + E2E gate (Tasks 7–8). ✔
- No test suite exists; every task's gate is build + typecheck + an explicit manual smoke list. ✔
- Type consistency: all actions share `{ data, error }` return shape; hook name `useRealtimeTable` used consistently. ✔
