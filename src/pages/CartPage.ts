import type { Locator, Page } from "@playwright/test";
import { Header } from "../components/Header";
import { routes } from "../data/routes";
import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
  readonly title: Locator;
  readonly itemNames: Locator;
  readonly header: Header;

  constructor(page: Page) {
    super(page);
    this.title = page.getByTestId("title");
    this.itemNames = page.getByTestId("inventory-item-name");
    this.header = new Header(page);
  }

  async open(): Promise<void> {
    await this.goto(routes.cart);
  }
}
