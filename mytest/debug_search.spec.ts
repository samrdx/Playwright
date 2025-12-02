import { test } from '@playwright/test';

test('Debug - Test DataTables search behavior', async ({ page }) => {
  // Login
  await page.goto('https://moveontruckqa.bermanntms.cl/login');
  await page.locator('#login-usuario').fill('arivas');
  await page.locator('#login-clave').fill('arivas');
  await page.locator('button.btn-success:has-text("Ingresar")').click();
  await page.waitForURL('https://moveontruckqa.bermanntms.cl/site');
  
  // Navigate to listado
  await page.goto('https://moveontruckqa.bermanntms.cl/viajes/listado');
  await page.waitForLoadState('networkidle');
  
  // Wait for table to load
  await page.locator('table tbody').isVisible({ timeout: 10000 });
  
  // Try searching for a known Nro Viaje value
  const testId = '4125';
  console.log(`\nSearching for known Nro Viaje: ${testId}`);
  
  const searchInput = page.locator('input[type="search"], .dataTables_filter input').first();
  if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    console.log('Found search input, filling with:', testId);
    await searchInput.fill(testId);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    // Check what rows are visible after search
    const visibleRows = await page.evaluate(() => {
      const tbody = document.querySelector('table tbody');
      if (!tbody) return [];
      const rows = Array.from(tbody.querySelectorAll('tr'));
      return rows.map((row) => {
        const cells = Array.from(row.querySelectorAll('td'));
        return cells.map(c => c.textContent?.trim().substring(0, 30) || '');
      });
    });
    
    console.log(`\nRows after search for "${testId}":`);
    visibleRows.slice(0, 3).forEach((row, idx) => {
      console.log(`  Row ${idx}:`, row);
    });
  } else {
    console.log('No search input found');
  }
});
