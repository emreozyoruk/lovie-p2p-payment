import { test, expect } from '@playwright/test';

const SENDER_EMAIL = 'samsungsarz@outlook.com';
const SENDER_PASS = 'testpass123';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(SENDER_EMAIL);
  await page.getByLabel('Password').fill(SENDER_PASS);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('**/dashboard');
}

test.describe('Shareable Link', () => {
  test('shows shareable link after creating request', async ({ page }) => {
    await login(page);
    await page.goto('/requests/new');
    await page.getByLabel('Recipient Email').fill('share-e2e@example.com');
    await page.getByLabel('Amount (USD)').fill('75');
    await page.getByLabel('Note').fill('Share test');
    await page.getByRole('button', { name: 'Send Request' }).click();
    await expect(page.getByText('Shareable Link')).toBeVisible({ timeout: 10000 });
    const linkInput = page.locator('input[readonly]');
    const shareUrl = await linkInput.inputValue();
    expect(shareUrl).toContain('/pay/');
  });

  test('public page shows request info', async ({ page }) => {
    await login(page);
    await page.goto('/requests/new');
    await page.getByLabel('Recipient Email').fill('public-e2e@example.com');
    await page.getByLabel('Amount (USD)').fill('99');
    await page.getByLabel('Note').fill('Public test');
    await page.getByRole('button', { name: 'Send Request' }).click();
    await expect(page.getByText('Shareable Link')).toBeVisible({ timeout: 10000 });
    const linkInput = page.locator('input[readonly]');
    const shareUrl = await linkInput.inputValue();
    await page.goto(shareUrl);
    await expect(page.getByText('Payment Request')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('$99.00')).toBeVisible();
  });
});
