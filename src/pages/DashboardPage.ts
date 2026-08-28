import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Dashboard Page Object
 * Handles dashboard-related interactions after successful login
 */
export class DashboardPage extends BasePage {
  readonly welcomeMessage: Locator;
  readonly userProfileIcon: Locator;
  readonly logoutButton: Locator;
  readonly navigationMenu: Locator;
  readonly sidebarMenu: Locator;
  readonly userGreeting: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeMessage = page.locator('.welcome-message');
    this.userProfileIcon = page.locator('.user-profile-icon');
    this.logoutButton = page.locator('button:has-text("Logout")');
    this.navigationMenu = page.locator('nav.main-menu');
    this.sidebarMenu = page.locator('aside.sidebar');
    this.userGreeting = page.locator('[data-testid="user-greeting"]');
  }

  /**
   * Navigate to dashboard
   */
  async navigateToDashboard(): Promise<void> {
    await this.goto(process.env.BASE_URL + '/dashboard' || 'http://localhost:3000/dashboard');
  }

  /**
   * Wait for dashboard to load
   */
  async waitForDashboardLoad(): Promise<void> {
    console.log(`[Dashboard] Waiting for dashboard to load`);
    await this.waitForElement('[data-testid="dashboard-container"]');
  }

  /**
   * Get welcome message
   */
  async getWelcomeMessage(): Promise<string> {
    return this.getText(this.welcomeMessage);
  }

  /**
   * Get user greeting text
   */
  async getUserGreeting(): Promise<string> {
    return this.getText(this.userGreeting);
  }

  /**
   * Logout from dashboard
   */
  async logout(): Promise<void> {
    console.log(`[Dashboard] Logging out`);
    await this.click(this.userProfileIcon);
    await this.click(this.logoutButton);
    await this.waitForNavigation();
  }

  /**
   * Check if dashboard is loaded
   */
  async isDashboardLoaded(): Promise<boolean> {
    return this.isVisible(this.welcomeMessage);
  }

  /**
   * Navigate to menu item
   */
  async navigateToMenuItem(menuItem: string): Promise<void> {
    const menuLocator = this.page.locator(`text=${menuItem}`);
    await this.click(menuLocator);
    await this.waitForNavigation();
  }
}
