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

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('shows dashboard with tabs', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Incoming' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Outgoing' })).toBeVisible();
  });

  test('shows new request button', async ({ page }) => {
    await expect(page.getByRole('link', { name: '+ New Request' })).toBeVisible();
  });

  test('can switch tabs', async ({ page }) => {
    await page.getByRole('tab', { name: 'Outgoing' }).click();
    await expect(page.getByRole('tab', { name: 'Outgoing' })).toBeVisible();
    await page.getByRole('tab', { name: 'Incoming' }).click();
    await expect(page.getByRole('tab', { name: 'Incoming' })).toBeVisible();
  });

  test('shows search and filter', async ({ page }) => {
    await expect(page.getByPlaceholder('Search by email...')).toBeVisible();
    await expect(page.locator('select')).toBeVisible();
  });

  test('shows outgoing requests after creating one', async ({ page }) => {
    await page.goto('/requests/new');
    await page.getByLabel('Recipient Email').fill('dashboard-test@example.com');
    await page.getByLabel('Amount (USD)').fill('15');
    await page.getByRole('button', { name: 'Send Request' }).click();
    await expect(page.getByText('Request Details')).toBeVisible({ timeout: 10000 });
    await page.goto('/dashboard');
    await page.getByRole('tab', { name: 'Outgoing' }).click();
    await expect(page.getByText('dashboard-test@example.com').first()).toBeVisible({ timeout: 5000 });
  });
});
