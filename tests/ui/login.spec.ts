import { messages, pageTitles } from "../../src/data/messages";
import { routes } from "../../src/data/routes";
import { users } from "../../src/data/users";
import { expect, test } from "../../src/fixtures";

test.describe("Login", () => {
  // These specs test logging in, so they must start logged out rather than reuse the setup session.
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test(
    "should show the inventory when valid credentials are used",
    { tag: "@smoke" },
    async ({ page, loginPage, inventoryPage }) => {
      await test.step("submit valid credentials", async () => {
        await loginPage.login(users.validUser);
      });

      await test.step("verify the inventory page is shown", async () => {
        await expect(page).toHaveURL(routes.inventory);
        await expect(inventoryPage.title).toHaveText(pageTitles.inventory);
      });
    },
  );

  test(
    "should show an error when invalid credentials are used",
    { tag: "@regression" },
    async ({ page, loginPage }) => {
      await test.step("submit invalid credentials", async () => {
        await loginPage.login(users.invalidUser);
      });

      await test.step("verify the error is shown and the user stays on login", async () => {
        await expect(loginPage.errorMessage).toHaveText(messages.invalidCredentials);
        await expect(page).toHaveURL(routes.login);
      });
    },
  );

  test(
    "should show a locked-out error when the locked-out user logs in",
    { tag: "@regression" },
    async ({ page, loginPage }) => {
      await test.step("submit the locked-out user's credentials", async () => {
        await loginPage.login(users.lockedOutUser);
      });

      await test.step("verify the error is shown and the user stays on login", async () => {
        await expect(loginPage.errorMessage).toHaveText(messages.lockedOutUser);
        await expect(page).toHaveURL(routes.login);
      });
    },
  );
});
