import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginpage';
import { CreateTripPage } from '../pages/createtrippage';
import { TripListPage } from '../pages/tripslistpage';

test('Flujo E2E: Crear Viaje Correctamente', async ({ page }) => {
    test.setTimeout(120000); // Match original test timeout

    const login = new LoginPage(page);
    const viajes = new CreateTripPage(page);
    const listado = new TripListPage(page);
    let createdId = '';
    
    // Setup
    await login.handleDialogs();

    // Paso 1: Login
    await test.step('Login al sistema', async () => {
        await login.goto();
        await login.login('srodriguez', 'srodriguez');
        await login.verifyLoginSuccess('Samuel');
    });

    // Paso 2: Crear Viaje
    await test.step('Completar formulario de viaje', async () => {
        await viajes.goto();
        
        // Completar información básica
        createdId = await viajes.fillNroViaje();
        console.log(`ID Generado: ${createdId}`);
        
        await viajes.selectTipoOperacion();
        await viajes.selectCliente();
        await viajes.selectTipoServicio();
        await viajes.selectTipoViaje();
        await viajes.selectUnidadNegocio();
        await viajes.selectCarga();
        await viajes.selectOrigen();
        await viajes.selectDestino();

        await viajes.agregarRuta('05082025-1');
        await viajes.guardarViaje();
    });

    // Paso 3: Validar resultado de guardado
    await test.step('Validar resultado', async () => {
        await viajes.verifySuccess();
    });

    // Paso 4: Verificar viaje en listado
    await test.step('Verificar viaje en listado', async () => {
        if (createdId) {
            await listado.goto();
            await listado.verifyTripExists(createdId);
        }
    });
});