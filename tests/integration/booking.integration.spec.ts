import { expect } from '@playwright/test';
import { test } from '../../fixtures/api.fixture.js';
import { DashboardPage } from '../../pages/dashboardPage.js';

const uniqueRoomName = `Suite-${Date.now()}`;
const targetPrice = 250;

test.describe('API-to-UI Integration Suite', () => {
  test(
    'Create a room via API and assert it renders on the Admin UI',
    async ({ roomApi, page }) => {
      // Step 1: create the room via API using the authed fixture
      const createResponse = await roomApi.createRoom({
        roomName: uniqueRoomName,
        type: 'Suite',
        accessible: true,
        image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
        description: 'Dynamically generated via backend API injection.',
        features: ['WiFi', 'TV', 'Safe'],
        roomPrice: targetPrice,
      });

      expect(
        createResponse.status(),
        `API room creation failed — ${createResponse.status()}: ${await createResponse.text()}`
      ).toBe(200);

      const createBody = await createResponse.json();
      expect(createBody.success).toBe(true);

      // Step 2: browser has valid session from storageState — navigate directly
      const dashboard = new DashboardPage(page);
      await dashboard.open();
      await page.waitForLoadState('networkidle');

      // Step 3: assert the new room appears in the admin UI
      await expect(
        dashboard.getRoomEntry(uniqueRoomName),
        `Room "${uniqueRoomName}" not found in admin UI after API creation`
      ).toBeVisible({ timeout: 15000 });
    }
  );
});