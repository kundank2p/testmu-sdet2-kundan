import { test as baseTest, expect } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';
import { RoomApi } from '../utils/roomApi.js';
import Env from '../config/env.js';

type ApiFixtures = {
  authedContext: APIRequestContext;
  roomApi: RoomApi;
};

const test = baseTest.extend<ApiFixtures>({
  authedContext: async ({ playwright }, use) => {
    if (!Env.API_BASE_URL || !Env.ADMIN_USER || !Env.ADMIN_PASS) {
      throw new Error('API_BASE_URL, ADMIN_USER, and ADMIN_PASS environment variables are required');
    }

    const baseURL = Env.API_BASE_URL;

    // Fresh login per test — tokens are short-lived on this site
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

    await use(context);
    await context.dispose();
  },

  roomApi: async ({ authedContext }, use) => {
    await use(new RoomApi(authedContext));
  },
});

export { test, expect };
