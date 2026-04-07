import { test, expect } from '@playwright/test';

test.describe('Responsive', () => {
  test('login works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'PayRequest' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('login works on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'PayRequest' })).toBeVisible();
  });

  test('login works on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'PayRequest' })).toBeVisible();
  });

  test('button is full width on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');
    const button = page.getByRole('button', { name: 'Sign In' });
    const box = await button.boundingBox();
    expect(box!.width).toBeGreaterThan(250);
  });
});
