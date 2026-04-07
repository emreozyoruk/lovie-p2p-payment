import { test, expect } from '@playwright/test';

const SENDER_EMAIL = 'samsungsarz@outlook.com';
const SENDER_PASS = 'testpass123';
const RECEIVER_EMAIL = 'emreozyorukdev@gmail.com';

async function login(page: import('@playwright/test').Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('**/dashboard');
}

test.describe('Create Request', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, SENDER_EMAIL, SENDER_PASS);
  });

  test('can open create request page', async ({ page }) => {
    await page.getByRole('link', { name: '+ New Request' }).click();
    await expect(page.getByText('New Payment Request')).toBeVisible();
  });

  test('shows error for self-request', async ({ page }) => {
    await page.goto('/requests/new');
    await page.getByLabel('Recipient Email').fill(SENDER_EMAIL);
    await page.getByLabel('Amount (USD)').fill('50');
    await page.getByRole('button', { name: 'Send Request' }).click();
    await expect(page.getByText("You can't request money from yourself")).toBeVisible();
  });

  test('shows error for zero amount', async ({ page }) => {
    await page.goto('/requests/new');
    await page.getByLabel('Recipient Email').fill('other@example.com');
    await page.getByLabel('Amount (USD)').fill('0');
    await page.getByRole('button', { name: 'Send Request' }).click();
    await expect(page.getByText('Amount must be greater than zero')).toBeVisible();
  });

  test('creates request and shows detail with shareable link', async ({ page }) => {
    await page.goto('/requests/new');
    await page.getByLabel('Recipient Email').fill(RECEIVER_EMAIL);
    await page.getByLabel('Amount (USD)').fill('25.50');
    await page.getByLabel('Note').fill('Test request');
    await page.getByRole('button', { name: 'Send Request' }).click();
    await expect(page.getByText('Request Details')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('$25.50')).toBeVisible();
    await expect(page.getByText('Shareable Link')).toBeVisible();
  });
});
