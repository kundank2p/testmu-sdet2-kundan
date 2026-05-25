import type{ Locator } from '@playwright/test';
import { logger } from './logger.js';

/**
 * UI Assertion Utilities
 * 
 * Provides reusable, domain-specific assertions for UI testing.
 * Wraps Playwright assertions with better error messages and logging.
 */

/**
 * Assert element is visible in the viewport.
 */
export async function assertElementVisible(
  locator: Locator,
  elementName: string,
  timeout: number = 10000
): Promise<void> {
  logger.info(`Asserting ${elementName} is visible`);
  await locator.waitFor({ state: 'visible', timeout });
}

/**
 * Assert element is hidden or not visible.
 */
export async function assertElementHidden(
  locator: Locator,
  elementName: string,
  timeout: number = 5000
): Promise<void> {
  logger.info(`Asserting ${elementName} is hidden`);
  await locator.waitFor({ state: 'hidden', timeout });
}

/**
 * Assert element has expected text content (exact match).
 */
export async function assertElementText(
  locator: Locator,
  expectedText: string,
  elementName: string
): Promise<void> {
  logger.info(`Asserting ${elementName} contains text: "${expectedText}"`);
  const actualText = await locator.textContent();
  if (actualText !== expectedText) {
    throw new Error(
      `${elementName} text mismatch. Expected: "${expectedText}", Actual: "${actualText}"`
    );
  }
}

/**
 * Assert element text contains substring (partial match).
 */
export async function assertElementTextContains(
  locator: Locator,
  substring: string,
  elementName: string
): Promise<void> {
  logger.info(`Asserting ${elementName} contains substring: "${substring}"`);
  const actualText = await locator.textContent();
  if (!actualText?.includes(substring)) {
    throw new Error(
      `${elementName} does not contain "${substring}". Actual: "${actualText}"`
    );
  }
}

/**
 * Assert element is enabled (clickable, not disabled).
 */
export async function assertElementEnabled(
  locator: Locator,
  elementName: string
): Promise<void> {
  logger.info(`Asserting ${elementName} is enabled`);
  const isEnabled = await locator.isEnabled();
  if (!isEnabled) {
    throw new Error(`${elementName} is not enabled`);
  }
}

/**
 * Assert element is disabled.
 */
export async function assertElementDisabled(
  locator: Locator,
  elementName: string
): Promise<void> {
  logger.info(`Asserting ${elementName} is disabled`);
  const isEnabled = await locator.isEnabled();
  if (isEnabled) {
    throw new Error(`${elementName} is not disabled`);
  }
}

/**
 * Assert element has expected attribute value.
 */
export async function assertElementAttribute(
  locator: Locator,
  attribute: string,
  expectedValue: string,
  elementName: string
): Promise<void> {
  logger.info(`Asserting ${elementName} has attribute ${attribute}="${expectedValue}"`);
  const actualValue = await locator.getAttribute(attribute);
  if (actualValue !== expectedValue) {
    throw new Error(
      `${elementName} attribute mismatch. Expected: "${expectedValue}", Actual: "${actualValue}"`
    );
  }
}

/**
 * Assert element has expected CSS class.
 */
export async function assertElementHasClass(
  locator: Locator,
  className: string,
  elementName: string
): Promise<void> {
  logger.info(`Asserting ${elementName} has class "${className}"`);
  const classes = await locator.getAttribute('class');
  if (!classes?.includes(className)) {
    throw new Error(
      `${elementName} does not have class "${className}". Classes: "${classes}"`
    );
  }
}

/**
 * Assert input field has expected value.
 */
export async function assertInputValue(
  locator: Locator,
  expectedValue: string,
  fieldName: string
): Promise<void> {
  logger.info(`Asserting ${fieldName} has value: "${expectedValue}"`);
  const actualValue = await locator.inputValue();
  if (actualValue !== expectedValue) {
    throw new Error(
      `${fieldName} value mismatch. Expected: "${expectedValue}", Actual: "${actualValue}"`
    );
  }
}

/**
 * Assert multiple elements are visible.
 */
export async function assertAllElementsVisible(
  locators: Locator[],
  elementName: string,
  timeout: number = 5000
): Promise<void> {
  logger.info(`Asserting ${locators.length} ${elementName} elements are visible`);
  for (const locator of locators) {
    await locator.waitFor({ state: 'visible', timeout });
  }
}
