import type { Page } from '@playwright/test';
import { LoginPage } from './loginPage.js';
import { DashboardPage } from './dashboardPage.js';

// AdminPage composes LoginPage and DashboardPage into a single entry point
// for tests that need both login and dashboard interactions.
export class AdminPage {
  readonly login: LoginPage;
  readonly dashboard: DashboardPage;

  constructor(page: Page) {
    this.login     = new LoginPage(page);
    this.dashboard = new DashboardPage(page);
  }

  // Convenience passthrough so existing tests calling adminPage.open() still work
  async open() {
    await this.dashboard.open();
  }
}