import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login Page Object
 * Handles all login-related interactions
 */
export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    super(page);
    // Define locators for login elements
    this.usernameInput = page.locator('input[id="email"]');
    this.passwordInput = page.locator('input[id="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error-message');
    this.rememberMeCheckbox = page.locator('input[id="remember-me"]');
    this.forgotPasswordLink = page.locator('a:has-text("Forgot Password")');
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin(): Promise<void> {
    await this.goto(process.env.BASE_URL + '/login' || 'http://localhost:3000/login');
  }

  /**
   * Perform login with credentials
   */
  async login(email: string, password: string): Promise<void> {
    console.log(`[Login] Attempting login with email: ${email}`);
    await this.fill(this.usernameInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
    await this.waitForNavigation();
  }

  /**
   * Login with remember me option
   */
  async loginWithRememberMe(email: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.rememberMeCheckbox);
    await this.click(this.loginButton);
    await this.waitForNavigation();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return this.isVisible(this.errorMessage);
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.click(this.forgotPasswordLink);
  }
}
