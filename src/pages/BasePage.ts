import { Page, Locator } from '@playwright/test';

/**
 * Base Page Object class - provides common functionality for all pages
 * Includes waits, navigation, and logging utilities
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a URL
   */
  async goto(url: string): Promise<void> {
    console.log(`[Navigation] Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  /**
   * Wait for element visibility
   */
  async waitForElement(selector: string, timeout: number = 5000): Promise<void> {
    console.log(`[Wait] Waiting for element: ${selector}`);
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Click element with logging
   */
  async click(locator: Locator | string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    console.log(`[Click] Clicking element`);
    await element.click();
  }

  /**
   * Fill input field
   */
  async fill(locator: Locator | string, value: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    console.log(`[Fill] Entering value in field`);
    await element.fill(value);
  }

  /**
   * Get text from element
   */
  async getText(locator: Locator | string): Promise<string> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const text = await element.textContent();
    console.log(`[GetText] Text content: ${text}`);
    return text || '';
  }

  /**
   * Check if element is visible
   */
  async isVisible(locator: Locator | string): Promise<boolean> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const visible = await element.isVisible();
    console.log(`[IsVisible] Element visible: ${visible}`);
    return visible;
  }

  /**
   * Wait for navigation
   */
  async waitForNavigation(): Promise<void> {
    console.log(`[Navigation] Waiting for navigation`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Reload page
   */
  async reload(): Promise<void> {
    console.log(`[Navigation] Reloading page`);
    await this.page.reload();
  }
}
