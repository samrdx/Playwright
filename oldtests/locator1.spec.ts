import { test, expect, chromium, } from '@playwright/test';
import type { BrowserContext, Page, Browser, Locator } from '@playwright/test';

test('locator1 test', async ({ page }) => {
    await page.goto('https://clientesdev1.bermanngps.cl/pre/bermanngpsweb-ui/login.php');

    //create a web element(locator) + perform action on it (click, fill, etc) 
    //1. ID Locator -- ID is unique for every element 
    const userName = page.locator('id=tx_user');
    const password = page.locator('id=tx_pass');
    const loginBtn = page.locator('id=btn_inicioSesion');

    await userName.fill('bermannsa');
    await password.fill('2025-Bermann@');
    await loginBtn.click();

    //2. Class Locator -- Class name is not unique for every element 
    const checkMovil = page.locator('.select2-selection__rendered');
    const movilInput = page.locator('.select2-search__field');

    await checkMovil.click();
    await movilInput.fill('CAJAK3');
    await movilInput.press('Enter');

    //3. text Locator -- text is not unique for every element 
    // Usamos getByText y expect para esperar a que los elementos aparezcan
    const checkMovil2 = page.getByText('Opciones');
    await expect(checkMovil2).toBeVisible();
    console.log('Opciones es visible');

    const checkVehicles = page.getByText('Total Vehículos ');
    await expect(checkVehicles).toBeVisible();
    console.log('Total Vehículos es visible');

    const checkOfficeName = page.getByText('A-Oficina (9)');
    await expect(checkOfficeName).toBeVisible();
    console.log('A-Oficina (9) es visible');


    //4. CSS Selector: Selects elements based on CSS properties 
    const checkDetenido = page.locator('css=button#btnDetenidos');
    await expect(checkDetenido).toBeVisible();
    console.log('Detenidos es visible');
    await checkDetenido.click();

    //5. Xpath Locator: Selects elements based on the XPath query.
    const searchMovil = page.locator('xpath=//input[@id="tx_movil"]');
    await expect(searchMovil).toBeVisible();
    console.log('Movil es visible');
});
