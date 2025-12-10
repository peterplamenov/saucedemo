const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    timeout: 45 * 1000,
    expect: {
        timeout: 8000
    },
    fullyParallel: true,
    // eslint-disable-next-line no-process-env
    forbidOnly: !!process.env.CI,
    // eslint-disable-next-line no-process-env
    retries: process.env.CI ? 2 : 0,
    // eslint-disable-next-line no-process-env
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['list'],
        ['json', { outputFile: 'test-results.json' }]
    ],
    use: {
        baseURL: 'https://www.saucedemo.com',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        actionTimeout: 15000,
        navigationTimeout: 15000,
        viewport: { width: 1366, height: 768 },
        // eslint-disable-next-line no-process-env
        launchOptions: { slowMo: process.env.CI ? 0 : 50 }
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] }
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] }
        }
    ]
});
