import { test, expect } from '@playwright/test';

test('creating a trip', async ({ page }) => {
    await page.goto('https://moveontruckqa.bermanntms.cl/login');

    const usuario = page.locator('id=login-usuario');
    const clave = page.locator('id=login-clave');
    const btnLogin = page.locator('.btn.btn-success.btn-custom.w-md.waves-effect.waves-light');

    await usuario.fill('vacio');
    await clave.fill('vacio');
    await btnLogin.click();


    /*const btnTransporte = page.locator('.fal.fa-truck')
    await btnTransporte.click(); 

    const btnPlanificar = page.locator('text=Planificar')
    await btnPlanificar.click(); 

    const nroViaje = page.locator('id=viajes-nro_viaje')
    await nroViaje.click(); 
    await nroViaje.fill('300101');

    const tipoOperacion = page.locator('.btn.dropdown-toggle.btn-light.bs-placeholder')
    await tipoOperacion.click(); 
    
    await new Promise(() => {}); //prevents your script from exiting! 
*/ 
}); 