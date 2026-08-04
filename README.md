# Suzu Social Clone

A modern social networking application built with Next.js 14, Supabase, and Turborepo. This project is designed as a monorepo to manage the main application, shared packages, and transactional emails efficiently.

## ✨ Features

- **Feeds**: Create, edit, delete and pin posts with rich text (TipTap editor), images, video and link previews.
- **Comments**: Nested comments with reactions.
- **Reactions**: Like / dislike engagement on both feeds and comments.
- **Collections**: Save (bookmark) feeds to a personal collection.
- **Follows**: Follow / unfollow users, personalized follow suggestions.
- **Notifications**: Realtime notifications on comments, reactions and new followers (Postgres triggers + Supabase Realtime).
- **Search**: Search profiles and feeds (Postgres full-text functions, Typesense-ready).
- **Profiles**: Public user pages, avatar upload (Supabase Storage), profile editing and privacy settings.
- **Auth**: Supabase Auth with email/password and OAuth (Google, Facebook) via `@supabase/ssr` cookie-based sessions.

## 🏗 Project Structure

This project uses [Turborepo](https://turbo.build/repo) to manage the workspace.

### Apps

- **[apps/supabase](apps/supabase)**: The main Next.js 14 application (App Router). It handles the frontend UI, authentication, and backend logic integrations with Supabase.
  - **Tech Stack**: Next.js 14, React 18, Tailwind CSS, TypeScript, Supabase (Auth / Database / Storage / Realtime), Drizzle ORM (schema typing), TipTap.

### Packages

- **[packages/ui](packages/ui)**: A shared UI component library (Radix UI based) used across the application.
- **[packages/transactional](packages/transactional)**: Transactional email templates built with [React Email](https://react.email/).
- **[tooling](tooling)**: Shared configuration for ESLint, TypeScript, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >= 20.0.0
- **Package Manager**: pnpm 10.x (`npm i -g pnpm`)
- **Supabase CLI**: >= 2.x — for database migrations and type generation.
- **Docker**: Only required if you want to run a local Supabase instance.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/tanthuqb/social-clone.git
    cd social-clone
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

### Environment Setup

1.  **Environment Variables:**

    Copy the example environment file in `apps/supabase` and fill in your Supabase project credentials:

    ```bash
    cd apps/supabase
    cp .env.example .env.local
    ```

    | Variable | Description |
    | --- | --- |
    | `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
    | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/publishable key (safe for the browser) |
    | `SERVICE_ROLE_KEY` | Supabase service role key — **server only, never expose to the client** |
    | `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
    | `FACEBOOK_CLIENT_ID` / `FACEBOOK_CLIENT_SECRET` | Facebook OAuth credentials |
    | `NEXT_PUBLIC_APP_NAME` / `NEXT_PUBLIC_APP_DOMAIN` | App branding |
    | `GA_MEASUREMENT_ID` | Google Analytics (optional) |

2.  **Local Supabase (optional):**

    ```bash
    npx supabase login
    npx supabase start   # requires Docker; prints local API URL + keys
    ```

### Running the Application

To start the development server for all apps and packages:

```bash
pnpm run dev
```

- **Main App**: [http://localhost:3000](http://localhost:3000)
- **Supabase Studio** (local only): [http://localhost:54323](http://localhost:54323)

## 🛠 Commands

- `pnpm run build`: Build all apps and packages.
- `pnpm run dev`: Start the development server.
- `pnpm run lint`: Lint all code.
- `pnpm run format`: Format code with Prettier.

## 📦 Database & Migrations

The database schema is managed with **Supabase CLI migrations** in [supabase/migrations](supabase/migrations).

```bash
# Link to your Supabase project (one time)
supabase link --project-ref <your-project-ref>

# Check which migrations are applied
supabase migration list --linked

# Apply pending migrations to the remote database
supabase db push --linked

# Regenerate TypeScript types after schema changes
supabase gen types typescript --linked > apps/supabase/src/lib/supabase/database.types.ts
```

> **Note:** `database.types.ts` ends with a hand-written section of app enums (`FeedPrivacy`, `ReactionState`, …). If you regenerate the file, keep/re-append that section.

### Schema overview

| Table | Purpose |
| --- | --- |
| `profiles` | User profiles (1-1 with `auth.users`) |
| `feeds` | Posts (supports nesting via `parent_id`, pinning, privacy & status enums) |
| `feed_images` / `feed_medias` | Post attachments |
| `feed_engagement` | Reactions on feeds |
| `comments` | Comments on feeds (nested via `parent_id`) |
| `comment_engagement` | Reactions on comments |
| `feed_collections` | Saved/bookmarked feeds |
| `user_follows` | Follow relationships |
| `notifications` | Notification records created by Postgres triggers |
| `report` | Content reports |

**Storage buckets**: `avatars` (profile pictures) and `suzu` (feed media) — both public.

> ⚠️ **Security note:** the original tables in `public` currently have **RLS disabled** (legacy schema). The newer tables (`feed_collections`, `comment_engagement`) ship with RLS policies. Enabling RLS with proper policies on the remaining tables is strongly recommended before production use.

Drizzle ORM is used for schema typing/validation helpers in `apps/supabase/src/lib/db/schema`; the source of truth for the database is the Supabase migrations folder.

## ▲ Deploying to Vercel

The app deploys as a standard Next.js monorepo project:

1. Import the GitHub repository into [Vercel](https://vercel.com/new).
2. Set **Root Directory** to `apps/supabase` (Vercel auto-detects Turborepo + pnpm).
3. Add the environment variables from the table above in Project Settings → Environment Variables.
4. Push to `main` — Vercel builds and deploys automatically.

Make sure the Supabase migrations have been pushed (`supabase db push --linked`) before the first deploy, and add your Vercel domain to the Supabase Auth **Redirect URLs** allow-list.

## ✉️ Emails

Transactional emails are located in `packages/transactional`. To preview emails:

```bash
cd packages/transactional
pnpm run dev
```
