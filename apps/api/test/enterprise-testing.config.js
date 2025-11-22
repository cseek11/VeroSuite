/**
 * Enterprise-Grade Testing Configuration
 * Comprehensive testing setup for mission-critical CRM application
 */

module.exports = {
  // Core Jest Configuration
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '..',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts',
    '**/test/**/*.test.ts',
    '**/test/**/*.spec.ts'
  ],
  // Exclude integration and E2E tests from unit test runs
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/test/integration/',
    '/test/.*\\.e2e-spec\\.ts$',
    '/test/security/',
    '/test/performance/'
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
    '!src/**/index.ts',
    '!src/**/*.module.ts',           // Exclude module files (DI only)
    '!src/**/dto/**/*.dto.ts',       // Exclude simple DTOs (test selectively)
    '!src/**/*.gateway.ts'           // WebSocket gateways (test via integration)
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Module Resolution
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
    '^@mocks/(.*)$': '<rootDir>/test/mocks/$1',
    '^@fixtures/(.*)$': '<rootDir>/test/fixtures/$1',
    '^@sentry/node$': '<rootDir>/test/mocks/sentry-node.mock.ts',
    '^@sentry/profiling-node$': '<rootDir>/test/mocks/sentry-profiling-node.mock.ts',
    '^ioredis$': '<rootDir>/test/mocks/ioredis.mock.ts'
  },

  // Test Setup
  setupFilesAfterEnv: [
    '<rootDir>/test/setup.ts'
  ],
  
  // Transform configuration
  // Note: isolatedModules is configured in tsconfig.json (line 15)
  // Removed from here to avoid deprecation warning (ts-jest v30+)
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      allowJs: true
    }]
  },

  // Test Timeouts
  testTimeout: 30000,
  slowTestThreshold: 5000,

  // Parallel Execution
  maxWorkers: '50%',

  // Verbose Output
  verbose: true,
  silent: false,

  // Clear Mocks
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true
};