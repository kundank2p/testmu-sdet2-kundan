import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage.js';
import Env from '../../config/env.js';
import fs from 'fs';

const AUTH_FILE = '.auth/user.json';

setup('authenticate as admin and save session', async ({ page }) => {
  if (!Env.ADMIN_USER || !Env.ADMIN_PASS) {
    throw new Error('ADMIN_USER and ADMIN_PASS environment variables are required');
  }

  const loginPage = new LoginPage(page);

  await loginPage.loginAndWait(Env.ADMIN_USER, Env.ADMIN_PASS);
  await expect(page).toHaveURL(/.*admin.*/);

  fs.mkdirSync('.auth', { recursive: true });
  await page.context().storageState({ path: AUTH_FILE });
});