import { test, expect } from '@playwright/test';

test.describe('Test group', () => {
  test('seed', async ({ page }) => {
     await page.goto('https://moveontruckqa.bermanntms.cl/login');

  // Fill in credentials
  await page.locator('#login-usuario').fill('arivas');
  await page.locator('#login-clave').fill('arivas');

  // Click login button
  await page.locator('button.btn-success:has-text("Ingresar")').click();

  // Wait for navigation and check for success
  await page.waitForURL('https://moveontruckqa.bermanntms.cl/site');
  
  // Verify successful login by checking for a user-specific element
  await expect(page.locator('a.nav-link.dropdown-toggle.nav-user > strong')).toContainText('Angie');
  
  // Also verify the URL is correct
  await expect(page).toHaveURL('https://moveontruckqa.bermanntms.cl/site');
  });
});
