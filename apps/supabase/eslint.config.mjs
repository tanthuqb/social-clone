import next from "@suzu/eslint-config/next";

export default [
  ...next,
  {
    ignores: ["playwright-report/**", "test-results/**", "src/lib/supabase/database.types.ts"],
  },
];
