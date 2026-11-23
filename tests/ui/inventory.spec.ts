import { pageTitles } from "../../src/data/messages";
import { products } from "../../src/data/products";
import { routes } from "../../src/data/routes";
import { expect, test } from "../../src/fixtures";

test.describe("Inventory and cart", () => {
  test.beforeEach(async ({ inventoryPage }) => {
    // Already logged in: browser projects load the session saved by tests/setup/auth.setup.ts.
    await inventoryPage.open();
  });

  test(
    "should show the product in the cart when it is added from inventory",
    { tag: "@smoke" },
    async ({ page, inventoryPage, cartPage }) => {
      const cartItems = [products.backpack];

      await test.step("add the product from the inventory", async () => {
        await expect(inventoryPage.title).toHaveText(pageTitles.inventory);
        for (const item of cartItems) {
          await inventoryPage.addToCart(item.name);
        }
      });

      await test.step("verify the cart badge shows the item count", async () => {
        await expect(inventoryPage.header.cartBadge).toHaveText(String(cartItems.length));
      });

      await test.step("verify the product appears on the cart page", async () => {
        await inventoryPage.header.openCart();
        await expect(page).toHaveURL(routes.cart);
        await expect(cartPage.title).toHaveText(pageTitles.cart);
        await expect(cartPage.itemNames).toHaveText(cartItems.map((item) => item.name));
      });
    },
  );
});
