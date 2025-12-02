import { test, expect } from '@playwright/test';

test('Debug - Inspect trip creation page DOM', async ({ page }) => {
  // Login
  await page.goto('https://moveontruckqa.bermanntms.cl/login');
  await page.locator('#login-usuario').fill('arivas');
  await page.locator('#login-clave').fill('arivas');
  await page.locator('button.btn-success:has-text("Ingresar")').click();
  await page.waitForURL('https://moveontruckqa.bermanntms.cl/site');
  
  // Navigate to trip creation
  await page.goto('https://moveontruckqa.bermanntms.cl/viajes/crear');
  await page.waitForLoadState('networkidle');
  
  // Take a snapshot to see the structure
  const snapshot = await page.accessibility.snapshot();
  console.log('PAGE SNAPSHOT:', JSON.stringify(snapshot, null, 2));
  
  // Get all form fields
  const allInputs = await page.locator('input').all();
  const allSelects = await page.locator('select').all();
  const allLabels = await page.locator('label').all();
  
  console.log('\n=== INPUTS ===');
  for (let input of allInputs) {
    const name = await input.getAttribute('name');
    const id = await input.getAttribute('id');
    const type = await input.getAttribute('type');
    const placeholder = await input.getAttribute('placeholder');
    console.log(`Input - name: ${name}, id: ${id}, type: ${type}, placeholder: ${placeholder}`);
  }
  
  console.log('\n=== SELECTS ===');
  for (let select of allSelects) {
    const name = await select.getAttribute('name');
    const id = await select.getAttribute('id');
    const options = await select.locator('option').all();
    console.log(`Select - name: ${name}, id: ${id}, options: ${options.length}`);
    
    for (let opt of options.slice(0, 5)) { // Show first 5 options
      const value = await opt.getAttribute('value');
      const text = await opt.textContent();
      console.log(`  - value: ${value}, text: ${text}`);
    }
  }
  
  console.log('\n=== LABELS ===');
  for (let label of allLabels) {
    const text = await label.textContent();
    const forAttr = await label.getAttribute('for');
    console.log(`Label - text: "${text?.trim()}", for: ${forAttr}`);
  }
  
  console.log('\n=== BUTTONS ===');
  const buttons = await page.locator('button').all();
  for (let btn of buttons) {
    const text = await btn.textContent();
    const type = await btn.getAttribute('type');
    const className = await btn.getAttribute('class');
    console.log(`Button - text: "${text?.trim()}", type: ${type}, class: ${className}`);
  }
  
  // Take screenshots
  await page.screenshot({ path: 'debug-crear-viaje-page.png', fullPage: true });
  console.log('Screenshot saved: debug-crear-viaje-page.png');
  
  // Get the full HTML form
  const formHtml = await page.locator('form').first().evaluate(el => el.outerHTML);
  console.log('\n=== FORM HTML ===\n', formHtml.substring(0, 2000));
});
