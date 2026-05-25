import { defineConfig, devices } from '@playwright/test';
import Env from './config/env.js';

const reporters: Parameters<typeof defineConfig>[0]['reporter'] = [
  ['list'],
  ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ...(process.env.CI
    ? [['allure-playwright', { outputFolder: 'allure-results' }] as const]
    : []),
];

export default defineConfig({
  testDir: './tests',
  timeout: Number(process.env.TEST_TIMEOUT ?? 30000),
  expect: { timeout: 5000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 1,
  outputDir: 'test-results',
  reporter: reporters,

  use: {
    baseURL: Env.UI_BASE_URL,
    actionTimeout: 30000,
    navigationTimeout: 30000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Runs auth/auth.setup.ts — saves session to .auth/user.json
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // Browser projects — inherit saved session, run ui + integration tests
    {
      name: 'chromium',
      testMatch: /(?:ui|integration)\/.*\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json' },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      testMatch: /(?:ui|integration)\/.*\.spec\.ts$/,
      use: { ...devices['Desktop Firefox'], storageState: '.auth/user.json' },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      testMatch: /(?:ui|integration)\/.*\.spec\.ts$/,
      use: { ...devices['Desktop Safari'], storageState: '.auth/user.json' },
      dependencies: ['setup'],
    },

    // API project — no browser, fresh login per test via api.fixture.ts
    {
      name: 'api',
      testMatch: /api\/.*\.spec\.ts$/,
      use: { baseURL: Env.API_BASE_URL },
    },
  ],
});