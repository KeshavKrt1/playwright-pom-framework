import { TestDataSet } from '../models/TestData';
import { LoginDataProvider } from './data-providers/DataProvider';

/**
 * Test Data Builder
 * Factory pattern for building test data objects dynamically
 * Useful for creating complex data structures with defaults and overrides
 */
export class TestDataBuilder {
  private dataProvider: LoginDataProvider;

  constructor() {
    this.dataProvider = new LoginDataProvider();
  }

  /**
   * Build test data from template with overrides
   */
  buildFromTemplate(
    templateId: string,
    overrides?: Partial<TestDataSet>
  ): TestDataSet {
    const template = this.dataProvider.getTestDataSet(templateId);
    return { ...template, ...overrides };
  }

  /**
   * Build multiple test data sets with different variations
   */
  buildVariations(
    baseId: string,
    variations: Array<Partial<TestDataSet>>
  ): TestDataSet[] {
    const base = this.dataProvider.getTestDataSet(baseId);
    return variations.map((variation, index) => ({
      ...base,
      scenarioId: `${baseId}-variation-${index + 1}`,
      ...variation,
    }));
  }

  /**
   * Build test data with random values (useful for data generation)
   */
  buildWithRandomData(): TestDataSet {
    const randomId = `scenario-${Date.now()}`;
    return {
      scenarioId: randomId,
      testName: `Generated Test - ${randomId}`,
      inputs: {
        email: `test${Date.now()}@example.com`,
        password: this.generateRandomPassword(),
      },
      expectedOutputs: {
        url: 'http://localhost:3000/dashboard',
      },
      metadata: {
        priority: 'medium',
        createdDate: new Date().toISOString(),
        author: 'data-builder',
      },
    };
  }

  /**
   * Generate random password
   */
  private generateRandomPassword(): string {
    return Math.random().toString(36).slice(-12);
  }

  /**
   * Clone and modify existing test data
   */
  cloneAndModify(
    sourceId: string,
    modifications: Partial<TestDataSet>
  ): TestDataSet {
    const source = this.dataProvider.getTestDataSet(sourceId);
    return {
      ...source,
      scenarioId: `${sourceId}-clone-${Date.now()}`,
      ...modifications,
    };
  }
}

/**
 * Test Data Factory
 * Create pre-configured test data for common scenarios
 */
export class TestDataFactory {
  /**
   * Create valid login credentials
   */
  static createValidCredentials(email?: string, password?: string) {
    return {
      email: email || 'user@example.com',
      password: password || 'SecurePassword123!',
      rememberMe: false,
    };
  }

  /**
   * Create invalid email credentials
   */
  static createInvalidEmailCredentials() {
    return {
      email: 'invalid-email',
      password: 'ValidPassword123!',
      rememberMe: false,
    };
  }

  /**
   * Create invalid password credentials
   */
  static createInvalidPasswordCredentials() {
    return {
      email: 'user@example.com',
      password: '123',
      rememberMe: false,
    };
  }

  /**
   * Create empty credentials
   */
  static createEmptyCredentials() {
    return {
      email: '',
      password: '',
      rememberMe: false,
    };
  }

  /**
   * Create credentials with special characters
   */
  static createSpecialCharacterCredentials() {
    return {
      email: 'user+special@example.com',
      password: 'P@$$w0rd!#%&*',
      rememberMe: false,
    };
  }

  /**
   * Create bulk test data for multiple users
   */
  static createBulkCredentials(count: number) {
    return Array.from({ length: count }, (_, i) => ({
      email: `user${i + 1}@example.com`,
      password: `Password${i + 1}!`,
      rememberMe: i % 2 === 0,
    }));
  }
}
