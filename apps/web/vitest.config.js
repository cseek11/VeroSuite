"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("vitest/config");
var plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
var path_1 = __importDefault(require("path"));
exports.default = (0, config_1.defineConfig)({
    plugins: [(0, plugin_react_1.default)()],
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
            '@': path_1.default.resolve(__dirname, 'src'),
        },
    },
});
