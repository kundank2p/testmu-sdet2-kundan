import { test as baseTest, expect, type Page } from '@playwright/test';
import { DashboardPage } from '../pages/dashboardPage.js';
import { LoginPage } from '../pages/loginPage.js';

type UiFixtures = {
  loggedPage: Page;
  dashboardPage: DashboardPage;
  loginPage: LoginPage;
};

const test = baseTest.extend<UiFixtures>({
  // loggedPage — page already authenticated via storageState from auth.setup.ts
  loggedPage: async ({ page }, use) => {
    const dashboard = new DashboardPage(page);
    await dashboard.open();
    await page.waitForLoadState('networkidle');
    await use(page);
  },

  // dashboardPage — typed page object for authenticated dashboard interactions
  dashboardPage: async ({ page }, use) => {
    const dashboard = new DashboardPage(page);
    await dashboard.open();
    await page.waitForLoadState('networkidle');
    await use(dashboard);
  },

  // loginPage — fresh page object, no navigation (caller decides where to go)
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { test, expect };
