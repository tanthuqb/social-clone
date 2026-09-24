# `@suzu/eslint-config`

Shared ESLint **flat configs** (ESLint 10, `typescript-eslint` 8) for the monorepo.

| Export | Use for |
| --- | --- |
| `@suzu/eslint-config/next` | Next.js apps (`eslint-config-next` core-web-vitals + TypeScript, Turbo, Prettier) |
| `@suzu/eslint-config/react-internal` | Internal React libraries such as `@suzu/ui` |
| `@suzu/eslint-config/base` | Plain TypeScript packages |

Usage in a package's `eslint.config.mjs`:

```js
import next from "@suzu/eslint-config/next";

export default [...next];
```

Run `pnpm lint` from the repo root (Turborepo runs `eslint .` in every package).

Some legacy-friendly rules are relaxed (`no-explicit-any`, React Compiler diagnostics from
`eslint-plugin-react-hooks` v7). Tighten them as the codebase is cleaned up.
