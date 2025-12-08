import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,
    testTimeout: 10000,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/*.e2e.test.*',
      '**/e2e/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/test/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/',
        '**/build/',
        '**/*.test.*',
        '**/*.spec.*',
        '**/__tests__/',
        '**/__mocks__/',
        '**/*.module.ts', // Exclude module files (DI only)
        '**/dto/**/*.dto.ts', // Exclude simple DTOs (test selectively)
        '**/*.gateway.ts', // WebSocket gateways (test via integration)
        'src/main.tsx', // Entry point
        'src/vite-env.d.ts', // Vite types
        'src/env.d.ts', // Environment types
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
