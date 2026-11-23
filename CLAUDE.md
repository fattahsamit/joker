# CLAUDE.md

Playwright + TypeScript E2E and API test boilerplate. Demo target: https://www.saucedemo.com (UI) and https://jsonplaceholder.typicode.com (API).

## Structure

- `src/pages/` Page Object Model classes. `BasePage` holds shared actions.
- `src/components/` reusable UI pieces (e.g. `Header`), composed into page objects.
- `src/fixtures/index.ts` exports the only `test` and `expect` that specs should import.
- `src/api/` typed API client over the `request` fixture.
- `src/data/` typed test data. Specs contain no hardcoded credentials, URLs, or copy.
- `src/config/` `env.ts` validates `.env` at startup (fail-fast); `constants.ts`.
- `src/utils/` logger and random helpers.
- `tests/setup/auth.setup.ts` logs in once and saves `playwright/.auth/user.json`.
- `tests/ui/` specs run in every browser project; `tests/api/` specs run once in the `api` project.

## Commands

- Setup: `npm ci && npx playwright install`; copy `.env.example` to `.env`.
- Test: `npm test` | `npm run test:headed` | `npm run test:ui` | `npm run test:chromium`
- Tags: `npm run test:smoke` | `npm run test:regression`
- Verify before finishing: `npm run typecheck && npm run lint && npm test`
- Format: `npm run format`. Reports: `npm run report`.

## Conventions

- Page objects: locators are `readonly` properties set in the constructor. Actions are methods. No assertions in page objects.
- Specs: assertions only, via the `expect` exported from `src/fixtures`. Use `test.step` for multi-part flows.
- Locator priority: `getByRole` > `getByLabel` > `getByTestId` (`data-test`). Never use XPath or brittle CSS.
- Never use `waitForTimeout` or hard sleeps. Rely on auto-waiting and web-first assertions (`toHaveText`, `toHaveURL`).
- Tests must be independent and idempotent. Each test gets fresh state; use `buildNewPost()`-style helpers for unique data.
- Test names: `should <behavior> when <condition>`.
- Tags: `@smoke` for critical paths, `@regression` for the rest. Add with `{ tag: "@smoke" }`.
- Logged-out UI specs (e.g. login) reset state with `test.use({ storageState: { cookies: [], origins: [] } })`.
- Test data lives in `src/data`: users, products, `routes` (URL paths), `messages` and `pageTitles` (expected copy). No literals in specs.
- Add new fixtures to `src/fixtures/index.ts`.
- `.env` values override shell variables (Windows sets `USERNAME`); `<placeholder>` values fail validation.
- Never commit `.env` or real credentials. Add new variables to both `.env.example` and `src/config/env.ts`.
