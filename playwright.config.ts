import { defineConfig, devices, type ReporterDescription } from "@playwright/test";
import { AUTH_STATE_PATH } from "./src/config/constants";
import { env } from "./src/config/env";

const isCI = !!process.env.CI;

const reporters: ReporterDescription[] = [
  ["html", { open: isCI ? "never" : "on-failure" }],
  ["list"],
];
if (isCI) {
  reporters.push(["junit", { outputFile: "test-results/junit.xml" }]);
}

// Shared by every browser project: UI specs only, starting from the session saved by `setup`.
const uiProject = {
  testDir: "./tests/ui",
  dependencies: ["setup"],
};

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  reporter: reporters,

  timeout: env.timeoutMs * 2,
  expect: { timeout: env.timeoutMs },

  use: {
    baseURL: env.baseUrl,
    testIdAttribute: "data-test",
    actionTimeout: env.timeoutMs,
    navigationTimeout: env.timeoutMs,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    // Logs in once and saves the session to AUTH_STATE_PATH.
    {
      name: "setup",
      testDir: "./tests/setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "chromium",
      ...uiProject,
      use: { ...devices["Desktop Chrome"], storageState: AUTH_STATE_PATH },
    },
    // {
    //   name: "firefox",
    //   ...uiProject,
    //   use: { ...devices["Desktop Firefox"], storageState: AUTH_STATE_PATH },
    // },
    // {
    //   name: "webkit",
    //   ...uiProject,
    //   use: { ...devices["Desktop Safari"], storageState: AUTH_STATE_PATH },
    // },
    // // Mobile viewport example: copy this block to add more devices.
    // {
    //   name: "mobile-chrome",
    //   ...uiProject,
    //   use: { ...devices["Pixel 5"], storageState: AUTH_STATE_PATH },
    // },
    // API specs need no browser or login, so they run once here instead of once per browser.
    {
      name: "api",
      testDir: "./tests/api",
    },
  ],
});
