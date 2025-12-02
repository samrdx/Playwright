import type { Page } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Helper para tomar screenshots y guardarlos en la carpeta screenshots/
 */

// Crear la carpeta screenshots si no existe
const screenshotsDir = path.join(process.cwd(), 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

/**
 * Toma un screenshot y lo guarda en la carpeta screenshots/
 * @param page - Página de Playwright
 * @param name - Nombre del archivo (sin extensión, se agregará .png automáticamente)
 * @param options - Opciones adicionales para el screenshot
 */
export async function takeScreenshot(
  page: Page,
  name: string,
  options: { fullPage?: boolean } = {}
): Promise<void> {
  const fileName = name.endsWith('.png') ? name : `${name}.png`;
  const screenshotPath = path.join(screenshotsDir, fileName);
  
  await page.screenshot({
    path: screenshotPath,
    fullPage: options.fullPage ?? true,
  });
  
  console.log(`✓ Screenshot guardado: screenshots/${fileName}`);
}

/**
 * Genera un nombre de screenshot con timestamp
 * @param baseName - Nombre base del screenshot
 * @returns Nombre del archivo con timestamp
 */
export function getTimestampedName(baseName: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `${baseName}_${timestamp}`;
}

/**
 * Toma un screenshot con timestamp automático
 * @param page - Página de Playwright
 * @param baseName - Nombre base del archivo
 * @param options - Opciones adicionales para el screenshot
 */
export async function takeTimestampedScreenshot(
  page: Page,
  baseName: string,
  options: { fullPage?: boolean } = {}
): Promise<void> {
  const name = getTimestampedName(baseName);
  await takeScreenshot(page, name, options);
}
