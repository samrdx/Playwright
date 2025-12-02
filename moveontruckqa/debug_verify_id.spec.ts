import { test } from '@playwright/test';

test('Debug - Check what Nro de Viaje values exist in asignar table', async ({ page }) => {
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
  
  // Get ALL Nro de Viaje values (column 2) from visible rows
  console.log('\n=== ALL NRO DE VIAJE VALUES IN ASIGNAR TABLE ===');
  const nroViajes = await page.evaluate(() => {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return [];
    const rows = Array.from(tbody.querySelectorAll('tr'));
    return rows.map((row, idx) => {
      const cells = Array.from(row.querySelectorAll('td'));
      const nroViaje = cells[2]?.textContent?.trim() || 'EMPTY';
      const cliente = cells[8]?.textContent?.trim() || 'EMPTY';
      return { idx, nroViaje, cliente };
    });
  });
  
  console.log(`Found ${nroViajes.length} trips:`);
  nroViajes.forEach((trip: any) => {
    console.log(`  [${trip.idx}] Nro de Viaje: ${trip.nroViaje}, Cliente: ${trip.cliente}`);
  });
  
  // Also check listado table
  console.log('\n=== CHECKING LISTADO TABLE ===');
  await page.goto('https://moveontruckqa.bermanntms.cl/viajes/listado');
  await page.waitForLoadState('networkidle');
  
  const listadoRows = await page.evaluate(() => {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return [];
    const rows = Array.from(tbody.querySelectorAll('tr'));
    // In listado, column 1 is "Nro de viaje"
    return rows.slice(0, 10).map((row, idx) => {
      const cells = Array.from(row.querySelectorAll('td'));
      const nroViaje = cells[1]?.textContent?.trim() || 'EMPTY';
      const cliente = cells[4]?.textContent?.trim() || 'EMPTY';
      return { idx, nroViaje, cliente };
    });
  });
  
  console.log(`Found ${listadoRows.length} trips in listado:`);
  listadoRows.forEach((trip: any) => {
    if (trip.nroViaje !== 'Ningún dato disponible en esta tabla') {
      console.log(`  [${trip.idx}] Nro de Viaje: ${trip.nroViaje}, Cliente: ${trip.cliente}`);
    }
  });
});
