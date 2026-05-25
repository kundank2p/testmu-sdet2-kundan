import { expect, type APIResponse } from '@playwright/test';
import { logger } from './logger.js';

/**
 * Custom assertion utilities for API testing.
 * Provides reusable, descriptive assertions for common API test scenarios.
 */

/**
 * Asserts an API response completed within the given time limit.
 *
 * @example
 * const response = await assertResponseTime(() => api.listRooms(), 2000);
 */
export async function assertResponseTime(
  fn: () => Promise<APIResponse>,
  maxMs: number = 2000
): Promise<APIResponse> {
  const start = Date.now();
  const response = await fn();
  const duration = Date.now() - start;

  logger.info(`Response time: ${duration}ms (limit: ${maxMs}ms)`);
  expect(
    duration,
    `Response took ${duration}ms — exceeds the ${maxMs}ms limit`
  ).toBeLessThan(maxMs);

  return response;
}

/**
 * Asserts a response status matches the expected value with a clear message.
 */
export function assertStatus(
  response: APIResponse,
  expectedStatus: number,
  context: string = ''
): void {
  expect(
    response.status(),
    `${context ? context + ' — ' : ''}Expected ${expectedStatus} but got ${response.status()}`
  ).toBe(expectedStatus);
}

/**
 * Asserts a response is not ok (status >= 400).
 */
export function assertErrorResponse(response: APIResponse): void {
  expect(
    response.ok(),
    `Expected an error response but got ${response.status()}`
  ).toBeFalsy();
  expect(response.status()).toBeGreaterThanOrEqual(400);
}

/**
 * Asserts a response is successful (status 200-299).
 */
export function assertSuccessResponse(response: APIResponse, context: string = ''): void {
  expect(
    response.ok(),
    `${context ? context + ' — ' : ''}Expected success response but got ${response.status()}`
  ).toBeTruthy();
}

/**
 * Asserts response has a specific header value.
 */
export function assertResponseHeader(
  response: APIResponse,
  headerName: string,
  expectedValue?: string,
  context: string = ''
): void {
  const headerValue = response.headers()[headerName.toLowerCase()];
  
  if (expectedValue) {
    expect(
      headerValue,
      `${context ? context + ' — ' : ''}Header "${headerName}" expected "${expectedValue}" but got "${headerValue}"`
    ).toBe(expectedValue);
  } else {
    expect(
      headerValue,
      `${context ? context + ' — ' : ''}Header "${headerName}" should be present`
    ).toBeDefined();
  }
}

/**
 * Asserts response body contains expected data.
 */
export async function assertResponseBodyContains(
  response: APIResponse,
  expectedKeys: string[],
  context: string = ''
): Promise<void> {
  const body = await response.json();
  
  for (const key of expectedKeys) {
    expect(
      body[key],
      `${context ? context + ' — ' : ''}Response body missing key "${key}"`
    ).toBeDefined();
  }
}

/**
 * Asserts response is JSON parseable.
 */
export async function assertResponseIsJson(
  response: APIResponse,
  context: string = ''
): Promise<void> {
  try {
    await response.json();
  } catch {
    throw new Error(
      `${context ? context + ' — ' : ''}Response is not valid JSON`
    );
  }
}

/**
 * Asserts response contains specific text.
 */
export async function assertResponseContainsText(
  response: APIResponse,
  text: string,
  context: string = ''
): Promise<void> {
  const responseText = await response.text();
  expect(
    responseText.includes(text),
    `${context ? context + ' — ' : ''}Response does not contain "${text}"`
  ).toBe(true);
}
