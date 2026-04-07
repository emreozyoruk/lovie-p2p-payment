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

test.describe('Expiration', () => {
  test('shows countdown on pending request', async ({ page }) => {
    await login(page);
    await page.goto('/requests/new');
    await page.getByLabel('Recipient Email').fill('expiry-e2e@example.com');
    await page.getByLabel('Amount (USD)').fill('10');
    await page.getByRole('button', { name: 'Send Request' }).click();
    await expect(page.getByText('Request Details')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Expires in/)).toBeVisible();
  });
});
