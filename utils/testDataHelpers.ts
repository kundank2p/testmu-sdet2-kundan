import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { logger } from './logger.js';

/**
 * Test Data Utilities
 * 
 * Helpers for loading and managing test data from external files (JSON, CSV, etc.).
 * Enables data-driven testing with externalized test scenarios.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

/**
 * Load JSON test data file from test-data directory.
 * 
 * @example
 * const loginScenarios = loadTestData('user.json');
 * const roomPayloads = loadTestData('rooms.json');
 */
export function loadTestData<T>(filename: string): T {
  try {
    const filePath = join(PROJECT_ROOT, 'test-data', filename);
    const fileContent = readFileSync(filePath, 'utf-8');
    logger.info(`Loaded test data from ${filename}`);
    return JSON.parse(fileContent) as T;
  } catch (error) {
    logger.error(`Failed to load test data ${filename}: ${error}`);
    throw new Error(`Unable to load test data: ${filename}`);
  }
}

/**
 * Generate test data with unique identifiers (useful for data that needs to be unique).
 * 
 * @example
 * const uniqueRoom = generateUniqueData('roomName', 'Test-Room');
 */
export function generateUniqueData(fieldValue: string, prefix: string = ''): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix ? prefix + '-' : ''}${fieldValue}-${timestamp}-${random}`;
}

/**
 * Merge multiple test data sets.
 * 
 * @example
 * const allScenarios = mergeTestData(validRooms, invalidRooms, edgeCaseRooms);
 */
export function mergeTestData<T>(...datasets: T[][]): T[] {
  return datasets.reduce((acc, dataset) => [...acc, ...dataset], []);
}

/**
 * Filter test data by a predicate function.
 * 
 * @example
 * const validScenarios = filterTestData(allRooms, r => r.isValid === true);
 */
export function filterTestData<T>(data: T[], predicate: (item: T) => boolean): T[] {
  return data.filter(predicate);
}

/**
 * Create a parameterized test data set from template and variants.
 * 
 * @example
 * const scenarios = parameterizeTestData(
 *   { roomType: 'Suite', accessible: true },
 *   { prices: [100, 200, 300] }
 * );
 */
export function parameterizeTestData<T extends Record<string, any>>(
  baseData: T,
  variants: Record<string, any[]>
): T[] {
  const variantKeys = Object.keys(variants);
  const variantValues = Object.values(variants);
  
  const results: T[] = [];
  const generateCombinations = (index: number, current: T) => {
    if (index === variantKeys.length) {
      results.push({ ...current });
      return;
    }
    
    const key = variantKeys[index];
    const values = variantValues[index];
    if (!values) return; // Skip if no values for this key
    
    for (const value of values) {
      generateCombinations(index + 1, { ...current, [key as keyof T]: value } as T);
    }
  };
  
  generateCombinations(0, baseData);
  return results;
}

/**
 * Get random item from array.
 * 
 * @example
 * const randomRoom = getRandomItem(rooms);
 */
export function getRandomItem<T>(items: T[]): T {
  if (items.length === 0) {
    throw new Error('Cannot get random item from empty array');
  }
  return items[Math.floor(Math.random() * items.length)]!;
}

/**
 * Chunk test data into smaller batches.
 * 
 * @example
 * const batches = chunkTestData(allRooms, 10);
 */
export function chunkTestData<T>(data: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }
  return chunks;
}
