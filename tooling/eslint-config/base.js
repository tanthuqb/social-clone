// Shared flat-config building blocks for every workspace package.
import js from "@eslint/js";
import prettier from "eslint-config-prettier/flat";
import turbo from "eslint-config-turbo/flat";
import globals from "globals";
import tseslint from "typescript-eslint";

/** Rules relaxed for this legacy codebase (kept visible, not blocking). */
export const relaxedTypeScriptRules = {
  "@typescript-eslint/no-explicit-any": "off",
  "@typescript-eslint/ban-ts-comment": "off",
  "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
  "@typescript-eslint/no-empty-object-type": "off",
  "@typescript-eslint/no-unused-vars": [
    "warn",
    { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none" },
  ],
  "no-unused-vars": "off",
  "no-undef": "off", // TypeScript handles this (ambient global types are used).
};

export const ignores = {
  ignores: [
    "**/node_modules/**",
    "**/.next/**",
    "**/dist/**",
    "**/out/**",
    "**/build/**",
    "**/.turbo/**",
    "**/playwright-report/**",
    "**/test-results/**",
    "**/next-env.d.ts",
  ],
};

/** Base config for TypeScript libraries (no React). */
export const baseConfig = [
  ignores,
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...turbo,
  {
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: relaxedTypeScriptRules,
  },
  prettier,
];

export default baseConfig;
