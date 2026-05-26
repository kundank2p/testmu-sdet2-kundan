import { expect } from '@playwright/test';
import { test } from '../../fixtures/integration.fixture.js';

const uniqueRoomName = `Suite-${Date.now()}`;
const targetPrice = 250;

test.describe('API-to-UI Integration Suite', () => {
  test(
    'Create a room via API and assert it renders on the Admin UI',
    async ({ roomApi, dashboardPage }) => {
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

      // Step 2: Refresh dashboard to load newly created room
      const page = dashboardPage.getPage();
      try {
        await page.reload({ waitUntil: 'networkidle' });
      } catch (error: any) {
        // If reload is interrupted by navigation (webkit), just wait for settlement
        if (error.message?.includes('interrupted')) {
          await page.waitForLoadState('networkidle');
        } else {
          throw error;
        }
      }

      // Step 3: assert the new room appears in the admin UI
      await expect(
        dashboardPage.getRoomEntry(uniqueRoomName),
        `Room "${uniqueRoomName}" not found in admin UI after API creation`
      ).toBeVisible({ timeout: 15000 });
    }
  );
});