import { test as baseTest, expect } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';
import { RoomApi } from '../utils/roomApi.js';
import { DashboardPage } from '../pages/dashboardPage.js';
import Env from '../config/env.js';

type IntegrationFixtures = {
  roomApi: RoomApi;
  dashboardPage: DashboardPage;
};

const test = baseTest.extend<IntegrationFixtures>({
  // roomApi — authenticated API context for creating/modifying data
  roomApi: async ({ playwright }, use) => {
    if (!Env.API_BASE_URL || !Env.ADMIN_USER || !Env.ADMIN_PASS) {
      throw new Error('API_BASE_URL, ADMIN_USER, and ADMIN_PASS environment variables are required');
    }

    const baseURL = Env.API_BASE_URL;
    const loginContext = await playwright.request.newContext({ baseURL });
    const loginResponse = await loginContext.post('/api/auth/login', {
      data: { username: Env.ADMIN_USER, password: Env.ADMIN_PASS },
    });

    expect(
      loginResponse.ok(),
      `API login failed — status ${loginResponse.status()}`
    ).toBeTruthy();

    const { token } = await loginResponse.json();
    expect(token, 'No token returned from login').toBeTruthy();
    await loginContext.dispose();

    const context = await playwright.request.newContext({
      baseURL,
      extraHTTPHeaders: { Cookie: `token=${token}` },
    });

    const roomApi = new RoomApi(context);
    await use(roomApi);
    await context.dispose();
  },

  // dashboardPage — authenticated browser page for UI verification
  dashboardPage: async ({ page }, use) => {
    const dashboard = new DashboardPage(page);
    await dashboard.open();
    await page.waitForLoadState('networkidle');
    await use(dashboard);
  },
});

export { test, expect };
