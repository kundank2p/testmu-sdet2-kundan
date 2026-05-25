import type{ Page, Locator } from '@playwright/test';
import { logger } from './logger.js';

/**
 * Waits for a locator to be visible with a descriptive log message.
 */
export async function waitForVisible(
  locator: Locator,
  description: string,
  timeout: number = 10000
): Promise<void> {
  logger.info(`Waiting for "${description}" to be visible`);
  await locator.waitFor({ state: 'visible', timeout });
}

/**
 * Waits for a locator to be hidden with a descriptive log message.
 */
export async function waitForHidden(
  locator: Locator,
  description: string,
  timeout: number = 10000
): Promise<void> {
  logger.info(`Waiting for "${description}" to be hidden`);
  await locator.waitFor({ state: 'hidden', timeout });
}

/**
 * Waits for network to be idle then waits an additional settle period.
 * Use when networkidle fires too early (e.g. Next.js client-side transitions).
 */
export async function waitForPageSettle(
  page: Page,
  settleMs: number = 300
): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(settleMs);
}