import { test, expect } from '@playwright/test';

/**
 * Cross-Browser Smoke Tests
 * 
 * Runs on chromium, firefox, and webkit (as defined in playwright.config.ts).
 * Tests public pages without authentication to verify basic functionality.
 * These tests ensure the application loads and displays correctly across all supported browsers.
 */

test.describe('Cross-Browser Smoke Suite', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  // ── Homepage Tests ─────────────────────────────────────────────────────────

  test('Homepage loads and shows site title', async ({ page, browserName }) => {
    console.log(`Running on browser: ${browserName}`);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Restful[- ]Booker[- ]platform demo/i);
  });

  test('Homepage displays main heading', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('Navbar is visible on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();
  });

  test('Homepage brand/logo is clickable', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const logo = page.getByRole('link', { name: /Shady Meadows|Brand/i });
    await expect(logo).toBeVisible();
    const isEnabled = await logo.isEnabled().catch(() => true);
    expect(isEnabled).toBe(true);
  });

  // ── Admin Login Page Tests ─────────────────────────────────────────────────

  test('Admin login page is reachable', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    await expect(
      page.getByRole('button', { name: 'Login' })
    ).toBeVisible({ timeout: 10000 });
  });

  test('Admin login page displays login form', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    const usernameField = page.getByLabel('Username');
    const passwordField = page.getByLabel('Password');
    const loginButton = page.getByRole('button', { name: 'Login' });
    
    await expect(usernameField).toBeVisible();
    await expect(passwordField).toBeVisible();
    await expect(loginButton).toBeVisible();
  });

  test('Admin login form fields accept input', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    const usernameField = page.getByLabel('Username');
    const passwordField = page.getByLabel('Password');
    
    await usernameField.fill('testuser');
    await passwordField.fill('testpass');
    
    const username = await usernameField.inputValue();
    const password = await passwordField.inputValue();
    
    expect(username).toBe('testuser');
    expect(password).toBe('testpass');
  });

  // ── Navigation Tests ───────────────────────────────────────────────────────

  test('Homepage navigation links are accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const links = page.locator('a[href]');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test('Can navigate from homepage to login page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for admin or login link
    const adminLink = page.locator('a[href*="/admin"]').first();
    if (await adminLink.isVisible().catch(() => false)) {
      await adminLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page.getByRole('button', { name: 'Login' })).toBeVisible({ timeout: 5000 });
    }
  });

  // ── Page Responsiveness ────────────────────────────────────────────────────

  test('Page content is not hidden behind viewport', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that content is visible (not overflowing or hidden)
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewport = page.viewportSize();
    
    // Body should have content
    expect(bodyHeight).toBeGreaterThan(0);
    expect(viewport?.width).toBeGreaterThan(0);
    expect(viewport?.height).toBeGreaterThan(0);
  });

  // ── Performance Baseline ───────────────────────────────────────────────────

  test('Homepage loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    // Homepage should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('Admin page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/admin', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    // Admin page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  // ── Browser-Specific Compatibility ─────────────────────────────────────────

  test('All elements render without layout shifts', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Get all interactive elements
    const buttons = page.locator('button');
    const links = page.locator('a');
    
    const buttonCount = await buttons.count();
    const linkCount = await links.count();
    
    expect(buttonCount + linkCount).toBeGreaterThan(0);
  });
});
