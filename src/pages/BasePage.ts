import type { Locator, Page } from "@playwright/test";

/**
 * Shared base for all page objects.
 * Holds generic actions only. No assertions here: those belong in specs.
 */
export class BasePage {
  constructor(protected readonly page: Page) {}

  /** Navigates to a path relative to `baseURL`. */
  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  protected async fill(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }

  protected async click(locator: Locator): Promise<void> {
    await locator.click();
  }
}
