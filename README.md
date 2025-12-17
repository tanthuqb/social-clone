# Suzu Social Clone

A modern social networking application built with Next.js, Supabase, and Turborepo. This project is designed as a monorepo to manage the main application, shared packages, and transactional emails efficiently.

## 🏗 Project Structure

This project uses [Turborepo](https://turbo.build/repo) to manage the workspace.

### Apps

- **[apps/supabase](apps/supabase)**: The main Next.js 14 application. It handles the frontend UI, authentication, and backend logic integrations with Supabase.
  - **Tech Stack**: Next.js, Tailwind CSS, TypeScript, Supabase Auth/Database, Drizzle ORM.

### Packages

- **[packages/ui](packages/ui)**: A shared UI component library used across the application.
- **[packages/transactional](packages/transactional)**: Transactional email templates built with [React Email](https://react.email/).
- **[tooling](tooling)**: Configuration for ESLint, TypeScript, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >= 20.0.0
- **Package Manager**: pnpm (version 10.x recommended)
- **Supabase CLI**: For local database development.
- **Docker**: Required for running the local Supabase instance.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/SuZuGroup/suzu.net.turborepo.git
    cd suzu.net.turborepo
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

### Environment Setup

1.  **Supabase Setup:**

    Make sure you have the Supabase CLI installed and Docker running.

    ```bash
    # Login to Supabase (if needed)
    npx supabase login

    # Initialize Supabase (if not already initialized)
    # npx supabase init

    # Start the local Supabase instance
    npx supabase start
    ```

    *Note: After starting, `supabase start` will output your API URL and keys. You'll need these for your environment variables.*

2.  **Environment Variables:**

    Copy the example environment file in `apps/supabase`:

    ```bash
    cd apps/supabase
    cp .env.example .env
    ```

    Update `.env` with your local Supabase credentials (API URL, Anon Key) obtained from the `supabase start` command.

### Running the Application

To start the development server for all apps and packages:

```bash
pnpm run dev
```

- **Main App**: [http://localhost:3000](http://localhost:3000)
- **Supabase Studio**: [http://localhost:54323](http://localhost:54323)

## 🛠 Commands

- `pnpm run build`: Build all apps and packages.
- `pnpm run dev`: Start the development server.
- `pnpm run lint`: Lint all code.
- `pnpm run format`: Format code with Prettier.

## 📦 Database & ORM

The project uses Drizzle ORM for database interactions.

- **Schema**: Located in `apps/supabase/src/lib/supabase/schema.ts` (or similar path).
- **Migrations**: Managed via Drizzle Kit.

## ✉️ Emails

Transactional emails are located in `packages/transactional`. To preview emails:

```bash
cd packages/transactional
pnpm run dev
```
