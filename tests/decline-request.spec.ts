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

test.describe('Decline Request', () => {
  test('receiver can decline a request', async ({ page }) => {
    // Create as sender
    await login(page, SENDER_EMAIL, SENDER_PASS);
    await page.goto('/requests/new');
    await page.getByLabel('Recipient Email').fill(RECEIVER_EMAIL);
    await page.getByLabel('Amount (USD)').fill('45');
    await page.getByLabel('Note').fill('Decline E2E');
    await page.getByRole('button', { name: 'Send Request' }).click();
    await expect(page.getByText('Request Details')).toBeVisible({ timeout: 10000 });

    // Switch to receiver
    await page.getByRole('button', { name: 'Log out' }).click();
    await login(page, RECEIVER_EMAIL, RECEIVER_PASS);
    await page.getByRole('tab', { name: 'Incoming' }).click();
    await page.getByText('$45.00').click();
    await page.getByRole('button', { name: 'Decline' }).click();
    await expect(page.getByText('Declined')).toBeVisible({ timeout: 5000 });
  });
});
