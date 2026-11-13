import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration.
 *
 * Two projects:
 *  - `ui`  - UI tests against the public TodoMVC demo (https://demo.playwright.dev/todomvc)
 *  - `api` - API tests against the public JSONPlaceholder API (https://jsonplaceholder.typicode.com)
 *
 * Reporters:
 *  - `list`                                  - console output
 *  - `@xray-app/playwright-junit-reporter`   - JUnit XML for import into Jira Xray
 *                                              (see README > Xray reporting)
 *  - `allure-playwright`                     - Allure results in ./allure-results
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    [
      '@xray-app/playwright-junit-reporter',
      {
        embedAnnotationsAsProperties: true,
        embedAttachmentsAsProperty: 'testrun_evidence',
        outputFile: './test-results/xray-results.xml',
      },
    ],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://demo.playwright.dev/todomvc',
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'https://jsonplaceholder.typicode.com',
      },
    },
  ],
  outputDir: 'test-results',
});
