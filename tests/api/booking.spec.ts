import { expect } from '@playwright/test';
import { test } from '../../fixtures/api.fixture.js';
import { roomListSchema, roomSchema } from '../../schemas/room.schema.js';
import { assertResponseTime, assertStatus, assertErrorResponse } from '../../utils/customAssertions.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join } from 'path';
import { logger } from '../../utils/logger.js';

/**
 * API Tests for Room Management
 * 
 * Comprehensive CRUD operation tests with schema validation, response time assertions,
 * error handling, and data-driven parameterized test scenarios.
 */

interface RoomScenario {
  scenario: string;
  payload: object;
  expectedStatus: number;
  isValid: boolean;
}

const validRooms = JSON.parse(
  readFileSync(
    join(fileURLToPath(new URL('.', import.meta.url)), '../../test-data/rooms.json'),
    'utf-8'
  )
) as RoomScenario[];

const invalidRooms = JSON.parse(
  readFileSync(
    join(fileURLToPath(new URL('.', import.meta.url)), '../../test-data/invalidRooms.json'),
    'utf-8'
  )
) as RoomScenario[];

test.describe('Room API - CRUD Operations', () => {

  // ── CREATE Operations ──────────────────────────────────────────────────────

  test('CREATE: Data-driven valid rooms', async ({ roomApi }) => {
    for (const { scenario, payload, expectedStatus } of validRooms) {
      logger.info(`Testing: ${scenario}`);
      const response = await roomApi.createRoom(payload);
      assertStatus(response, expectedStatus, scenario);
      const body = await response.json();
      expect(body.success, `${scenario} should succeed`).toBe(true);
    }
  });

  // ── READ Operations ───────────────────────────────────────────────────────

  test('READ: Get room list returns valid schema', async ({ roomApi }) => {
    const response = await roomApi.listRooms();
    assertStatus(response, 200, 'List rooms');

    const body = await response.json();
    const parsed = roomListSchema.safeParse(body);
    expect(
      parsed.success,
      `Schema mismatch: ${JSON.stringify(parsed.error?.format())}`
    ).toBeTruthy();
  });

  test('READ: Room list contains array of rooms', async ({ roomApi }) => {
    const response = await roomApi.listRooms();
    const body = await response.json();
    
    expect(body.rooms).toBeDefined();
    expect(Array.isArray(body.rooms), 'rooms should be an array').toBe(true);
    expect(body.rooms.length, 'room list should not be empty').toBeGreaterThan(0);
  });

  test('READ: Get single room by ID', async ({ roomApi }) => {
    // First get the list to find a valid room ID
    const listResponse = await roomApi.listRooms();
    const { rooms } = await listResponse.json();
    const firstRoomId = rooms[0].roomid;

    // Fetch that specific room
    const response = await roomApi.getRoom(firstRoomId);
    assertStatus(response, 200, 'Get single room');

    const room = await response.json();
    expect(room.roomid).toBe(firstRoomId);
    expect(room.roomName).toBeDefined();
  });

  test('READ: Each room in list has required fields', async ({ roomApi }) => {
    const response = await roomApi.listRooms();
    const { rooms } = await response.json();

    for (const room of rooms.slice(0, 5)) {
      // Validate against schema
      const parsed = roomSchema.safeParse(room);
      expect(parsed.success, `Room ${room.roomid} fails schema validation`).toBe(true);
    }
  });

  // ── Response Time Assertions ───────────────────────────────────────────────

  test('PERFORMANCE: Room list responds within 2000ms', async ({ roomApi }) => {
    await assertResponseTime(() => roomApi.listRooms(), 2000);
  });

  test('PERFORMANCE: Get single room responds within 2000ms', async ({ roomApi }) => {
    const listResponse = await roomApi.listRooms();
    const { rooms } = await listResponse.json();
    const roomId = rooms[0].roomid;

    await assertResponseTime(() => roomApi.getRoom(roomId), 2000);
  });

  test('PERFORMANCE: Create room responds within 3000ms', async ({ roomApi }) => {
    const payload = {
      roomName: `Perf-${Date.now()}`,
      type: 'Suite',
      accessible: true,
      image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
      description: 'Performance test',
      features: ['WiFi'],
      roomPrice: '300',
    };

    await assertResponseTime(() => roomApi.createRoom(payload), 3000);
  });
});

test.describe('Room API - Error Handling', () => {

  // ── Invalid Input Handling ────────────────────────────────────────────────

  test('ERROR: Create room with missing required fields', async ({ roomApi }) => {
    const incompletePayload = {
      roomName: 'Incomplete',
      // Missing other required fields
    };

    const response = await roomApi.createRoom(incompletePayload);
    assertErrorResponse(response);
  });

  test('ERROR: Get non-existent room returns error', async ({ roomApi }) => {
    const response = await roomApi.getRoom(999999);
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('ERROR: Delete non-existent room returns error', async ({ roomApi }) => {
    const response = await roomApi.deleteRoom(999999);
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  // ── Response Code Validation ──────────────────────────────────────────────

  test('RESPONSE CODES: 200 for successful operations', async ({ roomApi }) => {
    const listResponse = await roomApi.listRooms();
    expect(listResponse.status()).toBe(200);
  });

  });


test.describe('Room API - Schema Validation', () => {

  test('SCHEMA: Room list matches expected schema', async ({ roomApi }) => {
    const response = await roomApi.listRooms();
    const body = await response.json();
    const parsed = roomListSchema.safeParse(body);
    
    expect(parsed.success, `Schema validation failed: ${JSON.stringify(parsed.error?.format())}`).toBe(true);
  });

  test('SCHEMA: Each room matches room schema', async ({ roomApi }) => {
    const response = await roomApi.listRooms();
    const { rooms } = await response.json();

    for (const room of rooms.slice(0, 10)) {
      const parsed = roomSchema.safeParse(room);
      expect(parsed.success, `Room ${room.roomid} schema validation failed`).toBe(true);
    }
  });
});
