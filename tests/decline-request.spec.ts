import { test, expect } from '@playwright/test';

const SENDER_EMAIL = 'samsungsarz@outlook.com';
const SENDER_PASS = 'testpass123';
const RECEIVER_EMAIL = 'emreozyorukdev@gmail.com';

test.describe('Decline Request', () => {
  test('sender creates request and sees Cancel button', async ({ page }) => {
    // Login as sender
    await page.goto('/login');
    await page.getByLabel('Email').fill(SENDER_EMAIL);
    await page.getByLabel('Password').fill(SENDER_PASS);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    // Create a request
    await page.goto('/requests/new');
    await page.getByLabel('Recipient Email').fill(RECEIVER_EMAIL);
    await page.getByLabel('Amount (USD)').fill('45');
    await page.getByLabel('Note').fill('Decline E2E');
    await page.getByRole('button', { name: 'Send Request' }).click();
    await expect(page.getByText('Request Details')).toBeVisible({ timeout: 10000 });

    // As sender, should see Cancel button (not Pay/Decline)
    await expect(page.getByRole('button', { name: 'Cancel Request' })).toBeVisible();
    await expect(page.getByText('Pending')).toBeVisible();
  });
});
