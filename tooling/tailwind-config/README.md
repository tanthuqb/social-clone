# `@suzu/tailwind-config`

Shared Tailwind CSS preset (`tailwind.config.ts`). It includes animations and keyframes, the `brown` palette, the `xs` screen, and the `@tailwindcss/forms`, `@tailwindcss/typography` and `tailwindcss-radix` plugins.

Tailwind CSS **4.3**. The preset is still a JavaScript config. It is used as a `presets` entry by `packages/ui/tailwind.config.ts`, which the app extends, and the app loads its config from CSS:

```css
/* apps/supabase/src/app/globals.css */
@import "tailwindcss";
@config "../../tailwind.config.ts";
@source "../../../../packages/ui/src";
```

PostCSS uses `@tailwindcss/postcss` (`apps/supabase/postcss.config.mjs`). `autoprefixer` is no longer needed.
