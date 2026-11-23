import { AUTH_STATE_PATH } from "../../src/config/constants";
import { pageTitles } from "../../src/data/messages";
import { routes } from "../../src/data/routes";
import { users } from "../../src/data/users";
import { test as setup, expect } from "../../src/fixtures";
import { createLogger } from "../../src/utils/logger";

const logger = createLogger("auth");

// Runs once before the browser projects. Their storageState points at the file written here.
setup(
  "should save a logged-in session when valid credentials are used",
  async ({ page, loginPage, inventoryPage }) => {
    await loginPage.open();
    await loginPage.login(users.validUser);

    await expect(page).toHaveURL(routes.inventory);
    await expect(inventoryPage.title).toHaveText(pageTitles.inventory);

    await page.context().storageState({ path: AUTH_STATE_PATH });
    logger.info(`Saved authenticated session to ${AUTH_STATE_PATH}`);
  },
);
