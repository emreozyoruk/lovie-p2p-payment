import { test, expect } from '@playwright/test';

const SENDER_EMAIL = 'samsungsarz@outlook.com';
const SENDER_PASS = 'testpass123';
const RECEIVER_EMAIL = 'emreozyorukdev@gmail.com';
const RECEIVER_PASS = 'testpass123';

async function login(page: import('@playwright/test').Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('**/dashboard');
}

test.describe('Pay Request', () => {
  test('full pay flow — create, switch user, pay', async ({ page }) => {
    // Create as sender
    await login(page, SENDER_EMAIL, SENDER_PASS);
    await page.goto('/requests/new');
    await page.getByLabel('Recipient Email').fill(RECEIVER_EMAIL);
    await page.getByLabel('Amount (USD)').fill('30');
    await page.getByLabel('Note').fill('Pay test');
    await page.getByRole('button', { name: 'Send Request' }).click();
    await expect(page.getByText('Request Details')).toBeVisible({ timeout: 10000 });

    // Logout
    await page.getByRole('button', { name: 'Log out' }).click();

    // Login as receiver
    await login(page, RECEIVER_EMAIL, RECEIVER_PASS);
    await page.getByRole('tab', { name: 'Incoming' }).click();
    await page.getByText('$30.00').click();

    // Pay
    await expect(page.getByRole('button', { name: 'Pay' })).toBeVisible();
    await page.getByRole('button', { name: 'Pay' }).click();
    await expect(page.getByText('Processing payment...')).toBeVisible();
    await expect(page.getByText('Payment Done!')).toBeVisible({ timeout: 10000 });
  });
});
