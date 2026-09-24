// Flat config for Next.js apps: eslint-config-next (core web vitals + TS) plus shared rules.
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import turbo from "eslint-config-turbo/flat";
import { ignores, relaxedTypeScriptRules } from "./base.js";

export default [
  ignores,
  ...nextVitals,
  ...nextTs,
  ...turbo,
  {
    // eslint-plugin-react's "detect" uses an API removed in ESLint 10.
    settings: { react: { version: "19.3" } },
    rules: {
      ...relaxedTypeScriptRules,
      // The codebase renders user avatars/uploads from Supabase Storage URLs.
      "@next/next/no-img-element": "off",
      "react-hooks/exhaustive-deps": "off",
      // React Compiler diagnostics (eslint-plugin-react-hooks v7) are advisory
      // until the app adopts the compiler.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/static-components": "off",
      "react-hooks/use-memo": "off",
      "react-hooks/incompatible-library": "off",
      "react-hooks/error-boundaries": "off",
      "react-hooks/globals": "off",
      "react-hooks/unsupported-syntax": "off",
      "react-hooks/config": "off",
      "react-hooks/gating": "off",
      "react/display-name": "off",
      "react/no-unescaped-entities": "off",
      "turbo/no-undeclared-env-vars": "off",
    },
  },
  prettier,
];
