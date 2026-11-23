import type { Locator, Page } from "@playwright/test";
import { Header } from "../components/Header";
import { routes } from "../data/routes";
import { BasePage } from "./BasePage";

export class InventoryPage extends BasePage {
  readonly title: Locator;
  readonly items: Locator;
  readonly header: Header;

  constructor(page: Page) {
    super(page);
    this.title = page.getByTestId("title");
    this.items = page.getByTestId("inventory-item");
    this.header = new Header(page);
  }

  async open(): Promise<void> {
    await this.goto(routes.inventory);
  }

  /** Returns the card for a product, identified by its visible name. */
  productCard(productName: string): Locator {
    return this.items.filter({ hasText: productName });
  }

  async addToCart(productName: string): Promise<void> {
    await this.click(this.productCard(productName).getByRole("button", { name: "Add to cart" }));
  }
}
