"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var test_1 = require("@playwright/test");
/**
 * @see https://playwright.dev/docs/test-configuration
 */
exports.default = (0, test_1.defineConfig)(__assign(__assign({ testDir: './src/test/e2e', 
    /* Run tests in files in parallel */
    fullyParallel: true, 
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI, 
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0 }, (process.env.CI ? { workers: 1 } : {})), { 
    /* Test timeout */
    timeout: 30000, 
    /* Expect timeout */
    expect: {
        timeout: 5000,
    }, 
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        ['html'],
        ['json', { outputFile: 'test-results/results.json' }],
        ['junit', { outputFile: 'test-results/results.xml' }],
        ['list'],
    ], 
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: 'http://localhost:5173',
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
        /* Take screenshot on failure */
        screenshot: 'only-on-failure',
        /* Record video on failure */
        video: 'retain-on-failure',
    }, 
    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: __assign({}, test_1.devices['Desktop Chrome']),
        },
        {
            name: 'firefox',
            use: __assign({}, test_1.devices['Desktop Firefox']),
        },
        {
            name: 'webkit',
            use: __assign({}, test_1.devices['Desktop Safari']),
        },
        /* Test against mobile viewports. */
        {
            name: 'Mobile Chrome',
            use: __assign({}, test_1.devices['Pixel 5']),
        },
        {
            name: 'Mobile Safari',
            use: __assign({}, test_1.devices['iPhone 12']),
        },
        /* Test against branded browsers. */
        {
            name: 'Microsoft Edge',
            use: __assign(__assign({}, test_1.devices['Desktop Edge']), { channel: 'msedge' }),
        },
        {
            name: 'Google Chrome',
            use: __assign(__assign({}, test_1.devices['Desktop Chrome']), { channel: 'chrome' }),
        },
    ], 
    /* Run your local dev server before starting the tests */
    webServer: {
        command: 'npm run preview',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
    } }));
