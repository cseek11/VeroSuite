/**
 * Enterprise-Grade Testing Configuration
 * Comprehensive testing setup for mission-critical CRM application
 */

module.exports = {
  // Core Jest Configuration
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts',
    '**/test/**/*.test.ts',
    '**/test/**/*.spec.ts'
  ],
  
  // Coverage Configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json',
    'clover'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/main.ts',
    '!src/**/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Module Resolution - Fixed property name
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
    '^@mocks/(.*)$': '<rootDir>/test/mocks/$1',
    '^@fixtures/(.*)$': '<rootDir>/test/fixtures/$1'
  },

  // Test Setup
  setupFilesAfterEnv: [
    '<rootDir>/test/setup.js'
  ],

  // Test Timeouts
  testTimeout: 30000,
  slowTestThreshold: 5000,

  // Parallel Execution
  maxWorkers: '50%',

  // Verbose Output
  verbose: true,
  silent: false,

  // Global Configuration
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      isolatedModules: true,
      allowJs: true
    }
  },

  // Clear Mocks
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true
};