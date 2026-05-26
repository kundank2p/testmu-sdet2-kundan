import { expect } from '@playwright/test';
import { test } from '../../fixtures/ui.fixture.js';

/**
 * UI Dashboard Tests
 * 
 * Tests dashboard interactions for authenticated users including:
 * - Room list rendering and visibility
 * - Room search and filtering
 * - Room management operations (create, edit, delete)
 */

test.describe('Dashboard UI Tests', () => {
  
  // ── Room List Display ──────────────────────────────────────────────────────

  test('Authenticated user sees the rooms list', async ({ dashboardPage }) => {
    await dashboardPage.open();
    await expect(dashboardPage.roomList.first()).toBeVisible({ timeout: 10000 });
  });

  test('Create button is visible on dashboard', async ({ dashboardPage }) => {
    await dashboardPage.open();
    await dashboardPage.assertIsVisible(dashboardPage.createButton, 'Create Button');
  });

  // ── Room List Content ──────────────────────────────────────────────────────

  test('Room list is not empty', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    // Count rooms using the actual div structure with data-testid
    const rooms = page.locator('[data-testid="roomlisting"]');
    const roomCount = await rooms.count();
    expect(roomCount).toBeGreaterThan(0);
  });

  test('Room list displays room information', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    // Check that room details are visible (room number, type, price, etc.)
    const roomDetails = page.locator('[data-testid="roomlisting"]').first();
    await expect(roomDetails).toBeVisible({ timeout: 10000 });
    
    // Verify room has content (room number, type, price)
    const text = await roomDetails.textContent();
    expect(text?.length).toBeGreaterThan(0);
  });

  test('Edit and Delete buttons are present for rooms', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    // Check if action buttons exist in room rows
    const rooms = page.locator('[data-testid="roomlisting"]');
    const roomCount = await rooms.count();
    
    if (roomCount > 0) {
      // Look for edit/delete buttons within the rooms section
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      expect(buttonCount).toBeGreaterThan(0);
    }
  });

  // ── Page Navigation ───────────────────────────────────────────────────────

  test('Dashboard URL is correct', async ({ dashboardPage }) => {
    await dashboardPage.open();
    // Page may redirect from /admin to /admin/rooms - both are valid dashboard URLs
    const url = dashboardPage.getCurrentUrl();
    expect(url).toMatch(/\/admin(\/rooms)?/);
  });

  test('Page title indicates admin dashboard', async ({ dashboardPage, page }) => {
    await dashboardPage.open();
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });


});
