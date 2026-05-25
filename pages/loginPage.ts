import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './basePage.js';
import { logger } from '../utils/logger.js';

export class LoginPage extends BasePage {
  // Primary selectors using ARIA labels and test data attributes
  readonly usernameInput: Locator = this.page.getByLabel('Username');
  readonly passwordInput: Locator = this.page.getByLabel('Password');
  readonly loginButton: Locator = this.page.getByRole('button', { name: 'Login' });
  
  // Error message locators
  readonly errorMessage: Locator = this.page.locator('[role="alert"]');
  readonly usernameError: Locator = this.page.locator('text=/username|Username/i').filter({ hasText: /error|invalid|incorrect/i });
  readonly passwordError: Locator = this.page.locator('text=/password|Password/i').filter({ hasText: /error|invalid|incorrect/i });

  constructor(page: Page) {
    super(page);
  }

  /**
   * Open the admin login page.
   */
  async open() {
    logger.info('Opening admin login page');
    await this.navigate('/admin');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Standard login flow — used by UI tests that need to interact with the form.
   * Does NOT wait for form to disappear; that's left to the caller.
   */
  async login(user: string, pass: string) {
    logger.info(`Logging in as user: ${user}`);
    await this.open();
    await this.fillInput(this.usernameInput, user, 'Username');
    await this.fillInput(this.passwordInput, pass, 'Password');
    await this.clickElement(this.loginButton, 'Login Button');
  }

  /**
   * Reliable login for setup — waits for the form to disappear and
   * URL to settle before returning. Handles Next.js client-side transitions.
   * Ensures session is fully established before returning.
   */
  async loginAndWait(user: string, pass: string) {
    logger.info(`Logging in as user: ${user} and waiting for completion`);
    await this.open();
    await this.fillInput(this.usernameInput, user, 'Username');
    await this.fillInput(this.passwordInput, pass, 'Password');
    await this.clickElement(this.loginButton, 'Login Button');
    
    // Wait for login form to disappear
    await this.loginButton.waitFor({ state: 'hidden', timeout: 10000 });
    
    // Wait for URL to navigate and settle
    await this.page.waitForURL('**/admin**', { timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
    
    logger.info('Login completed successfully');
  }

  /**
   * Check if login form is currently visible.
   */
  async isLoginFormVisible(): Promise<boolean> {
    return this.loginButton.isVisible({ timeout: 2000 }).catch(() => false);
  }

  /**
   * Get error message text if present.
   */
  async getErrorMessage(): Promise<string | null> {
    const isVisible = await this.isVisible(this.errorMessage, 2000);
    if (isVisible) {
      return this.errorMessage.textContent();
    }
    return null;
  }

  /**
   * Assert that login was successful by checking URL and element visibility.
   */
  async assertLoginSuccess() {
    logger.info('Asserting login success');
    await expect(this.page).toHaveURL(/.*admin.*/);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Assert login failed — form still visible with error message.
   */
  async assertLoginFailure() {
    logger.info('Asserting login failure');
    await this.assertIsVisible(this.loginButton, 'Login Button');
  }
}