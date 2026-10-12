import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Last, so Prettier owns formatting and ESLint only flags real problems.
  prettier,
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Build output and generated files:
    ".open-next/**",
    ".wrangler/**",
    "cloudflare-env.d.ts",
    "docs/**",
  ]),
]);

export default eslintConfig;
