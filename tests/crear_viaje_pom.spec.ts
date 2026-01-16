import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginpage';
import { CreateTripPage } from '../pages/createtrippage';
import { TripListPage } from '../pages/tripslistpage';
import testData from '../data/viajes.data.json' with { type: 'json' };

test.only('Flujo E2E: Crear Viaje Correctamente', async ({ page }) => {
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
        await login.login(testData.loginCredentials.username, testData.loginCredentials.password);
        await login.verifyLoginSuccess(testData.loginCredentials.expectedUserName);
    });

    // Paso 2: Crear Viaje
    await test.step('Completar formulario de viaje', async () => {
        await viajes.goto();
        
        // Completar información básica
        createdId = await viajes.fillNroViaje();
        console.log(`ID Generado: ${createdId}`);
        
        await viajes.selectTipoOperacion(testData.tripData.tipoOperacion);
        await viajes.selectCliente(testData.tripData.cliente);
        await viajes.selectTipoServicio(testData.tripData.tipoServicio);
        await viajes.selectTipoViaje(testData.tripData.tipoViaje);
        await viajes.selectUnidadNegocio(testData.tripData.unidadNegocio);
        await viajes.selectCarga(testData.tripData.carga);
        await viajes.agregarRuta(testData.tripData.ruta);

        await viajes.selectOrigen(testData.tripData.origen);
        await viajes.selectDestino(testData.tripData.destino);

        const randomQty = Math.floor(Math.random() * 10) + 1;
        await viajes.fillCantidadKg(randomQty);

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