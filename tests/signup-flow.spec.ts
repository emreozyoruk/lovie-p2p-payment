import { test, expect } from '@playwright/test';

const TEST_EMAIL = `lovietest${Date.now()}@test.com`;
const TEST_PASS = 'testpass123';

test.describe('Signup Flow', () => {
  test('can signup, login, and create a request', async ({ page }) => {
    // Go to login page
    await page.goto('http://localhost:3000/login');
    await expect(page.getByRole('heading', { name: 'PayRequest' })).toBeVisible();

    // Click Sign Up
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Fill signup form
    await page.getByLabel('Email').fill(TEST_EMAIL);
    await page.getByLabel('Password').fill(TEST_PASS);
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Should see success message
    await expect(page.getByText('Account created')).toBeVisible({ timeout: 10000 });

    // Now sign in
    await page.getByLabel('Email').fill(TEST_EMAIL);
    await page.getByLabel('Password').fill(TEST_PASS);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    // Should see dashboard
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Create a request
    await page.getByRole('link', { name: '+ New Request' }).click();
    await expect(page.getByText('New Payment Request')).toBeVisible();
    await page.getByLabel('Recipient Email').fill('samsungsarz@outlook.com');
    await page.getByLabel('Amount (USD)').fill('75');
    await page.getByLabel('Note').fill('Signup test request');
    await page.getByRole('button', { name: 'Send Request' }).click();

    // Should see detail page with request
    await expect(page.getByText('Request Details')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('$75.00')).toBeVisible();
  });
});
