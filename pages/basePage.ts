import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { logger } from '../utils/logger.js';
import { waitForVisible, waitForPageSettle } from '../utils/waitUtils.js';

export class BasePage {
  constructor(protected page: Page) {}

  /**
   * Get the underlying page object for direct access when needed.
   */
  getPage(): Page {
    return this.page;
  }

  /**
   * Navigate to a given path or full URL.
   * Waits for the page to be ready before returning.
   */
  async navigate(path: string = '/') {
    logger.info(`Navigating to ${path}`);
    await this.page.goto(path);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click an element with visibility check and logging.
   */
  async clickElement(locator: Locator, elementName: string = 'element') {
    logger.info(`Clicking on ${elementName}`);
    await waitForVisible(locator, elementName);
    await locator.click();
  }

  /**
   * Fill input field with text.
   * Clears existing content first.
   */
  async fillInput(locator: Locator, text: string, elementName: string = 'field') {
    logger.info(`Filling ${elementName} with "${text}"`);
    await waitForVisible(locator, elementName);
    await locator.fill(''); // Clear first
    await locator.fill(text);
  }

  /**
   * Clear an input field.
   */
  async clearInput(locator: Locator, elementName: string = 'field') {
    logger.info(`Clearing ${elementName}`);
    await waitForVisible(locator, elementName);
    await locator.clear();
  }

  /**
   * Get text content from an element.
   */
  async getText(locator: Locator, elementName: string = 'element'): Promise<string> {
    logger.info(`Getting text from ${elementName}`);
    await waitForVisible(locator, elementName);
    return locator.textContent() || '';
  }

  /**
   * Check if element is visible.
   */
  async isVisible(locator: Locator, timeout: number = 5000): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if element is enabled.
   */
  async isEnabled(locator: Locator): Promise<boolean> {
    return locator.isEnabled();
  }

  /**
   * Wait for element to be visible and then assert it is visible.
   */
  async assertIsVisible(locator: Locator, elementName: string = 'element') {
    logger.info(`Asserting ${elementName} is visible`);
    await expect(locator).toBeVisible({ timeout: 10000 });
  }

  /**
   * Wait for element to be hidden and then assert it is hidden.
   */
  async assertIsHidden(locator: Locator, elementName: string = 'element') {
    logger.info(`Asserting ${elementName} is hidden`);
    await expect(locator).toBeHidden({ timeout: 10000 });
  }

  /**
   * Get current page URL.
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Wait for page to settle (networkidle + settle delay).
   * Useful for Next.js or similar SPA transitions.
   */
  async waitForPageSettle(settleMs: number = 300) {
    await waitForPageSettle(this.page, settleMs);
  }
}