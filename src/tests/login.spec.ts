import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { LoginDataProvider } from '../../utils/data-providers/DataProvider';
import { TestDataFactory } from '../../utils/TestDataBuilder';

test.describe('Login Tests - Data-Driven Approach', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let dataProvider: LoginDataProvider;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    dataProvider = new LoginDataProvider();
    await loginPage.navigateToLogin();
  });

  test.describe('Parametrized Tests with JSON Data', () => {
    /**
     * Data-driven test: Load all test scenarios from JSON file
     * This test will run once for each scenario in test-datasets.json
     */
    const testDataSets = new LoginDataProvider().getAllTestDataSets();

    testDataSets.forEach((dataSet) => {
      test(`${dataSet.testName} - [${dataSet.metadata.priority}]`, async ({
        page,
      }) => {
        const loginPageInstance = new LoginPage(page);
        const dashboardPageInstance = new DashboardPage(page);

        // Arrange
        console.log(`Running test: ${dataSet.testName}`);
        console.log(`Test ID: ${dataSet.scenarioId}`);

        // Act
        await loginPageInstance.login(
          dataSet.inputs.email,
          dataSet.inputs.password
        );

        // Assert based on expected outputs
        if (dataSet.expectedOutputs.url) {
          const currentUrl = await page.url();
          expect(currentUrl).toContain(
            dataSet.expectedOutputs.url.split('/').pop()
          );
        }

        if (dataSet.expectedOutputs.message) {
          const errorVisible = await loginPageInstance.isErrorMessageVisible();
          expect(errorVisible).toBe(true);
          const errorMsg = await loginPageInstance.getErrorMessage();
          expect(errorMsg).toContain(dataSet.expectedOutputs.message);
        }
      });
    });
  });

  test.describe('Tests Using Factory Pattern', () => {
    test('Login with valid credentials from factory', async ({ page }) => {
      const loginPageInstance = new LoginPage(page);
      const credentials = TestDataFactory.createValidCredentials();

      await loginPageInstance.login(credentials.email, credentials.password);

      const dashboardPageInstance = new DashboardPage(page);
      const isLoaded = await dashboardPageInstance.isDashboardLoaded();
      expect(isLoaded).toBe(true);
    });

    test('Login with invalid email from factory', async ({ page }) => {
      const loginPageInstance = new LoginPage(page);
      const credentials = TestDataFactory.createInvalidEmailCredentials();

      await loginPageInstance.login(credentials.email, credentials.password);

      const errorVisible = await loginPageInstance.isErrorMessageVisible();
      expect(errorVisible).toBe(true);
    });

    test('Login with empty credentials from factory', async ({ page }) => {
      const loginPageInstance = new LoginPage(page);
      const credentials = TestDataFactory.createEmptyCredentials();

      await loginPageInstance.login(credentials.email, credentials.password);

      const errorVisible = await loginPageInstance.isErrorMessageVisible();
      expect(errorVisible).toBe(true);
    });

    test('Login with special characters from factory', async ({ page }) => {
      const loginPageInstance = new LoginPage(page);
      const credentials = TestDataFactory.createSpecialCharacterCredentials();

      await loginPageInstance.login(credentials.email, credentials.password);

      const dashboardPageInstance = new DashboardPage(page);
      const isLoaded = await dashboardPageInstance.isDashboardLoaded();
      expect(isLoaded).toBe(true);
    });
  });

  test.describe('Tests with Bulk Data', () => {
    test('Login with multiple users from bulk data', async ({ page }) => {
      const credentials = TestDataFactory.createBulkCredentials(3);

      for (const cred of credentials) {
        console.log(`Testing login with: ${cred.email}`);
        const loginPageInstance = new LoginPage(page);
        await loginPageInstance.navigateToLogin();
        await loginPageInstance.login(cred.email, cred.password);
        // Add additional assertions based on your application logic
      }
    });
  });

  test.describe('Tests with Priority Filtering', () => {
    test('Run only high-priority tests', async ({ page }) => {
      const highPriorityData = dataProvider.getTestDataByPriority('high');
      console.log(`Found ${highPriorityData.length} high-priority tests`);

      expect(highPriorityData.length).toBeGreaterThan(0);

      highPriorityData.forEach((dataSet) => {
        console.log(`High-priority test: ${dataSet.testName}`);
      });
    });

    test('Run only medium-priority tests', async ({ page }) => {
      const mediumPriorityData = dataProvider.getTestDataByPriority('medium');
      console.log(`Found ${mediumPriorityData.length} medium-priority tests`);
    });
  });

  test.describe('Tests with Remember Me Option', () => {
    const rememberMeTestData = new LoginDataProvider()
      .getAllTestDataSets()
      .filter((ds) => ds.inputs.rememberMe === true);

    rememberMeTestData.forEach((dataSet) => {
      test(`${dataSet.testName} with Remember Me`, async ({ page }) => {
        const loginPageInstance = new LoginPage(page);
        await loginPageInstance.loginWithRememberMe(
          dataSet.inputs.email,
          dataSet.inputs.password
        );

        const dashboardPageInstance = new DashboardPage(page);
        const isLoaded = await dashboardPageInstance.isDashboardLoaded();
        expect(isLoaded).toBe(true);
      });
    });
  });
});
