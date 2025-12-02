# MoveOnTruck - Plan de Pruebas Integral: Crear Nuevo Viaje (Planificar)

## Resumen Ejecutivo de la Aplicación

MoveOnTruck es un Sistema de Gestión de Viajes (SGV) diseñado en español para la gestión completa de operaciones de transporte y logística. La aplicación permite a los usuarios crear, asignar, monitorear y cerrar viajes de transporte con múltiples estados y funcionalidades avanzadas.

### Funcionalidades Principales
- **Gestión de Viajes**: Crear, planificar, asignar y monitorear viajes
- **Gestión de Recursos**: Administrar transportistas, conductores, vehículos y zonas geográficas
- **Seguimiento en Tiempo Real**: Monitoreo de viajes con múltiples estados operacionales
- **Reportes**: Generación de reportes de viajes y operatividad
- **Integración de Datos**: Soporte para carga masiva y múltiples formatos de datos
- **Multi-idioma**: Interfaz completamente en español chileno

### Estados de Viaje Disponibles
1. **Planificado**: Viajes creados sin asignación de transporte, vehículo y conductor
2. **Asignado**: Viajes con transportista, vehículo y conductor asignados
3. **Asignado Parcial**: Viajes con asignación incompleta
4. **Pendiente Destino**: Viajes en tránsito aguardando confirmación de destino
5. **En Ruta**: Viajes con evento OUT en zona
6. **En Polígono**: Viajes con evento IN en zona
7. **Finalizado**: Viajes completados (eventos IN/OUT en destino)
8. **Anulado**: Viajes cancelados

---

## Escenarios de Prueba

### 1. Crear Viaje Básico - Flujo Feliz

**Ubicación de Acceso**: Menú lateral → Viajes → Planificar → `/viajes/crear`

**Precondiciones**:
- Usuario autenticado (Angie / usuario válido)
- Usuario tiene permisos para crear viajes
- Existen clientes registrados en el sistema
- Estado inicial: Página en blanco/nueva

**Pasos**:
1. Hacer clic en el menú "Viajes" en la barra lateral izquierda
2. Hacer clic en la opción "Planificar" en el submenú desplegado
3. Esperar a que cargue la página de creación de viajes (`/viajes/crear`)
4. Completar el campo **Unidad de Negocio** seleccionando "Seco" de la lista desplegable
5. Completar el campo **Cliente** seleccionando un cliente válido (ej: "Clientedummy")
6. Completar el campo **Tipo de Operación** seleccionando una opción válida
7. Completar el campo **Origen** ingresando "Santiago" (o seleccionar de lista si existe)
8. Completar el campo **Destino** ingresando "Valparaíso" (o seleccionar de lista si existe)
9. Completar el campo **Fecha de Presentación** ingresando una fecha futura (ej: 05/12/2025)
10. Completar campos opcionales (si están disponibles): Observación, Referencias
11. Hacer clic en el botón "Guardar" o "Crear Viaje"
12. Aguardar confirmación del sistema

**Resultados Esperados**:
- El viaje se crea exitosamente sin errores
- El viaje aparece con estado "Planificado" en el listado de viajes
- Se muestra un mensaje de confirmación "Viaje creado exitosamente"
- Se obtiene un número de identificación único del viaje
- Se redirige al usuario a la página de listado o detalles del viaje creado
- El contador de "Planificado" en el dashboard se incrementa en 1

**Criterios de Éxito**:
- ✓ Viaje creado sin errores de validación
- ✓ ID único generado correctamente
- ✓ Estado inicial es "Planificado"
- ✓ Datos guardados permanecen después de navegar
- ✓ Usuario puede localizar el viaje en el listado

---

### 2. Validación de Campos Obligatorios

**Precondiciones**: 
- Página de creación de viaje cargada
- Todos los campos están en blanco

**Pasos**:
1. Intentar hacer clic en el botón "Guardar" sin completar ningún campo
2. Observar los mensajes de validación
3. Completar solo el campo "Cliente" y hacer clic en "Guardar" nuevamente
4. Observar qué campos se marcan como obligatorios
5. Completar solo "Unidad de Negocio" y hacer clic en "Guardar"
6. Observar los campos que faltan

**Resultados Esperados**:
- Se muestran mensajes de error indicando "Este campo es obligatorio" o similares (en español)
- Los campos obligatorios están claramente marcados
- El formulario no se envía si hay campos obligatorios vacíos
- Se indica visualmente cuáles campos son requeridos (asterisco * o color rojo)
- Los mensajes de error son específicos por campo

**Campos Esperados como Obligatorios**:
- Unidad de Negocio
- Cliente
- Tipo de Operación
- Origen
- Destino  
- Fecha de Presentación

**Criterios de Éxito**:
- ✓ Validación de campos obligatorios funciona correctamente
- ✓ Mensajes claros en español
- ✓ Formulario no se envía sin datos requeridos
- ✓ Usuario puede identificar qué campos requieren atención

---

### 3. Validación de Formato de Fecha

**Precondiciones**:
- Página de creación de viaje cargada
- Otros campos completados correctamente

**Pasos**:
1. Hacer clic en el campo "Fecha de Presentación"
2. Ingresar una fecha con formato inválido (ej: "32/12/2025")
3. Intentar guardar el formulario
4. Limpiar el campo e ingresar una fecha pasada (ej: "01/01/2020")
5. Intentar guardar
6. Ingresar una fecha correcta con formato DD/MM/YYYY (ej: "15/12/2025")
7. Verificar que se acepte

**Resultados Esperados**:
- Sistema rechaza fechas en formato incorrecto con mensaje de error
- Sistema rechaza fechas pasadas (o acepta según política del negocio)
- Sistema acepta fechas futuras en formato correcto
- El campo de fecha puede ser un datepicker visual o entrada de texto con validación
- Se muestra error específico: "Ingrese una fecha válida" o similar

**Criterios de Éxito**:
- ✓ Validación de formato de fecha funciona correctamente
- ✓ No se aceptan fechas inválidas
- ✓ Mensaje de error claro en español
- ✓ Datepicker (si existe) facilita selección de fechas

---

### 4. Selección de Unidad de Negocio

**Precondiciones**:
- Página de creación cargada
- Existen al menos 3 unidades de negocio en el sistema (Defecto, Seco, Whatr)

**Pasos**:
1. Hacer clic en el dropdown "Unidad de Negocio"
2. Verificar que se muestran todas las opciones disponibles
3. Seleccionar "Defecto" de la lista
4. Verificar que la selección se refleja en el campo
5. Abrir nuevamente el dropdown y seleccionar "Seco"
6. Completar el resto del formulario y guardar
7. Verificar que el viaje se creó con la unidad seleccionada

**Resultados Esperados**:
- El dropdown muestra todas las unidades de negocio disponibles
- La selección se persiste en el campo
- El cambio se refleja inmediatamente sin necesidad de confirmar
- La unidad seleccionada se guarda correctamente en la base de datos

**Unidades de Negocio Esperadas**:
- Defecto
- Seco
- Whatr

**Criterios de Éxito**:
- ✓ Todas las unidades de negocio se muestran en el dropdown
- ✓ La selección es funcional
- ✓ Los datos se guardan con la opción seleccionada
- ✓ Interfaz responsiva (funciona en diferentes tamaños de pantalla)

---

### 5. Selección de Cliente Desde Lista Extensa

**Precondiciones**:
- Página de creación cargada
- Existen más de 50 clientes en el sistema
- Campo de búsqueda de cliente funcional

**Pasos**:
1. Hacer clic en el campo "Cliente"
2. Observar si se muestra lista desplegable o campo de búsqueda
3. Escribir las primeras letras de un cliente (ej: "AGENT" para "AGENCIA DE TRANSPORTES ANDES")
4. Verificar que se filtre la lista automáticamente
5. Seleccionar un cliente de los resultados
6. Limpiar el campo y escribir "Client" para encontrar clientes que contengan esa palabra
7. Seleccionar "Cliente Con Contrato" de los resultados
8. Completar resto del formulario y guardar

**Resultados Esperados**:
- El campo de cliente tiene capacidad de búsqueda/filtrado
- La búsqueda funciona en tiempo real (mientras se escribe)
- Se muestran resultados relevantes basados en lo ingresado
- Caso insensible (busca "agent" y encuentra "AGENCIA")
- Búsqueda parcial funciona (busca "transport" y encuentra múltiples transportadores)
- Se pueden seleccionar múltiples clientes si el sistema lo permite, o un solo cliente

**Clientes de Prueba Disponibles** (primeros de la lista):
- AGENCIA DE TRANSPORTES ANDES SPA
- Agudi Transportes Spa
- Alca Spa
- Barry - Callebaut
- BARZ TRANSPORTES SPA
- ... y 170+ más

**Criterios de Éxito**:
- ✓ Búsqueda de cliente funciona eficientemente
- ✓ Lista de clientes se filtra correctamente
- ✓ Selección se persiste
- ✓ Interfaz maneja lista grande sin problemas de rendimiento

---

### 6. Ingreso de Origen y Destino

**Precondiciones**:
- Página de creación cargada
- Campos de origen y destino visibles

**Pasos**:
1. Hacer clic en el campo "Origen"
2. Ingresar "Santiago" si es campo de texto libre
3. Alternativamente, si hay lista desplegable, buscar "Santiago"
4. Hacer clic en el campo "Destino"
5. Ingresar "Valparaíso"
6. Si existen "Waypoints" adicionales, intentar agregar uno
7. Completar formulario y guardar

**Resultados Esperados**:
- Campo de Origen acepta entrada de texto o selección de lista
- Campo de Destino funciona de igual forma
- Se pueden ingresar ciudades o códigos de zona
- Si existen Waypoints (puntos intermedios), se permite agregarlos
- La información se valida (puede verificar que los lugares existan en el sistema)
- No se puede usar el mismo lugar como origen y destino (validación)

**Validaciones Recomendadas**:
- Origen ≠ Destino
- Origen y Destino son requeridos
- Validar que sean ubicaciones válidas en el sistema

**Criterios de Éxito**:
- ✓ Campos de origen/destino aceptan datos correctos
- ✓ Se previene origen = destino (si es requerimiento)
- ✓ Datos se guardan correctamente
- ✓ Interfaz es clara sobre qué es origen y qué es destino

---

### 7. Validación de Tipo de Operación

**Precondiciones**:
- Página de creación cargada
- Campo "Tipo de Operación" visible

**Pasos**:
1. Hacer clic en el campo "Tipo de Operación"
2. Observar las opciones disponibles
3. Seleccionar una opción válida (ej: primera opción)
4. Completar resto del formulario
5. Intenta guardar
6. Vuelve atrás y prueba con otra "Tipo de Operación"
7. Guarda y verifica que se guardó correctamente

**Resultados Esperados**:
- Campo muestra dropdown o lista con opciones disponibles
- Al menos existen 2+ tipos de operación disponibles
- La selección se persiste en el formulario
- El dato se guarda en la base de datos

**Criterios de Éxito**:
- ✓ Tipo de Operación es seleccionable
- ✓ Múltiples opciones disponibles
- ✓ Datos se guardan correctamente
- ✓ Opción seleccionada se muestra en detalles del viaje

---

### 8. Creación de Múltiples Viajes Secuenciales

**Precondiciones**:
- Usuario autenticado
- Página de creación accesible

**Pasos**:
1. Crear primer viaje completando el formulario correctamente
2. Guardar el viaje
3. Observar si se redirige a listado o página de detalles
4. Navegar nuevamente a "Planificar" para crear otro viaje
5. Crear segundo viaje con datos diferentes
6. Guardar segundo viaje
7. Navegar al listado de viajes (`/viajes/listado`)
8. Verificar que ambos viajes aparecen en la lista
9. Verificar que tienen IDs diferentes
10. Hacer clic en cada viaje para verificar los datos ingresados

**Resultados Esperados**:
- Se pueden crear múltiples viajes sin problemas
- Cada viaje obtiene un ID único e incremental
- Los datos de cada viaje se mantienen distintos
- La lista muestra todos los viajes creados
- No hay corrupción de datos entre viajes
- El contador de viajes en dashboard se actualiza

**Criterios de Éxito**:
- ✓ Múltiples viajes se crean sin conflictos
- ✓ IDs únicos para cada viaje
- ✓ Datos se guardan correctamente para cada viaje
- ✓ Sistema mantiene integridad de datos
- ✓ Dashboard actualiza contadores correctamente

---

### 9. Validación de Campos Opcionales

**Precondiciones**:
- Página de creación cargada
- Formulario con campos opcionales identificados

**Pasos**:
1. Completar solo los campos obligatorios
2. Dejar todos los campos opcionales vacíos
3. Guardar el viaje
4. Verificar que se crea exitosamente sin campos opcionales
5. Crear otro viaje y esta vez completar campos opcionales:
   - Observación: "Carga frágil, manipular con cuidado"
   - Referencias internas/código cliente: "REF-2025-001"
   - Otros campos opcionales si existen
6. Guardar
7. Verificar que los campos opcionales se muestran en los detalles

**Resultados Esperados**:
- Sistema permite crear viaje sin campos opcionales
- Campos opcionales son verdaderamente opcionales (no bloqueadores)
- Cuando se completan, se guardan correctamente
- Los datos opcionales se muestran en el viaje cuando se visualiza

**Criterios de Éxito**:
- ✓ Viaje se crea sin campos opcionales
- ✓ Viaje se crea con todos los campos opcionales completos
- ✓ Campos opcionales se guardan correctamente
- ✓ No hay confusión entre campos obligatorios y opcionales

---

### 10. Manejo de Errores de Conexión/Timeout

**Precondiciones**:
- Página de creación cargada
- Conexión a internet disponible

**Pasos**:
1. Completar el formulario correctamente
2. Simular pérdida de conexión (si es posible en desarrollo)
3. Intentar guardar
4. Observar cómo maneja el error
5. Restaurar conexión
6. Intentar guardar nuevamente
7. Alternativamente, esperar tiempo largo (>30 segundos) antes de guardar
8. Verificar si muestra timeout

**Resultados Esperados**:
- Si hay error de conexión, se muestra mensaje amistoso: "Verifique su conexión a internet"
- Los datos ingresados se preservan (no se pierden al fallar el guardado)
- Se ofrece opción de reintentar
- No se crea viaje duplicado si se reinten múltiples veces
- Timeout se maneja correctamente (>30-60 segundos)

**Criterios de Éxito**:
- ✓ Errores de conexión se manejan graciosamente
- ✓ Datos del usuario se preservan
- ✓ No hay duplicación de datos
- ✓ Mensajes de error en español y claros

---

### 11. Creación de Viaje Marcado para Transporte Específico

**Precondiciones**:
- Página de creación cargada
- Información de transportista disponible en formulario (si existe)

**Pasos**:
1. Si la página permite especificar transportista al crear viaje:
   a. Buscar campo "Transportista" o "Transporte Asignado"
   b. Si existe, seleccionar un transportista
   c. Completar resto del formulario
   d. Guardar
   e. Verificar estado resultante
2. Si NO se permite asignar transporte al crear:
   a. Crear viaje normalmente
   b. Verificar que estado resultante es "Planificado"
   c. Luego ir a Viajes → Asignar para asignar transporte

**Resultados Esperados**:
- Si se permite asignar transporte en creación:
  - Viaje se crea con estado "Asignado" o "Asignado Parcial"
  - El transportista queda vinculado
  - Se valida que exista el transportista
- Si no se permite en creación:
  - Viaje se crea con estado "Planificado"
  - El campo de transporte no está disponible

**Criterios de Éxito**:
- ✓ Sistema maneja correctamente la asignación de transportista
- ✓ Estados reflejan correctamente si hay asignación
- ✓ Datos de transportista se guardan si se proporcionan

---

### 12. Visualización y Confirmación Previa a Guardar

**Precondiciones**:
- Página de creación cargada
- Formulario parcialmente completado

**Pasos**:
1. Completar el formulario con datos de prueba válidos
2. Hacer clic en botón "Guardar" o "Crear Viaje"
3. Observar si aparece modal de confirmación antes de crear
4. Si existe modal:
   a. Revisar que muestre un resumen de los datos
   b. Hacer clic en "Cancelar" - verificar que NO se crea el viaje
   c. Volver a llenar formulario e intentar guardar nuevamente
   d. Esta vez hacer clic en "Confirmar" - verificar que SÍ se crea
5. Si NO existe modal:
   a. Verificar que crea directamente después de hacer clic

**Resultados Esperados**:
- Modal de confirmación es opcional pero deseable para UX
- Si existe, muestra resumen claro de datos
- "Cancelar" no crea el viaje
- "Confirmar" crea el viaje exitosamente
- Si no existe modal, la creación es inmediata y confiable

**Criterios de Éxito**:
- ✓ Proceso de creación es claro
- ✓ Usuario puede revisar datos antes de confirmar (preferible)
- ✓ Cancelación funciona correctamente
- ✓ Confirmación genera el viaje esperado

---

### 13. Redirección Post-Creación

**Precondiciones**:
- Viaje creado exitosamente

**Pasos**:
1. Después de guardar el viaje, observar a dónde redirige:
   - ¿A la página de detalles del viaje creado?
   - ¿Al listado de viajes?
   - ¿A la página de asignación?
   - ¿Al mismo formulario para crear otro viaje?
2. Verificar que el ID del viaje está disponible/visible
3. Si se redirige a detalles:
   - Verificar que muestra todos los datos ingresados
   - Verificar botones disponibles (Editar, Asignar, Eliminar, etc.)
4. Si se redirige al listado:
   - Verificar que el viaje aparece en la lista
   - Verificar que está en la primera posición o filtrado correctamente

**Resultados Esperados**:
- La redirección es lógica y útil
- El usuario puede ver el viaje que acaba de crear
- El ID está claramente visible
- Los datos creados son verificables inmediatamente

**Criterios de Éxito**:
- ✓ Redirección es apropiada
- ✓ Viaje creado es visible
- ✓ ID está disponible para referencia
- ✓ Usuario sabe qué hacer a continuación

---

### 14. Validación de Datos Duplicados

**Precondiciones**:
- Viaje ya existe en el sistema
- Página de creación cargada

**Pasos**:
1. Intentar crear un viaje con exactamente los mismos datos que uno existente:
   - Mismo cliente
   - Mismo origen/destino
   - Misma fecha
   - Mismo tipo de operación
   - Misma unidad de negocio
2. Intentar guardar
3. Observar cómo maneja el sistema

**Resultados Esperados**:
- Opciones posibles según política del negocio:
  A. Se permite crear viajes duplicados (no hay validación)
  B. Se muestra advertencia: "Ya existe un viaje similar"
  C. Se bloquea la creación: "No se puede crear viaje duplicado"
  D. Se genera ID único pero se marca de alguna forma

**Nota**: Este comportamiento depende de los requerimientos del negocio

**Criterios de Éxito**:
- ✓ Sistema maneja duplicados de forma consistente
- ✓ Si hay duplicados, se comunica claramente al usuario
- ✓ Comportamiento es lógico según negocio

---

### 15. Prueba de Responsividad del Formulario

**Precondiciones**:
- Página de creación cargada en navegador
- Acceso a herramientas de desarrollador para cambiar resolución

**Pasos**:
1. Ver formulario en resolución de escritorio (1920x1080)
   - Verificar que se ve bien
   - Completar y guardar un viaje exitosamente
2. Cambiar resolución a tablet (768x1024)
   - Verificar que formulario es usable
   - Campos no se sobrelapan
   - Botones son clickeables
3. Cambiar resolución a móvil (375x667)
   - Verificar que formulario es completable
   - Scroll funciona correctamente
   - Campos son accesibles
4. Completar y guardar un viaje desde móvil

**Resultados Esperados**:
- Formulario es responsivo en todas las resoluciones
- Todos los campos son accesibles
- Botones se pueden hacer clic fácilmente
- No hay contenido cortado o fuera de pantalla
- Scrolling funciona correctamente
- En móvil, el teclado virtual no bloquea campos importantes

**Criterios de Éxito**:
- ✓ Formulario funcional en escritorio, tablet y móvil
- ✓ UX es buena en todas las resoluciones
- ✓ Creación de viajes funciona en todos los tamaños
- ✓ Sin broken layout

---

### 16. Prueba de Accesibilidad

**Precondiciones**:
- Página de creación cargada
- Navegador con soporte para accesibilidad

**Pasos**:
1. Navegar por el formulario usando solo TAB
   - Verificar que todos los campos son accesibles
   - Verificar que el orden es lógico (izquierda a derecha, arriba a abajo)
2. Usar lector de pantalla (si está disponible)
   - Verificar que los labels se leen correctamente
   - Verificar que se anuncia qué campo es obligatorio
3. Verificar contraste de colores
   - Texto debe ser legible contra fondo
   - Rojo en errores debe ser distinto del color de deshabilitado
4. Probar navegación con Enter
   - Enter en botones debe activarlos
   - Enter en dropdowns debe abrirlos

**Resultados Esperados**:
- Todos los campos tienen labels accesibles
- Orden de tabulación es lógico
- Lector de pantalla interpreta correctamente los campos
- Colores cumplen con estándares WCAG AA mínimo
- Navegación por teclado funciona completamente

**Criterios de Éxito**:
- ✓ Formulario es accesible para usuarios con discapacidades
- ✓ Cumple con WCAG 2.1 AA mínimo
- ✓ Navegación por teclado funciona
- ✓ Labels asociados correctamente a campos

---

## Matriz de Resumen de Pruebas

| # | Escenario | Prioridad | Tipo | Resultado Esperado | Estado |
|---|-----------|-----------|------|-------------------|--------|
| 1 | Crear viaje básico | CRÍTICA | Funcional | Viaje creado con estado Planificado | ⏳ |
| 2 | Validación de campos obligatorios | CRÍTICA | Validación | Errores en campos requeridos | ⏳ |
| 3 | Validación de fecha | ALTA | Validación | Fechas válidas aceptadas | ⏳ |
| 4 | Selección de unidad de negocio | ALTA | Funcional | Se guarda correctamente | ⏳ |
| 5 | Selección de cliente | ALTA | Funcional | Búsqueda y selección funcionan | ⏳ |
| 6 | Ingreso de origen/destino | ALTA | Funcional | Datos se guardan | ⏳ |
| 7 | Tipo de operación | MEDIA | Funcional | Se selecciona y guarda | ⏳ |
| 8 | Múltiples viajes secuenciales | MEDIA | Funcional | IDs únicos, sin corrupción | ⏳ |
| 9 | Campos opcionales | MEDIA | Validación | Opcionales son verdaderamente opcionales | ⏳ |
| 10 | Errores de conexión | ALTA | Confiabilidad | Manejo gracioso de errores | ⏳ |
| 11 | Asignación de transporte | MEDIA | Funcional | Estados reflejan asignación | ⏳ |
| 12 | Confirmación previa | BAJA | UX | Modal de confirmación funcional | ⏳ |
| 13 | Redirección post-creación | MEDIA | Funcional | Redirección apropiada | ⏳ |
| 14 | Duplicados | MEDIA | Validación | Manejo consistente | ⏳ |
| 15 | Responsividad | MEDIA | UI/UX | Funcional en escritorio/tablet/móvil | ⏳ |
| 16 | Accesibilidad | BAJA | Accesibilidad | WCAG AA cumplido | ⏳ |

---

## Notas Adicionales

### Ambiente de Pruebas
- **URL Base**: https://moveontruckqa.bermanntms.cl
- **Usuario de Prueba**: arivas / arivas
- **Navegadores Soportados**: Chrome, Firefox, Safari, Edge (versiones recientes)
- **Idioma**: Español (español-chileno)

### Datos Críticos
- **Clientes de Prueba**: Clientedummy, Cliente Con Contrato, Cliente Sin Contrato
- **Unidades de Negocio**: Defecto, Seco, Whatr
- **Rango de Fechas para Pruebas**: 02/12/2025 - 31/12/2025

### Áreas de Enfoque
1. **Validación de Datos**: Campos obligatorios, formatos, rangos válidos
2. **Integridad de Datos**: No hay pérdida de información
3. **Estados Iniciales**: Los viajes siempre comienzan en "Planificado"
4. **Usabilidad**: Interfaz en español es clara y lógica
5. **Rendimiento**: Formulario responde rápidamente, incluso con listas grandes de clientes
6. **Confiabilidad**: Manejo de errores y casos excepcionales

### Dependencias del Sistema
- Se requiere acceso a la base de datos de clientes actualizada
- Se requiere acceso a unidades de negocio configuradas
- Se requiere que tipos de operación estén disponibles
- Se requiere acceso a zonas geográficas si se usa búsqueda de origen/destino

### Criterios de Aceptación Globales
- ✓ Todos los escenarios CRÍTICOS deben pasar
- ✓ Mínimo 90% de escenarios ALTOS deben pasar
- ✓ Mínimo 80% de escenarios MEDIOS deben pasar
- ✓ Escenarios de accesibilidad se verifican manualmente
- ✓ No hay errores de servidor (HTTP 500+)
- ✓ No hay datos corruptos en la base de datos
- ✓ Los viajes creados son permanentes y recuperables

---

**Documento Preparado Para**: Equipo de QA - MoveOnTruck  
**Versión**: 1.0  
**Fecha**: 02 de Diciembre, 2025  
**Idioma**: Español (España/Chile)
