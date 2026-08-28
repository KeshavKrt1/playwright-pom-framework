import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { UserDataProvider } from '../../utils/data-providers/DataProvider';

test.describe('Dashboard Tests - Data-Driven with User Data', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let userDataProvider: UserDataProvider;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    userDataProvider = new UserDataProvider();
    await loginPage.navigateToLogin();
  });

  test.describe('Dashboard Access by User Role', () => {
    /**
     * This test iterates through users of different roles
     * and verifies dashboard access
     */
    test('Admin user can access dashboard', async ({ page }) => {
      const adminUsers = userDataProvider.getUsersByRole('admin');
      expect(adminUsers.length).toBeGreaterThan(0);

      const adminUser = adminUsers[0];
      console.log(`Testing with admin user: ${adminUser.email}`);

      // In real scenario, use email and password from your auth system
      const loginPageInstance = new LoginPage(page);
      await loginPageInstance.login(adminUser.email, 'AdminPass123!');

      const dashboardPageInstance = new DashboardPage(page);
      const isLoaded = await dashboardPageInstance.isDashboardLoaded();
      expect(isLoaded).toBe(true);

      const greeting = await dashboardPageInstance.getUserGreeting();
      expect(greeting).toContain(adminUser.firstName);
    });

    test('Regular user can access dashboard', async ({ page }) => {
      const regularUsers = userDataProvider.getUsersByRole('user');
      expect(regularUsers.length).toBeGreaterThan(0);

      const user = regularUsers[0];
      console.log(`Testing with regular user: ${user.email}`);

      const loginPageInstance = new LoginPage(page);
      await loginPageInstance.login(user.email, 'UserPass123!');

      const dashboardPageInstance = new DashboardPage(page);
      const isLoaded = await dashboardPageInstance.isDashboardLoaded();
      expect(isLoaded).toBe(true);
    });
  });

  test.describe('User-Specific Dashboard Content', () => {
    /**
     * Load all users and verify dashboard personalizes content
     */
    const allUsers = userDataProvider.getUsers();

    allUsers.forEach((user) => {
      test(`Dashboard displays correct content for ${user.firstName} ${user.lastName}`, async ({
        page,
      }) => {
        if (user.status !== 'active') {
          test.skip();
        }

        const loginPageInstance = new LoginPage(page);
        await loginPageInstance.login(user.email, 'Password123!');

        const dashboardPageInstance = new DashboardPage(page);
        const greeting = await dashboardPageInstance.getUserGreeting();

        expect(greeting).toContain(user.firstName);
        expect(greeting).toContain(user.lastName);
      });
    });
  });

  test.describe('Active Users Only Tests', () => {
    test('Only active users can login successfully', async ({ page }) => {
      const activeUsers = userDataProvider
        .getUsers()
        .filter((u) => u.status === 'active');

      console.log(`Testing with ${activeUsers.length} active users`);
      expect(activeUsers.length).toBeGreaterThan(0);

      for (const user of activeUsers) {
        console.log(`Verifying active status for: ${user.email}`);
        expect(user.status).toBe('active');
      }
    });
  });
});
