import { test, expect } from '@playwright/test';

const SENDER_EMAIL = 'samsungsarz@outlook.com';
const SENDER_PASS = 'testpass123';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(SENDER_EMAIL);
  await page.getByLabel('Password').fill(SENDER_PASS);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('**/dashboard', { timeout: 15000 });
}

test.describe('Shareable Link', () => {
  test('creates request with shareable link', async ({ page }) => {
    await login(page);
    await page.goto('/requests/new');
    await page.getByLabel('Recipient Email').fill('share-e2e@example.com');
    await page.getByLabel('Amount (USD)').fill('75');
    await page.getByLabel('Note').fill('Share test');
    await page.getByRole('button', { name: 'Send Request' }).click();
    await expect(page.getByText('Request Details')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('$75.00')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy' })).toBeVisible();
  });

  test('public shareable page shows request info', async ({ page }) => {
    await login(page);
    await page.goto('/requests/new');
    await page.getByLabel('Recipient Email').fill('public-e2e@example.com');
    await page.getByLabel('Amount (USD)').fill('99');
    await page.getByLabel('Note').fill('Public test');
    await page.getByRole('button', { name: 'Send Request' }).click();
    await expect(page.getByText('Request Details')).toBeVisible({ timeout: 10000 });

    // Get shareable link from the readonly input
    const linkInput = page.locator('input[readonly]');
    await expect(linkInput).toBeVisible({ timeout: 5000 });
    const shareUrl = await linkInput.inputValue();

    // Visit the public page
    await page.goto(shareUrl);
    await expect(page.getByText('Payment Request')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('$99.00')).toBeVisible();
  });
});
