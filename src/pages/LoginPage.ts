import type { Locator, Page } from "@playwright/test";
import { routes } from "../data/routes";
import type { UserCredentials } from "../data/users";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByLabel("Username");
    this.passwordInput = page.getByLabel("Password");
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.errorMessage = page.getByTestId("error");
  }

  async open(): Promise<void> {
    await this.goto(routes.login);
  }

  async login(user: UserCredentials): Promise<void> {
    await this.fill(this.usernameInput, user.username);
    await this.fill(this.passwordInput, user.password);
    await this.click(this.loginButton);
  }
}
