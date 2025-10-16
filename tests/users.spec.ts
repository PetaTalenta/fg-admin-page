import { test, expect } from '@playwright/test';

test.describe('Users Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@futureguide.id');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard or users page
    await page.waitForURL(/\/(users)?$/, { timeout: 10000 });
  });

  test('should display users list page', async ({ page }) => {
    // Navigate to users page
    await page.goto('/users');
    
    // Check if the page title is visible
    await expect(page.locator('h1')).toContainText('User Management');
    
    // Check if filters are visible
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
    await expect(page.locator('select#user_type')).toBeVisible();
    await expect(page.locator('select#is_active')).toBeVisible();
    await expect(page.locator('select#auth_provider')).toBeVisible();
  });

  test('should display users table', async ({ page }) => {
    await page.goto('/users');
    
    // Wait for table to load
    await page.waitForSelector('table', { timeout: 10000 });
    
    // Check if table headers are visible
    await expect(page.locator('th:has-text("Username")')).toBeVisible();
    await expect(page.locator('th:has-text("Email")')).toBeVisible();
    await expect(page.locator('th:has-text("User Type")')).toBeVisible();
    await expect(page.locator('th:has-text("Status")')).toBeVisible();
    await expect(page.locator('th:has-text("Token Balance")')).toBeVisible();
  });

  test('should be able to search users', async ({ page }) => {
    await page.goto('/users');
    
    // Wait for initial load
    await page.waitForSelector('table', { timeout: 10000 });
    
    // Type in search box
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('admin');
    
    // Wait for debounce and results
    await page.waitForTimeout(1000);
    
    // Check if table is still visible (results may or may not exist)
    await expect(page.locator('table')).toBeVisible();
  });

  test('should be able to filter by user type', async ({ page }) => {
    await page.goto('/users');
    
    // Wait for initial load
    await page.waitForSelector('table', { timeout: 10000 });
    
    // Select user type filter
    await page.selectOption('select#user_type', 'admin');
    
    // Wait for results
    await page.waitForTimeout(500);
    
    // Check if table is still visible
    await expect(page.locator('table')).toBeVisible();
  });

  test('should be able to navigate to user detail', async ({ page }) => {
    await page.goto('/users');
    
    // Wait for table to load
    await page.waitForSelector('table tbody tr', { timeout: 10000 });
    
    // Click on first user link
    const firstUserLink = page.locator('table tbody tr:first-child a').first();
    if (await firstUserLink.isVisible()) {
      await firstUserLink.click();
      
      // Wait for navigation to user detail page
      await page.waitForURL(/\/users\/[^/]+$/, { timeout: 10000 });
      
      // Check if user detail page is loaded
      await expect(page.locator('button:has-text("Back to Users")')).toBeVisible();
    }
  });

  test('should display pagination if there are multiple pages', async ({ page }) => {
    await page.goto('/users');
    
    // Wait for table to load
    await page.waitForSelector('table', { timeout: 10000 });
    
    // Check if pagination exists (it may not if there's only one page)
    const paginationExists = await page.locator('nav[aria-label="Pagination"]').isVisible().catch(() => false);
    
    if (paginationExists) {
      await expect(page.locator('button:has-text("Previous")')).toBeVisible();
      await expect(page.locator('button:has-text("Next")')).toBeVisible();
    }
  });
});

test.describe('User Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@futureguide.id');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await page.waitForURL(/\/(users)?$/, { timeout: 10000 });
    
    // Navigate to users page and click first user
    await page.goto('/users');
    await page.waitForSelector('table tbody tr', { timeout: 10000 });
    
    const firstUserLink = page.locator('table tbody tr:first-child a').first();
    if (await firstUserLink.isVisible()) {
      await firstUserLink.click();
      await page.waitForURL(/\/users\/[^/]+$/, { timeout: 10000 });
    }
  });

  test('should display user information', async ({ page }) => {
    // Check if user info is visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('button:has-text("Edit User")')).toBeVisible();
  });

  test('should display tabs', async ({ page }) => {
    // Check if tabs are visible
    await expect(page.locator('button:has-text("Info")')).toBeVisible();
    await expect(page.locator('button:has-text("Tokens")')).toBeVisible();
    await expect(page.locator('button:has-text("Jobs")')).toBeVisible();
    await expect(page.locator('button:has-text("Conversations")')).toBeVisible();
  });

  test('should be able to switch tabs', async ({ page }) => {
    // Click on Tokens tab
    await page.click('button:has-text("Tokens")');
    await expect(page.locator('h2:has-text("Token Balance")')).toBeVisible();
    
    // Click on Jobs tab
    await page.click('button:has-text("Jobs")');
    await expect(page.locator('h2:has-text("User Jobs")')).toBeVisible();
    
    // Click on Conversations tab
    await page.click('button:has-text("Conversations")');
    await expect(page.locator('h2:has-text("User Conversations")')).toBeVisible();
    
    // Click back to Info tab
    await page.click('button:has-text("Info")');
    await expect(page.locator('h2:has-text("User Information")')).toBeVisible();
  });

  test('should be able to enter edit mode', async ({ page }) => {
    // Click Edit User button
    await page.click('button:has-text("Edit User")');
    
    // Check if Save and Cancel buttons appear
    await expect(page.locator('button:has-text("Save Changes")')).toBeVisible();
    await expect(page.locator('button:has-text("Cancel")')).toBeVisible();
    
    // Cancel edit
    await page.click('button:has-text("Cancel")');
    await expect(page.locator('button:has-text("Edit User")')).toBeVisible();
  });
});

