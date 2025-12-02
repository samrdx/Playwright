import { test } from '@playwright/test';

test('Debug - Check which fields are truly required and their names', async ({ page }) => {
  // Login
  await page.goto('https://moveontruckqa.bermanntms.cl/login');
  await page.locator('#login-usuario').fill('arivas');
  await page.locator('#login-clave').fill('arivas');
  await page.locator('button.btn-success:has-text("Ingresar")').click();
  await page.waitForURL('https://moveontruckqa.bermanntms.cl/site');
  
  // Navigate to trip creation
  await page.goto('https://moveontruckqa.bermanntms.cl/viajes/crear');
  await page.waitForLoadState('networkidle');
  
  // Fill in fields like before
  await page.locator('#tipo_operacion_form').selectOption('2');
  await page.waitForTimeout(300);
  
  await page.locator('#viajes-cliente_id').selectOption('55');
  await page.locator('#viajes-tipo_viaje_id').selectOption('1');
  await page.locator('#viajes-unidad_negocio_id').selectOption('2');
  
  // Try to find all fields with "requerido" or "obligatorio" class
  console.log('\n=== CHECKING FOR REQUIRED FIELDS ===');
  const requiredLabels = await page.locator('label:has-text("*"), label.requerido').all();
  console.log(`Total labels con asterisco: ${requiredLabels.length}`);
  
  for (let label of requiredLabels) {
    const text = await label.textContent();
    const forAttr = await label.getAttribute('for');
    console.log(`Required label: "${text?.trim()}", for: ${forAttr}`);
  }
  
  // Get all form field elements
  console.log('\n=== ALL FORM FIELDS ===');
  const allLabels = await page.locator('label').all();
  for (let label of allLabels) {
    const text = await label.textContent();
    const forAttr = await label.getAttribute('for');
    if (text && text.trim().length > 0 && text.trim().length < 50) {
      const hasAsterisk = text.includes('*');
      console.log(`${hasAsterisk ? '[REQUIRED] ' : '[optional] '} "${text?.trim()}" -> #${forAttr}`);
    }
  }
  
  // Try to fill and see what error messages we get
  console.log('\n=== ATTEMPTING TO SAVE ===');
  await page.locator('button.btn-success:has-text("Guardar")').click();
  await page.waitForTimeout(500);
  
  // Get all error messages
  const errors = await page.locator('.alert-danger, .alert-error, [class*="error"]').all();
  console.log(`Total error messages: ${errors.length}`);
  
  for (let error of errors) {
    const text = await error.textContent();
    if (text && text.trim().length > 10) {
      console.log(`Error: ${text.trim()}`);
    }
  }
  
  // Check HTML for error-related attributes
  const errorElements = await page.evaluate(() => {
    const elements = [];
    document.querySelectorAll('[class*="error"], [class*="invalid"], .help-block').forEach(el => {
      const text = el.textContent?.trim();
      if (text && text.length > 0 && text.length < 100) {
        elements.push({
          tag: el.tagName,
          class: el.className,
          text: text,
          id: el.id
        });
      }
    });
    return elements;
  });
  
  console.log('\n=== ERROR ELEMENTS IN DOM ===');
  for (let el of errorElements) {
    console.log(`${el.tag}.${el.class} -> "${el.text}"`);
  }
});
