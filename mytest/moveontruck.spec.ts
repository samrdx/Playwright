import { test, expect } from '@playwright/test';

test('Navigate to Listado Rutas', async ({ page }) => {
  // 1. Navigate to login page
  await page.goto('https://moveontruckqa.bermanntms.cl/login');

  // 2. Log in
  await page.fill('#login-usuario', 'arivas');
  await page.fill('#login-clave', 'arivas');
  
  // 3. Click Login button
  await page.click('button.btn-success');

  // Wait for navigation to complete or for a specific element on the dashboard
  await page.waitForLoadState('networkidle');

  // 4. Click "Tarificador" menu
  // Using the XPath identified by the browser subagent
  await page.click("//a[contains(., 'Tarificador') or .//span[contains(., 'Tarificador')]]");

  // 5. Click "Listado Rutas"
  // Using the XPath identified by the browser subagent
  await page.click("//a[contains(., 'Listado Rutas') or .//span[contains(., 'Listado Rutas')]]");

  // Assertion: Verify we are on the "Listado Rutas" page
  await expect(page).toHaveURL(/.*\/ruta\/index/);
});
