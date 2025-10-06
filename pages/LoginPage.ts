import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for the Sauce Demo login screen.
 * Uses placeholders and data-test attributes that are stable in this app.
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMsg: Locator;
  readonly appLogo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('Username'); // id=user-name
    this.passwordInput = page.getByPlaceholder('Password'); // id=password
    this.loginButton = page.getByRole('button', { name: 'Login' }); // id=login-button
    this.errorMsg = page.locator('[data-test="error"]'); // error banner
    this.appLogo = page.locator('.login_logo'); // "Swag Labs" login logo
  }

  // With baseURL set in config, navigating to '/' opens the app root.
  async goto() {
    await this.page.goto('/'); // relies on config.use.baseURL
  }

  /**
   * Attempts login with provided credentials.
   */
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // Assertions for common negative paths on Sauce Demo.
  async assertLockedOutError() {
    await expect(this.errorMsg).toBeVisible();
    await expect(this.errorMsg).toContainText('Sorry, this user has been locked out.');
  }

  async assertInvalidCredsError() {
    await expect(this.errorMsg).toBeVisible();
    await expect(this.errorMsg).toContainText('Username and password do not match');
  }

  async assertRequiredFieldError() {
    await expect(this.errorMsg).toBeVisible();
    await expect(this.errorMsg).toContainText('is required');
  }
}
