# Playwright + TypeScript Test Automation

A small, production-ready starting point for UI and API test automation with Playwright and TypeScript. The sample target is [saucedemo.com](https://www.saucedemo.com) (UI) and [jsonplaceholder](https://jsonplaceholder.typicode.com) (API).

## Structure

```
├── .github/workflows/playwright.yml   CI: install, run tests, upload report and traces
├── src/
│   ├── pages/        Page Object Model classes (BasePage, LoginPage, InventoryPage, CartPage)
│   ├── components/   Reusable UI pieces (Header)
│   ├── fixtures/     index.ts exports the test and expect used by all specs
│   ├── api/          Typed API client
│   ├── data/         Typed test data (users, products, routes, messages, posts)
│   ├── config/       env.ts (validated .env loader), constants.ts
│   └── utils/        logger, random helpers
├── tests/
│   ├── setup/        auth.setup.ts: logs in once and saves the session
│   ├── ui/           UI specs
│   └── api/          API specs
├── playwright.config.ts
├── eslint.config.js, .prettierrc, tsconfig.json
└── CLAUDE.md         Guidance for AI coding sessions
```

## Setup

Requires Node.js 20 or newer.

```bash
# 1. Install dependencies
npm ci

# 2. Install browsers (Chromium, Firefox, WebKit)
npx playwright install

# 3. Create your local environment file and fill in the values
cp .env.example .env
```

`.env` variables:

| Variable                | Purpose                                                        |
| ----------------------- | -------------------------------------------------------------- |
| `ENV`                   | Environment label, e.g. `local`, `staging`, `prod`             |
| `BASE_URL`              | Web app under test                                             |
| `API_URL`               | API under test                                                 |
| `USERNAME` / `PASSWORD` | Valid user for the auth setup and the valid-login test         |
| `TIMEOUT_MS`            | Optional. Action and assertion timeout in ms (default `30000`) |

The config validates these at startup and fails with a message naming any variable that is missing or still set to a `<placeholder>` from the template. `.env` is git-ignored. Never commit real credentials.

> **Precedence:** values in `.env` win over variables already set in your shell. This is deliberate: Windows (and some shells) set `USERNAME` to your OS account name, which would otherwise replace the test user. To point a run at another environment, edit `.env`. CI has no `.env` and reads the workflow's variables.

For the demo site, use `standard_user` / `secret_sauce`, the public accounts listed on the saucedemo login page.

## Running tests

| Task                                | Command                                              |
| ----------------------------------- | ---------------------------------------------------- |
| All tests, all projects             | `npm test`                                           |
| Headed (visible browser)            | `npm run test:headed`                                |
| UI mode (watch mode, time travel)   | `npm run test:ui`                                    |
| Smoke tests only                    | `npm run test:smoke`                                 |
| Regression tests only               | `npm run test:regression`                            |
| One project (Chromium)              | `npm run test:chromium`                              |
| API tests only                      | `npx playwright test --project=api`                  |
| One project, any name               | `npx playwright test --project=firefox`              |
| One file                            | `npx playwright test tests/ui/login.spec.ts`         |
| One test by title                   | `npx playwright test -g "should show the inventory"` |
| Debug (step through with inspector) | `npx playwright test --debug`                        |
| Type check                          | `npm run typecheck`                                  |
| Lint                                | `npm run lint`                                       |
| Format                              | `npm run format`                                     |

Projects:

- `setup` logs in once and saves the session.
- `chromium`, `firefox`, `webkit`, and `mobile-chrome` (Pixel 5) run the specs in `tests/ui/`. They depend on `setup` and reuse its session. Dependencies run automatically, so you don't need to run setup yourself.
- `api` runs the specs in `tests/api/` once, with no browser and no login.

## Reports, traces, and debugging

- **HTML report:** `npm run report` opens the last run. It is written to `playwright-report/`.
- **Traces:** collected on the first retry. Open one with `npx playwright show-trace test-results/<test-folder>/trace.zip`, or drag the zip onto [trace.playwright.dev](https://trace.playwright.dev). Traces record DOM snapshots, network, and console for each action.
- **Screenshots and videos:** saved in `test-results/` for failed tests only.
- **CI:** the workflow uploads `playwright-report/` and `test-results/` (traces, screenshots, videos) as artifacts on every run. Download them from the workflow run page.
- **JUnit:** written to `test-results/junit.xml` on CI only.

## Adding a page object

1. Create `src/pages/SettingsPage.ts` and extend `BasePage`.
2. Declare locators as `readonly` properties and set them in the constructor. Prefer `getByRole`, then `getByLabel`, then `getByTestId`.
3. Add action methods. Put no assertions here.

```ts
import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class SettingsPage extends BasePage {
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.saveButton = page.getByRole("button", { name: "Save" });
  }

  async open(): Promise<void> {
    await this.goto("/settings");
  }

  async save(): Promise<void> {
    await this.click(this.saveButton);
  }
}
```

## Adding a fixture

Register the page object in `src/fixtures/index.ts`. Each test gets its own instance:

```ts
type Fixtures = {
  // ...existing fixtures
  settingsPage: SettingsPage;
};

export const test = base.extend<Fixtures>({
  // ...existing fixtures
  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },
});
```

Then inject it by name in a spec: `test("...", async ({ settingsPage }) => { ... })`.

## Adding a test

1. Add any new test data to `src/data/` as a typed export. Don't put literals in the spec.
2. Create `tests/ui/settings.spec.ts` and import `test` and `expect` from `src/fixtures`.
3. Tag the test with `@smoke` (critical path) or `@regression`.

```ts
import { expect, test } from "../../src/fixtures";

test.describe("Settings", () => {
  test(
    "should save changes when the save button is clicked",
    { tag: "@regression" },
    async ({ settingsPage }) => {
      await test.step("open settings and save", async () => {
        await settingsPage.open();
        await settingsPage.save();
      });

      await test.step("verify the confirmation appears", async () => {
        await expect(settingsPage.saveButton).toBeEnabled();
      });
    },
  );
});
```

Spec files are picked up automatically: `tests/ui/` runs in every browser project, `tests/api/` runs once in the `api` project. UI specs start logged in through the saved session. For logged-out tests, add `test.use({ storageState: { cookies: [], origins: [] } })` to the `describe` block.

## Conventions

- **Test names:** `should <behavior> when <condition>`, e.g. `should show an error when invalid credentials are used`.
- **Tags:** `@smoke` for fast, critical paths. `@regression` for everything else.
- **Locators:** `getByRole` > `getByLabel` > `getByTestId` (`data-test` attribute). No XPath or brittle CSS.
- **Waits:** no `waitForTimeout` or hard sleeps. Rely on auto-waiting and web-first assertions (`toHaveText`, `toHaveURL`). ESLint enforces this, and also flags any Playwright call missing an `await`.
- **Test data:** URL paths, credentials, and expected copy live in `src/data/`. Specs contain no literals.
- **Independence:** each test starts from fresh state, so tests run in any order and in parallel.
- **Steps:** wrap multi-part flows in `test.step` so reports read clearly.
- **Secrets:** never commit `.env`. Add new variables to `.env.example` and to `src/config/env.ts`.

## CI

The workflow in `.github/workflows/playwright.yml` runs on pushes and pull requests to `main`/`master`. It caches npm, runs `npm ci`, lints and type checks, runs `npx playwright install --with-deps`, runs the tests, and uploads the HTML report and traces.

Set repository **variables** (`BASE_URL`, `API_URL`) and **secrets** (`TEST_USERNAME`, `TEST_PASSWORD`) to override the demo defaults.
