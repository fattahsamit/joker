// @ts-check
import js from "@eslint/js";
import playwright from "eslint-plugin-playwright";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "node_modules/",
      "playwright-report/",
      "test-results/",
      "playwright/",
      "blob-report/",
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    // Type-aware rules: a missing `await` on a Playwright call is the most common cause of flaky tests.
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["tests/**/*.ts"],
    ...playwright.configs["flat/recommended"],
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      "playwright/no-wait-for-timeout": "error",
      "playwright/no-skipped-test": "warn",
      "playwright/no-conditional-in-test": "error",
      "playwright/no-useless-await": "error",
      "playwright/prefer-web-first-assertions": "error",
    },
  },
);
