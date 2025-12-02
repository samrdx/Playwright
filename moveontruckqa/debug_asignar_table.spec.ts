import { test } from '@playwright/test';

test('Debug - Inspect asignar table structure', async ({ page }) => {
  // Login
  await page.goto('https://moveontruckqa.bermanntms.cl/login');
  await page.locator('#login-usuario').fill('arivas');
  await page.locator('#login-clave').fill('arivas');
  await page.locator('button.btn-success:has-text("Ingresar")').click();
  await page.waitForURL('https://moveontruckqa.bermanntms.cl/site');
  
  // Navigate to asignar
  await page.goto('https://moveontruckqa.bermanntms.cl/viajes/asignar');
  await page.waitForLoadState('networkidle');
  
  // Wait for table to load
  await page.locator('table tbody').isVisible({ timeout: 10000 });
  
  // Get table headers
  const headers = await page.locator('table thead th').allTextContents();
  console.log('\n=== TABLE HEADERS ===');
  headers.forEach((h, i) => {
    console.log(`[${i}] ${h.trim()}`);
  });
  
  // Get first row data
  const firstRow = await page.locator('table tbody tr').first();
  const cells = await firstRow.locator('td').allTextContents();
  console.log('\n=== FIRST ROW DATA ===');
  cells.forEach((c, i) => {
    console.log(`[${i}] ${c.trim().substring(0, 100)}`);
  });
  
  // Get HTML structure of first row
  const rowHtml = await firstRow.evaluate(el => el.outerHTML);
  console.log('\n=== FIRST ROW HTML ===');
  console.log(rowHtml.substring(0, 500));
  
  // Get table HTML (first 2000 chars)
  const tableHtml = await page.locator('table').first().evaluate(el => el.outerHTML);
  console.log('\n=== TABLE HTML (first 2000 chars) ===');
  console.log(tableHtml.substring(0, 2000));
  
  // Try to find which column contains "Nro de Viaje" or similar text
  console.log('\n=== SEARCHING FOR "NRO" COLUMN ===');
  const theadCells = await page.locator('table thead th').all();
  for (let i = 0; i < theadCells.length; i++) {
    const text = await theadCells[i].textContent();
    if (text?.toLowerCase().includes('nro') || text?.toLowerCase().includes('viaje')) {
      console.log(`Found at column ${i}: "${text?.trim()}"`);
    }
  }
  
  // Get all visible row data
  console.log('\n=== ALL VISIBLE ROWS ===');
  const rows = await page.locator('table tbody tr').all();
  console.log(`Total rows: ${rows.length}`);
  for (let i = 0; i < Math.min(3, rows.length); i++) {
    const rowCells = await rows[i].locator('td').allTextContents();
    console.log(`Row ${i}:`, rowCells.map(c => c.trim().substring(0, 50)));
  }
});
