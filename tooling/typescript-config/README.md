# `@suzu/typescript-config`

Shared `tsconfig` bases for TypeScript **6.0**:

| File | Use for |
| --- | --- |
| `base.json` | Strict defaults: `module: ESNext`, `moduleResolution: Bundler`, `target: ES2022`, `noEmit` |
| `nextjs.json` | Next.js apps (adds the `next` plugin, `jsx: preserve`) |
| `react-library.json` | React packages (`jsx: react-jsx`) |

TypeScript 7 (the native compiler) is not adopted yet. `typescript-eslint` supports `<6.1`, and TypeScript 7 does not ship the JavaScript compiler API that Next.js type-checking uses.
