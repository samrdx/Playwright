import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ViajesPage } from '../pages/ViajesPage';

test('Flujo E2E: Crear Viaje Correctamente', async ({ page }) => {
    const login = new LoginPage(page);
    const viajes = new ViajesPage(page);

    // Paso 1: Login
    await test.step('Login al sistema', async () => {
        await login.ingresarCredenciales('srodriguez', 'srodriguez');
    });

    // Paso 2: Crear Viaje
    await test.step('Completar formulario de viaje', async () => {
        await viajes.ingresarPaginaCreacion();
        await viajes.completarInformacionBasica();
        await viajes.agregarRuta('05082025-1');
        await viajes.guardarViaje();
    });

    // Paso 3: Validación
    await test.step('Verificar creación', async () => {
        await expect(page.locator('.alert-success')).toBeVisible();
    });
});