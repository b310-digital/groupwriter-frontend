import { defineConfig, devices } from '@playwright/test';

const connectOptions = process.env.TESTING_PLAYWRIGHT_WS_ENDPOINT ? {
  connectOptions: {
    wsEndpoint: process.env.TESTING_PLAYWRIGHT_WS_ENDPOINT ?? '',
  },
} : {}

export default defineConfig({
  testDir: './e2e',
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
  use: { ...{
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.TESTING_PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:5173',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  }, ...connectOptions },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    reuseExistingServer: !process.env.CI,
  },
});
