import { BasePage } from './basepage.js';
import { expect } from '@playwright/test';
import type { Page, Locator } from '@playwright/test';

export class CreateTripPage extends BasePage {
    readonly nroViajeInput: Locator;
    readonly tipoOperacionSelect: Locator;
    readonly clienteSelect: Locator;
    readonly tipoServicioSelect: Locator;
    readonly tipoViajeSelect: Locator;
    readonly unidadNegocioSelect: Locator;
    readonly cargaSelect: Locator;
    readonly origenSelect: Locator;
    readonly destinoSelect: Locator;
    readonly guardarBtn: Locator;
    readonly successAlert: Locator;

    constructor(page: Page) {
        super(page);
        this.nroViajeInput = page.locator('#viajes-nro_viaje');
        this.tipoOperacionSelect = page.locator('#tipo_operacion_form');
        this.clienteSelect = page.locator('#viajes-cliente_id');
        this.tipoServicioSelect = page.locator('#viajes-tipo_servicio_id');
        this.tipoViajeSelect = page.locator('#viajes-tipo_viaje_id');
        this.unidadNegocioSelect = page.locator('#viajes-unidad_negocio_id');
        this.cargaSelect = page.locator('#viajes-carga_id');
        this.origenSelect = page.locator('#_origendestinoform-origen');
        this.destinoSelect = page.locator('#_origendestinoform-destino');
        this.guardarBtn = page.locator('#btn_guardar_form, button.btn-success:has-text("Guardar")').first();
        this.successAlert = page.locator('.alert-success, .toast-success').first();
    }

    async goto() {
        await this.navigateTo('https://moveontruckqa.bermanntms.cl/viajes/crear');
    }

    async fillNroViaje() {
        if (await this.nroViajeInput.isVisible()) {
            const uniqueId = String(Math.floor(1000 + Math.random() * 9000));
            await this.nroViajeInput.fill(uniqueId);
            return uniqueId;
        }
        return '';
    }

    private async selectByPartialText(selectLocator: Locator, partialText: string) {
        if (!await selectLocator.isVisible()) return;

        // Try standard select first if it happens to match exact label
        try {
            await selectLocator.selectOption({ label: partialText });
            return;
        } catch (e) {
            // Check options manually for partial match
            const options = await selectLocator.locator('option').all();
            for (const opt of options) {
                const text = await opt.textContent();
                const value = await opt.getAttribute('value');
                if (text && text.toLowerCase().includes(partialText.toLowerCase()) && value) {
                    await selectLocator.selectOption(value);
                    return;
                }
            }
            console.warn(`Could not find option containing '${partialText}' in ${selectLocator}`);
        }
    }

    async selectTipoOperacion(text: string = 'tclp2210') {
        await this.selectByPartialText(this.tipoOperacionSelect, text);
    }

    async selectCliente(text: string = 'Clientedummy') {
        await this.selectByPartialText(this.clienteSelect, text);
    }

    async selectTipoServicio(text: string = 'tclp2210') {
        // Fallback to index 1 if not found, as per original test logic
        if (!await this.tipoServicioSelect.isVisible()) return;
        
        await this.selectByPartialText(this.tipoServicioSelect, text);
        
        // Check if selected? If not, select index 1
        const val = await this.tipoServicioSelect.inputValue();
        if (!val) {
             await this.tipoServicioSelect.selectOption({ index: 1 });
        }
    }

    async selectTipoViaje(value: string = '1') {
        if (await this.tipoViajeSelect.isVisible()) {
            await this.tipoViajeSelect.selectOption(value);
        }
    }

    async selectUnidadNegocio(value: string = '1') {
        if (await this.unidadNegocioSelect.isVisible()) {
            await this.unidadNegocioSelect.selectOption(value);
        }
    }

    async selectCarga(text: string = 'CONT-Bobinas-Sider14') {
        // This was critical in original test.
        await this.selectByPartialText(this.cargaSelect, text);
    }

    async agregarRuta(rutaPartialText: string = '05082025-1') {
        const btnAgregar = this.page.locator('button:has-text("Agregar Ruta"), button.btn.btn-sm.btn-success').first();
        if (await btnAgregar.isVisible()) {
            await btnAgregar.click();
            
            // Wait for modal
            const modal = this.page.locator('#modalRutasSugeridas');
            await expect(modal).toBeVisible({ timeout: 5000 });
            
            // Find row
            const row = modal.locator('tr', { hasText: rutaPartialText }).first();
            if (await row.isVisible()) {
                const okBtn = row.locator('button.btn-success');
                await okBtn.click();
                await expect(modal).toBeHidden();
            } else {
                console.warn(`Route ${rutaPartialText} not found in modal`);
                // Close modal if needed? or just fail? Original test log warnings.
            }
        }
    }

    async selectOrigen(text: string = '1_agunsa_lampa_RM') {
        await this.selectByPartialText(this.origenSelect, text);
    }

    async selectDestino(text: string = '225_Starken_Sn Bernardo') {
        await this.selectByPartialText(this.destinoSelect, text);
    }

    async guardarViaje() {
        // Cleanup backdrops if any left
        await this.page.evaluate(() => {
            document.querySelectorAll('.modal-backdrop').forEach(e => e.remove());
        });

        await this.guardarBtn.waitFor({ state: 'visible' });
        await this.guardarBtn.click();
    }

    async verifySuccess() {
        await expect(this.successAlert).toBeVisible({ timeout: 15000 });
        const text = await this.successAlert.textContent();
        console.log(`Success Message: ${text}`);
    }
}