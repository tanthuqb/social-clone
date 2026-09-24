// Root config: workspace packages have their own eslint.config.mjs.
import base from "@suzu/eslint-config/base";

export default [{ ignores: ["apps/**", "packages/**", "tooling/**"] }, ...base];
