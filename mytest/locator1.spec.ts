import { test, expect, chromium, } from '@playwright/test';
import type { BrowserContext, Page, Browser, Locator } from '@playwright/test';

test ('locator1 test', async () => {
    const browser:Browser = await chromium.launch({ headless: false, channel: 'chrome'});
    const context:BrowserContext = await browser.newContext ();
    const page:Page = await context.newPage(); 
    await page.goto ('https://clientesdev1.bermanngps.cl/pre/bermanngpsweb-ui/login.php');

    //create a web element(locator) + perform action on it (click, fill, etc) 
    //1. ID Locator -- ID is unique for every element 

    const userName:Locator = page.locator('id=tx_user');
    const password:Locator = page.locator('id=tx_pass');
    const loginBtn:Locator = page.locator('id=btn_inicioSesion');

    await userName.fill('bermannsa');
    await password.fill('2025-Bermann@');
    await loginBtn.click(); 

    //2. Class Locator -- Class name is not unique for every element 

    const checkMovil:Locator = page.locator('.select2-selection__rendered');
    const movilInput:Locator = page.locator('.select2-search__field'); 

    await checkMovil.click();
    await movilInput.fill('CAJAK3');
    await movilInput.press('Enter');


    //await new Promise (() => {}); //prevents your script from exiting!




});
