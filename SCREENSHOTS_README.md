# Screenshots en Playwright

Este proyecto está configurado para guardar automáticamente todos los screenshots en la carpeta `screenshots/`.

## Configuración Automática

### Configuración Global (playwright.config.ts)

Los screenshots automáticos están configurados en `playwright.config.ts`:

```typescript
use: {
  screenshot: 'only-on-failure', // Toma screenshots solo cuando fallan los tests
  video: 'retain-on-failure',    // Retiene videos solo cuando fallan los tests
}
```

### Helper Function

Se creó un helper en `helpers/screenshot.helper.ts` para tomar screenshots manualmente de forma organizada:

## Uso del Helper

### Importar el Helper

```typescript
import {
  takeScreenshot,
  takeTimestampedScreenshot,
} from "../helpers/screenshot.helper";
```

### Tomar Screenshots

#### Screenshot Simple

```typescript
// Guarda en screenshots/mi-captura.png
await takeScreenshot(page, "mi-captura");
```

#### Screenshot con Timestamp

```typescript
// Guarda en screenshots/mi-captura_2025-12-02T13-30-45.png
await takeTimestampedScreenshot(page, "mi-captura");
```

#### Opciones Adicionales

```typescript
// Screenshot solo del viewport (no página completa)
await takeScreenshot(page, "solo-viewport", { fullPage: false });
```

## Estructura de Carpetas

```
PLAYWRIGHT/
├── screenshots/           # Todos los screenshots se guardan aquí
│   ├── crear-viaje-formulario.png
│   ├── after-agregar-ruta-1.png
│   └── crear-viaje-listado.png
├── helpers/
│   └── screenshot.helper.ts
├── mytest/
│   └── *.spec.ts
└── playwright.config.ts
```

## Beneficios

1. **Organización**: Todos los screenshots en un solo lugar
2. **Auto-creación**: La carpeta `screenshots/` se crea automáticamente
3. **Logs Claros**: Cada screenshot imprime su ubicación en la consola
4. **Timestamps Opcionales**: Para evitar sobrescribir screenshots en múltiples ejecuciones

## Tests Existentes Actualizados

Los siguientes archivos ya usan el nuevo sistema:

- `mytest/planificar_viaje.spec.ts` ✅

## Migrar Tests Antiguos

Para migrar tests existentes:

1. Importar el helper:

```typescript
import { takeScreenshot } from "../helpers/screenshot.helper";
```

2. Reemplazar:

```typescript
// Antes
await page.screenshot({ path: "mi-screenshot.png", fullPage: true });

// Después
await takeScreenshot(page, "mi-screenshot");
```

## Limpiar Screenshots Antiguos

Los screenshots antiguos que no están en la carpeta `screenshots/` pueden ser eliminados manualmente:

```bash
# PowerShell
Remove-Item *.png

# O manualmente desde el explorador de archivos
```
