import { logger } from './logger.js';

/**
 * Retries an async function up to `retries` times with delay between attempts.
 *
 * @example
 * const response = await retry(() => api.createRoom(payload), 3, 500);
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 500
): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) {
        logger.error(`All ${retries} attempts failed. Last error: ${err}`);
        throw err;
      }
      logger.warn(`Attempt ${attempt} failed — retrying in ${delayMs}ms`);
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
  throw new Error('retry exhausted');
}