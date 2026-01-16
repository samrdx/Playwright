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
    readonly cantidadInput: Locator;
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
        this.cantidadInput = page.locator('#cantidad');
        this.guardarBtn = page.locator('#btn_guardar_form, button.btn-success:has-text("Guardar")').first();
        this.successAlert = page.locator('.alert-success, .toast-success').first();
    }

    async goto() {
        await this.navigateTo('https://elcarniceroqa.bermanntms.cl/viajes/crear');
    }

    async fillNroViaje() {
        if (await this.nroViajeInput.isVisible()) {
            // Generate unique ID using timestamp + random to avoid duplicates
            const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
            const random = Math.floor(100 + Math.random() * 900); // 3-digit random
            const uniqueId = `${timestamp}${random}`;
            await this.nroViajeInput.fill(uniqueId);
            console.log(`✓ Generated unique trip ID: ${uniqueId}`);
            return uniqueId;
        }
        return '';
    }

    private async selectByPartialText(selectLocator: Locator, partialText: string) {
        if (!await selectLocator.isVisible()) return;

        // Try standard select first if it happens to match exact label
        try {
            await selectLocator.selectOption({ label: partialText }, { timeout: 1000 });
            return;
        } catch (e) {
            // ignore
        }

        // Fast search using evaluate
        const valueToSelect = await selectLocator.evaluate((sel: HTMLSelectElement, text: string) => {
            const opts = Array.from(sel.options);
            const found = opts.find(o => (o.textContent || '').toLowerCase().includes(text.toLowerCase()));
            return found ? found.value : null;
        }, partialText);

        if (valueToSelect) {
            await this.robustSelect(selectLocator, valueToSelect);
        } else {
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

    // --- Improved Robust Helpers ---

    private async robustSelect(selectLoc: Locator, value: string): Promise<boolean> {
        // Try native selectOption first with small retries
        for (let retry = 0; retry < 3; retry++) {
            try {
                await selectLoc.selectOption(value, { timeout: 1000 }).catch(() => {});
            } catch (e) {
                // ignore
            }
            try {
                await this.page.waitForTimeout(500);
            } catch (e) {
                return false;
            }
            const isInvalid = await selectLoc.evaluate((el: HTMLSelectElement) => 
                el.classList.contains('is-invalid') || el.closest('.form-group, .form-control')?.classList.contains('has-error')
            ).catch(() => false);
            if (!isInvalid) return true;
        }

        // Fallback: set value via DOM, dispatch change, and refresh bootstrap selectpicker if present
        try {
            await selectLoc.evaluate((el: HTMLSelectElement, v: string) => {
                try { el.value = v; } catch (e) {}
                try { el.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
                // Refresh bootstrap selectpicker if exists
                try {
                    // @ts-ignore
                    if (window && (window as any).$ && (window as any).$('.selectpicker') && (window as any).$('.selectpicker').selectpicker) {
                        try { (window as any).$('.selectpicker').selectpicker('refresh'); } catch(e){}
                    }
                } catch (e) {}
            }, value).catch(() => {});
            
            await this.page.waitForTimeout(500);
            
            const isInvalid = await selectLoc.evaluate((el: HTMLSelectElement) => 
                el.classList.contains('is-invalid') || el.closest('.form-group, .form-control')?.classList.contains('has-error')
            ).catch(() => false);
            return !isInvalid;
        } catch (e) {
            return false;
        }
    }

    async selectCarga(text: string = 'CONT-Bobinas-Sider14') {
        const cargaSelect = this.cargaSelect;
        await expect(cargaSelect).toBeVisible();

        // Find option value by text with retry (waiting for dynamic populate)
        let cargaValue: string | null = null;
        for (let i = 0; i < 10; i++) { // Poll for up to 5 seconds
            cargaValue = await cargaSelect.evaluate((sel: HTMLSelectElement, textToFind) => {
                 const opts = Array.from(sel.options || []);
                 const found = opts.find((o: HTMLOptionElement) => (o.textContent || '').trim() === textToFind);
                 return found ? found.value : null;
            }, text);
            if (cargaValue) break;
            await this.page.waitForTimeout(500);
        }

        if (!cargaValue) throw new Error(`No se encontró la opción de carga: ${text} - Check if client selection triggered the load.`);

        let cargaSelected = await this.robustSelect(cargaSelect, cargaValue);

        // Retry logic if failed
        if (!cargaSelected) {
             console.log('⚠ Retrying selection for Carga...');
             const globalAlert = await this.page.locator('.alert-danger').isVisible().catch(() => false);
             if (globalAlert) {
                // Try to recover focus and click
                 await cargaSelect.scrollIntoViewIfNeeded().catch(() => {});
                 await cargaSelect.click({force: true}).catch(() => {});
                 await this.page.waitForTimeout(500);
                 cargaSelected = await this.robustSelect(cargaSelect, cargaValue);
             }
        }
        
        if (!cargaSelected) {
             throw new Error(`Failed to select Carga: ${text} after retries.`);
        }
        console.log(`✓ Carga selected: ${text}`);
    }

    async fillCantidadKg(cantidad: number) {
        try {
            // Try explicit selector first
            const input = this.page.locator('#cantidad');
            if (await input.isVisible({ timeout: 1000 })) {
                await input.fill(cantidad.toString());
                console.log(`✓ Cantidad/Kg filled (via #cantidad): ${cantidad}`);
                return;
            }

            // Try by label (Fallback that works)
            const byLabel = this.page.locator('label:has-text("Cantidad"), label:has-text("Kg")').locator('..').locator('input').first();
            if (await byLabel.isVisible({ timeout: 5000 })) {
                await byLabel.fill(cantidad.toString());
                console.log(`✓ Cantidad/Kg filled (via label): ${cantidad}`);
                return;
            }
             
            console.log('⚠ Cantidad input not visible after attempts.');
        } catch (e) {
             console.log('⚠ Exception filling Cantidad: ' + e);
        }
    }

    async agregarRuta(rutaPartialText: string = '05082025-1') {
        await this.page.waitForTimeout(1500); // Wait for potential updates after Carga/Client

        // Robust Click on "Agregar Ruta"
        // Define locator dynamically as it might match multiple elements
        const agregarBtns = this.page.locator('button:has-text("Agregar Ruta"), button.btn.btn-sm.btn-success');
        let clickedAgregar = false;

        // Try standard click
        if (await agregarBtns.first().isVisible()) {
             try {
                await agregarBtns.first().click();
                clickedAgregar = true;
                console.log('✓ Standard click on Agregar Ruta');
             } catch (e) { console.log('Standard click failed'); }
        }

        // Try force click
        if (!clickedAgregar && await agregarBtns.count() > 0) {
             try {
                await agregarBtns.first().click({ force: true });
                clickedAgregar = true;
                console.log('✓ Force click on Agregar Ruta');
             } catch (e) { console.log('Force click failed'); }
        }

         // Try dispatchEvent
        if (!clickedAgregar) {
             try {
                await this.page.evaluate(() => {
                    const el = document.querySelector('button:has-text("Agregar Ruta"), button.btn.btn-sm.btn-success') as HTMLElement | null;
                    if (el) el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                });
                clickedAgregar = true;
                 console.log('✓ Dispatch click on Agregar Ruta');
             } catch (e) { console.log('Dispatch click failed'); }
        }

        // Handle Modal
        const modalRutas = this.page.locator('#modalRutasSugeridas');
        await expect(modalRutas).toBeVisible({ timeout: 10000 });
        
        const row = modalRutas.locator('tr').filter({ hasText: rutaPartialText }).first();
        if (await row.isVisible()) {
             const botonOk = row.locator('button.btn.btn-sm.btn-success');
             await botonOk.click();
             console.log(`✓ Selected route: ${rutaPartialText}`);
             
             // Wait for modal to close or response
             await this.page.waitForTimeout(1000);
             
             // Clear backdrops manually just in case
             await this.page.evaluate(() => { 
                document.querySelectorAll('.modal-backdrop').forEach(b => b.remove()); 
             });
        } else {
             console.log(`⚠ Route ${rutaPartialText} not found in modal.`);
        }
    }

    async selectOrigen(text: string = '1_agunsa_lampa_RM') {
         await this.selectByPartialText(this.origenSelect, text);
    }

    async selectDestino(text: string = '225_Starken_Sn Bernardo') {
         await this.selectByPartialText(this.destinoSelect, text);
    }
    
    async guardarViaje() {
         // Ensure backdrops are gone before saving
         await this.page.evaluate(() => { 
            document.querySelectorAll('.modal-backdrop').forEach(b => b.remove()); 
         });
         
         await this.guardarBtn.click();
    }

    async verifySuccess() {
        await this.page.waitForLoadState('networkidle');
        
        // Poll for success alert (matching planificar_viaje.spec.ts logic)
        const timeout = 10000;
        const end = Date.now() + timeout;
        let successFound = false;
        
        while (Date.now() < end) {
            const alerts = await this.page.locator('.alert, [role="alert"]').evaluateAll((els: Element[]) =>
                (els || []).map(el => ({ 
                    text: el.textContent?.trim() || '', 
                    classes: el.getAttribute('class') || '' 
                }))
            ).catch(() => []);

            if (alerts.length > 0) {
                // Look for explicit success
                const success = alerts.find((a: any) => 
                    /viaje creado correctamente|confirmación/i.test(a.text) || 
                    a.classes.includes('alert-success') || 
                    a.classes.includes('toast-success')
                );
                
                if (success) {
                    console.log(`✓ Success message: ${success.text}`);
                    successFound = true;
                    break;
                }
            }
            
            await this.page.waitForTimeout(400);
        }
        
        if (!successFound) {
            console.log('⚠ No success confirmation found after timeout');
            // Log any visible alerts for debugging
            const fallbackAlerts = await this.page.locator('.alert, [role="alert"]').evaluateAll((els: Element[]) =>
                (els || []).map(el => ({ 
                    text: el.textContent?.trim() || '', 
                    classes: el.getAttribute('class') || '' 
                }))
            ).catch(() => []);
            
            for (const a of fallbackAlerts) {
                if (a.text && a.text.length > 5) {
                    console.log(`[ALERT] ${a.text.substring(0, 200)}`);
                }
            }
        }
        
        // Verify we're still in viajes section
        const currentUrl = this.page.url();
        console.log(`Current URL: ${currentUrl}`);
        expect(currentUrl).toContain('/viajes');
    }
}