import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parser';
import { LoginCredentials, TestDataSet, UserData } from '../models/TestData';

/**
 * Base Data Provider class
 * Provides common functionality for reading test data from various sources
 */
export class BaseDataProvider {
  protected dataDir: string;

  constructor(dataDir: string = 'src/test-data') {
    this.dataDir = dataDir;
  }

  /**
   * Get full path to data file
   */
  protected getFilePath(filename: string): string {
    return path.join(this.dataDir, filename);
  }

  /**
   * Read JSON file
   */
  protected readJsonFile<T>(filename: string): T {
    const filePath = this.getFilePath(filename);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Test data file not found: ${filePath}`);
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T;
  }

  /**
   * Read CSV file and return as array
   */
  protected async readCsvFile(filename: string): Promise<Record<string, string>[]> {
    return new Promise((resolve, reject) => {
      const results: Record<string, string>[] = [];
      const filePath = this.getFilePath(filename);

      fs.createReadStream(filePath)
        .pipe(parse())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }

  /**
   * Write JSON file
   */
  protected writeJsonFile<T>(filename: string, data: T): void {
    const filePath = this.getFilePath(filename);
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`[DataProvider] Data written to: ${filePath}`);
  }
}

/**
 * Login Data Provider
 * Handles loading and managing login test data
 */
export class LoginDataProvider extends BaseDataProvider {
  constructor(dataDir: string = 'src/test-data') {
    super(dataDir);
  }

  /**
   * Get all login scenarios from JSON
   */
  getLoginScenarios(): LoginCredentials[] {
    return this.readJsonFile<LoginCredentials[]>('login/credentials.json');
  }

  /**
   * Get login scenarios from CSV
   */
  async getLoginScenariosFromCsv(): Promise<Record<string, string>[]> {
    return this.readCsvFile('login/credentials.csv');
  }

  /**
   * Get specific test data set by scenario ID
   */
  getTestDataSet(scenarioId: string): TestDataSet {
    const dataSets = this.readJsonFile<TestDataSet[]>('login/test-datasets.json');
    const dataSet = dataSets.find((ds) => ds.scenarioId === scenarioId);

    if (!dataSet) {
      throw new Error(`Test data set not found for scenario: ${scenarioId}`);
    }

    return dataSet;
  }

  /**
   * Get all test data sets
   */
  getAllTestDataSets(): TestDataSet[] {
    return this.readJsonFile<TestDataSet[]>('login/test-datasets.json');
  }

  /**
   * Get test data by priority level
   */
  getTestDataByPriority(priority: 'high' | 'medium' | 'low'): TestDataSet[] {
    const allData = this.getAllTestDataSets();
    return allData.filter((ds) => ds.metadata.priority === priority);
  }

  /**
   * Add new test data set
   */
  addTestDataSet(dataSet: TestDataSet): void {
    const allData = this.getAllTestDataSets();
    allData.push(dataSet);
    this.writeJsonFile('login/test-datasets.json', allData);
  }

  /**
   * Update existing test data set
   */
  updateTestDataSet(scenarioId: string, updates: Partial<TestDataSet>): void {
    const allData = this.getAllTestDataSets();
    const index = allData.findIndex((ds) => ds.scenarioId === scenarioId);

    if (index === -1) {
      throw new Error(`Test data set not found for scenario: ${scenarioId}`);
    }

    allData[index] = { ...allData[index], ...updates };
    this.writeJsonFile('login/test-datasets.json', allData);
  }

  /**
   * Delete test data set
   */
  deleteTestDataSet(scenarioId: string): void {
    const allData = this.getAllTestDataSets();
    const filtered = allData.filter((ds) => ds.scenarioId !== scenarioId);
    this.writeJsonFile('login/test-datasets.json', filtered);
  }
}

/**
 * User Data Provider
 * Handles loading and managing user test data
 */
export class UserDataProvider extends BaseDataProvider {
  constructor(dataDir: string = 'src/test-data') {
    super(dataDir);
  }

  /**
   * Get all users
   */
  getUsers(): UserData[] {
    return this.readJsonFile<UserData[]>('users/users.json');
  }

  /**
   * Get user by ID
   */
  getUserById(userId: string): UserData {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);

    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    return user;
  }

  /**
   * Get users by role
   */
  getUsersByRole(role: string): UserData[] {
    const users = this.getUsers();
    return users.filter((u) => u.role === role);
  }

  /**
   * Add new user
   */
  addUser(user: UserData): void {
    const users = this.getUsers();
    users.push(user);
    this.writeJsonFile('users/users.json', users);
  }
}
