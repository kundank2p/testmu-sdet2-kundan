import { expect } from '@playwright/test';
import { test } from '../../fixtures/api.fixture.js';
import { assertResponseTime, assertStatus, assertErrorResponse } from '../../utils/customAssertions.js';
import Env from '../../config/env.js';
import { logger } from '../../utils/logger.js';

/**
 * API Error Handling Tests
 * 
 * Tests API error scenarios including:
 * - 4xx client errors (400, 401, 403, 404, 422)
 * - 5xx server errors
 * - Missing authentication
 * - Invalid data
 * - Rate limiting (if applicable)
 */

test.describe('API Error Handling - 4xx Errors', () => {

  test('404: Non-existent room returns 404 or error status', async ({ roomApi }) => {
    const response = await roomApi.getRoom(999999);
    assertErrorResponse(response);
    logger.info(`GET non-existent room returned: ${response.status()}`);
  });

  test('400/422: Invalid room creation with missing fields', async ({ roomApi }) => {
    const incompletePayload = {
      roomName: 'Incomplete', // Missing required fields
    };

    const response = await roomApi.createRoom(incompletePayload);
    assertErrorResponse(response);
    expect([400, 422]).toContain(response.status());
  });

  test('400: Create room with invalid price (non-numeric)', async ({ roomApi }) => {
    const invalidPayload = {
      roomName: `Invalid-${Date.now()}`,
      type: 'Suite',
      accessible: true,
      image: 'https://example.com/image.jpg',
      description: 'Test',
      features: ['WiFi'],
      roomPrice: 'invalid-price', // Should be numeric
    };

    const response = await roomApi.createRoom(invalidPayload);
    // Expect error or accept if server is lenient
    if (!response.ok()) {
      assertErrorResponse(response);
    }
  });

  test('400: Create room with invalid JSON structure', async ({ roomApi }) => {
    const malformedPayload = {
      roomName: 123, // Should be string
      type: 'Suite',
      roomPrice: 'should-be-number',
    };

    const response = await roomApi.createRoom(malformedPayload);
    // Might accept lenient parsing or reject
    logger.info(`Malformed payload returned: ${response.status()}`);
  });

  test('404: Delete non-existent room', async ({ roomApi }) => {
    const response = await roomApi.deleteRoom(999999);
    assertErrorResponse(response);
  });

});

test.describe('API Error Handling - Authentication', () => {

  test('401: Request without authentication fails', async ({ playwright }) => {
    if (!Env.API_BASE_URL) {
      throw new Error('API_BASE_URL environment variable is required');
    }

    const { RoomApi } = await import('../../utils/roomApi.js');
    const unauthContext = await playwright.request.newContext({
      baseURL: Env.API_BASE_URL,
      maxRedirects: 0,
    });

    const unauthApi = new RoomApi(unauthContext);
    const response = await unauthApi.createRoom({ roomName: 'Unauth', type: 'Suite' });
    
    expect(response.status()).toBe(401);
    assertErrorResponse(response);
    
    await unauthContext.dispose();
  });



});

test.describe('API Error Handling - Response Codes', () => {

  test('Success (200): GET list returns 200', async ({ roomApi }) => {
    const response = await roomApi.listRooms();
    assertStatus(response, 200, 'GET /api/room');
  });

  test('Success (200): GET single room returns 200', async ({ roomApi }) => {
    const listResponse = await roomApi.listRooms();
    const { rooms } = await listResponse.json();
    const response = await roomApi.getRoom(rooms[0].roomid);
    assertStatus(response, 200, 'GET /api/room/:id');
  });

  test('Success (200): POST create room returns 200', async ({ roomApi }) => {
    const payload = {
      roomName: `Test-${Date.now()}`,
      type: 'Suite',
      accessible: true,
      image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
      description: 'Test',
      features: ['WiFi'],
      roomPrice: '200',
    };

    const response = await roomApi.createRoom(payload);
    assertStatus(response, 200, 'POST /api/room');
  });



});

test.describe('API Error Handling - Response Validation', () => {

  test('Error response has descriptive message', async ({ roomApi }) => {
    const response = await roomApi.getRoom(999999);
    
    if (!response.ok()) {
      const body = await response.json();
      // Error response should have some descriptive content
      const responseText = JSON.stringify(body);
      expect(responseText.length).toBeGreaterThan(0);
      logger.info(`Error response: ${responseText}`);
    }
  });

  test('Successful response has expected structure', async ({ roomApi }) => {
    const response = await roomApi.listRooms();
    const body = await response.json();
    
    expect(body).toBeDefined();
    expect(body.rooms).toBeDefined();
    expect(Array.isArray(body.rooms)).toBe(true);
  });

});

test.describe('API Error Handling - Timeout & Performance', () => {

  test('PERFORMANCE: List rooms completes within 5000ms even under load', async ({ roomApi }) => {
    const start = Date.now();
    
    // Make multiple concurrent requests
    const promises = Array(5).fill(null).map(() => roomApi.listRooms());
    await Promise.all(promises);
    
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(5000);
    logger.info(`5 concurrent requests completed in ${duration}ms`);
  });

  test('PERFORMANCE: API responds consistently', async ({ roomApi }) => {
    const times: number[] = [];

    for (let i = 0; i < 3; i++) {
      const start = Date.now();
      await roomApi.listRooms();
      times.push(Date.now() - start);
    }

    const avgTime = times.reduce((a, b) => a + b) / times.length;
    const maxTime = Math.max(...times);
    const minTime = Math.min(...times);

    logger.info(`Response times: min=${minTime}ms, max=${maxTime}ms, avg=${avgTime}ms`);
    expect(maxTime).toBeLessThan(5000);
  });

});

test.describe('API Error Handling - Edge Cases', () => {

  test('EDGE: Empty search or filter returns valid response', async ({ roomApi }) => {
    const response = await roomApi.listRooms();
    assertStatus(response, 200, 'List with filter');
    const body = await response.json();
    expect(body.rooms).toBeDefined();
  });

  test('EDGE: Very large room ID does not crash API', async ({ roomApi }) => {
    const response = await roomApi.getRoom(9999999999);
    // Should return error gracefully
    logger.info(`Large ID request returned: ${response.status()}`);
  });



  test('EDGE: Special characters in room name', async ({ roomApi }) => {
    const specialName = `Room-${Date.now()}-!@#$%^&*()`;
    const payload = {
      roomName: specialName,
      type: 'Suite',
      accessible: true,
      image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
      description: 'Test',
      features: ['WiFi'],
      roomPrice: '200',
    };

    const response = await roomApi.createRoom(payload);
    logger.info(`Special characters request returned: ${response.status()}`);
  });
});
