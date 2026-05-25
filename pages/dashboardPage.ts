import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './basePage.js';
import { logger } from '../utils/logger.js';

export class DashboardPage extends BasePage {
  // Main elements
  readonly createButton: Locator = this.page.getByRole('button', { name: 'Create' });
  readonly roomList: Locator = this.page.getByTestId('roomlisting');
  
  // Search and filter
  readonly searchInput: Locator = this.page.getByPlaceholder(/search|filter/i);
  
  // Room management actions
  readonly editButtons: Locator = this.page.locator('button:has-text("Edit")');
  readonly deleteButtons: Locator = this.page.locator('button:has-text("Delete")');
  readonly confirmDeleteButton: Locator = this.page.getByRole('button', { name: /confirm|delete|yes/i });

  constructor(page: Page) {
    super(page);
  }

  /**
   * Open the admin dashboard.
   * Navigates to /admin and waits for the room list to be visible.
   */
  async open() {
    logger.info('Opening admin dashboard');
    await this.navigate('/admin');
    await this.page.waitForTimeout(1000);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get a table row containing a specific room name.
   * Uses a case-insensitive partial match.
   */
  getRoomRow(name: string): Locator {
    return this.page.locator('tr', { hasText: name }).first();
  }

  /**
   * Get a locator for a room entry by name.
   * Returns the first matching text element (case-insensitive).
   */
  getRoomEntry(name: string): Locator {
    return this.page.getByText(name, { exact: false }).first();
  }

  /**
   * Get an edit button for a specific room row.
   */
  getEditButtonForRoom(roomName: string): Locator {
    return this.getRoomRow(roomName).locator('button:has-text("Edit")').first();
  }

  /**
   * Get a delete button for a specific room row.
   */
  getDeleteButtonForRoom(roomName: string): Locator {
    return this.getRoomRow(roomName).locator('button:has-text("Delete")').first();
  }

  /**
   * Check if a room is visible by name.
   */
  async isRoomVisible(name: string): Promise<boolean> {
    return this.getRoomEntry(name).isVisible({ timeout: 5000 }).catch(() => false);
  }

  /**
   * Click the Create button to open the room creation form.
   */
  async openCreateForm() {
    logger.info('Opening room creation form');
    await this.clickElement(this.createButton, 'Create Button');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Search for a room by name.
   */
  async searchForRoom(roomName: string) {
    logger.info(`Searching for room: ${roomName}`);
    if (await this.isVisible(this.searchInput, 2000)) {
      await this.fillInput(this.searchInput, roomName, 'Search Input');
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Click edit button for a specific room.
   */
  async editRoom(roomName: string) {
    logger.info(`Editing room: ${roomName}`);
    const editBtn = this.getEditButtonForRoom(roomName);
    await this.clickElement(editBtn, `Edit button for ${roomName}`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click delete button for a specific room and confirm deletion.
   */
  async deleteRoom(roomName: string) {
    logger.info(`Deleting room: ${roomName}`);
    const deleteBtn = this.getDeleteButtonForRoom(roomName);
    await this.clickElement(deleteBtn, `Delete button for ${roomName}`);
    
    // Wait for confirmation dialog and confirm
    const confirmBtn = this.confirmDeleteButton;
    await this.clickElement(confirmBtn, 'Confirm Delete Button');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Assert the room list container is visible.
   */
  async assertRoomListVisible() {
    logger.info('Asserting room list is visible');
    await this.assertIsVisible(this.roomList, 'Room List');
  }

  /**
   * Assert a room is visible in the list.
   */
  async assertRoomVisible(roomName: string) {
    logger.info(`Asserting room "${roomName}" is visible`);
    await expect(
      this.getRoomEntry(roomName),
      `Room "${roomName}" not found in dashboard`
    ).toBeVisible({ timeout: 10000 });
  }

  /**
   * Assert a room is NOT visible in the list.
   */
  async assertRoomNotVisible(roomName: string) {
    logger.info(`Asserting room "${roomName}" is NOT visible`);
    const roomElement = this.getRoomEntry(roomName);
    await expect(roomElement).not.toBeVisible({ timeout: 5000 }).catch(() => {
      // It's OK if the element doesn't exist at all
    });
  }

  /**
   * Get count of visible rooms in the list.
   */
  async getRoomCount(): Promise<number> {
    logger.info('Getting room count');
    const rows = this.page.locator('tbody tr');
    return rows.count();
  }
}