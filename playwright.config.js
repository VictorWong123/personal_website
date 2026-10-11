import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    expect: {
        timeout: 5000,
    },
    forbidOnly: true,
    outputDir: '.tmp/playwright-results',
    reporter: 'list',
    testDir: './tests/secrets',
    timeout: 30000,
    workers: 1,
    use: {
        baseURL: 'http://127.0.0.1:3000',
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
    projects: [
        {
            name: 'desktop-chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'ipad-portrait-chromium',
            use: { ...devices['iPad (gen 5)'], browserName: 'chromium' },
        },
        {
            name: 'ipad-landscape-chromium',
            use: { ...devices['iPad (gen 5) landscape'], browserName: 'chromium' },
        },
    ],
    webServer: {
        command: 'npm run dev -- --host 127.0.0.1',
        reuseExistingServer: false,
        timeout: 120000,
        url: 'http://127.0.0.1:3000',
    },
});
