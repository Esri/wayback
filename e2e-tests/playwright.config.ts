import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import fs from 'fs';
// import path from 'path';
dotenv.config({ path: '.env.e2e' });

// exit if the env file is missing
if (!fs.existsSync('.env.e2e')) {
    console.error('Error: Missing .env.e2e file.');
    process.exit(1);
}

// exit if the env file is missing required variables
const requiredEnvVars = [
    'E2E_TEST_ARCGIS_ONLINE_USERNAME',
    'E2E_TEST_ARCGIS_ONLINE_PASSWORD',
    'WEBPACK_DEV_SERVER_HOSTNAME',
];
for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
        console.error(
            `Error: Missing required environment variable ${varName} in .env.e2e file`
        );
        process.exit(1);
    }
}

// Set DEV_SERVER_URL based on the WEBPACK_DEV_SERVER_HOSTNAME environment variable or default to localhost.
// This URL is used in e2e tests to connect to the development server.
// Ensure it aligns with the dev server configuration in webpack.config.js.
export const DEV_SERVER_URL = process.env.WEBPACK_DEV_SERVER_HOSTNAME
    ? `https://${process.env.WEBPACK_DEV_SERVER_HOSTNAME}:8080`
    : 'http://localhost:8080'; // Default to localhost if not set
// console.log(`Using DEV_SERVER_URL: ${DEV_SERVER_URL}`);

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './tests',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'html',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        // baseURL: 'http://127.0.0.1:3000',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',

        ignoreHTTPSErrors: true, // Allow self-signed certificates for local development, if needed.
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },

        // {
        //   name: 'firefox',
        //   use: { ...devices['Desktop Firefox'] },
        // },

        // {
        //   name: 'webkit',
        //   use: { ...devices['Desktop Safari'] },
        // },

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        // },
    ],

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   url: 'http://127.0.0.1:3000',
    //   reuseExistingServer: !process.env.CI,
    // },
    webServer: {
        command: 'npm run start:dev',
        url: DEV_SERVER_URL,
        reuseExistingServer: !process.env.CI,
        ignoreHTTPSErrors: true,
    },
});
