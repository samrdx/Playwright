import { test, expect, chromium, type Browser } from '@playwright/test';


test('Login test', async ({ page }) => {
    const browser:Browser = await chromium.launch({ headless: false, channel: 'chrome'});
    await page.goto('https://moveontruckqa.bermanntms.cl/login');

    const emailid = page.locator('#login-usuario');
    const password = page.locator('#login-clave');
    const loginbtn = page.locator('[class="btn btn-success btn-custom w-md waves-effect waves-light"]');

    await emailid.fill('arivas');
    await password.fill('arivas');
    await loginbtn.click();

    

    const title = await page.title();
    await page.screenshot({path: 'homepage.png'});
    console.log('Home page title: ', title);

   

    expect(title).toEqual('Sistema de Gestion de Viajes - Inicio sesion');
    // El navegador se cierra automáticamente al finalizar el test.
});