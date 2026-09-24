// Flat config for internal React libraries (bundled by their consumer), e.g. @suzu/ui.
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import { baseConfig, relaxedTypeScriptRules } from "./base.js";

export default [
  ...baseConfig,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { react, "react-hooks": reactHooks },
    languageOptions: {
      globals: { ...globals.browser, React: "readonly", JSX: "readonly" },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    // "detect" uses an API removed in ESLint 10; pin the major.minor instead.
    settings: { react: { version: "19.3" } },
    rules: {
      ...relaxedTypeScriptRules,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "off",
      "react/jsx-key": "error",
    },
  },
];
