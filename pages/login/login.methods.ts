import { expect, Page } from '@playwright/test';
import { LoginElements } from './login.elements';

export class LoginMethods {
  constructor(private readonly page: Page) {}

  async open(baseUrl: string): Promise<void> {
    await this.page.goto(baseUrl);
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.fill(LoginElements.usernameInput, username);
    await this.page.fill(LoginElements.passwordInput, password);
    await this.page.click(LoginElements.loginButton);
  }

  async assertSuccessfulLogin(expectedTitle: string): Promise<void> {
    await expect(this.page.locator(LoginElements.inventoryContainer)).toBeVisible();
    await expect(this.page.locator(LoginElements.pageTitle)).toHaveText(expectedTitle);
  }
}