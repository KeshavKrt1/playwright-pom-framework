/**
 * Test Data Models - Type definitions for all test data
 */

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
}

export interface TestScenario {
  id: string;
  name: string;
  description: string;
  credentials: LoginCredentials;
  expectedResult: string;
  tags: string[];
}

export interface EnvironmentConfig {
  baseUrl: string;
  apiUrl: string;
  browser: string;
  headless: boolean;
  timeout: number;
}

export interface TestDataSet {
  scenarioId: string;
  testName: string;
  inputs: LoginCredentials;
  expectedOutputs: {
    message?: string;
    url?: string;
    visible?: boolean;
  };
  metadata: {
    priority: 'high' | 'medium' | 'low';
    createdDate: string;
    author: string;
  };
}
