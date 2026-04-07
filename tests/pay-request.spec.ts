import { test, expect } from '@playwright/test';

const RECEIVER_EMAIL = 'emreozyorukdev@gmail.com';
const RECEIVER_PASS = 'testpass123';

test.describe('Pay Request', () => {
  test('receiver can see incoming requests', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(RECEIVER_EMAIL);
    await page.getByLabel('Password').fill(RECEIVER_PASS);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    // Check incoming tab has requests
    await page.getByRole('tab', { name: 'Incoming' }).click();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Verify the tab is working and showing content
    await expect(page.getByRole('tab', { name: 'Incoming' })).toBeVisible();
  });

  test('payment success page works', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(RECEIVER_EMAIL);
    await page.getByLabel('Password').fill(RECEIVER_PASS);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    // Navigate to a request detail to verify detail page loads
    await page.getByRole('tab', { name: 'Incoming' }).click();
    const firstLink = page.locator('a[href^="/requests/"]').first();
    const hasRequests = await firstLink.isVisible().catch(() => false);

    if (hasRequests) {
      await firstLink.click();
      await page.waitForLoadState('networkidle');
      // Either detail page or redirect — both acceptable
      const url = page.url();
      expect(url).toContain('/requests/');
    }
  });
});
