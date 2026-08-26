# Brief Wizard

## Qué es

El brief wizard es el formulario por pasos que vive en `/brief/[client]` y sirve para capturar contexto comercial, necesidades del proyecto y prioridades.
La ruta `/brief` ahora es una pantalla de entrada informativa, no el formulario en sí.

Hoy está montado como un wizard configurable en Astro + React, con:

- una configuración base del formulario;
- tipos tipados para slides, preguntas, validaciones y visibilidad;
- persistencia local en `localStorage` para reanudar el progreso;
- envío final a Formspree;
- soporte para contenido estático, campos simples y lógica condicional.

## Dónde vive cada cosa

- Configuración base: `src/lib/brief-wizard/defaultConfig.ts`
- Perfiles por cliente: `src/lib/brief-wizard/clientProfiles.ts`
- Tipos: `src/lib/brief-wizard/types.ts`
- Lógica de evaluación y helpers: `src/lib/brief-wizard/evaluate.ts`
- Render del wizard: `src/components/organisms/Wizard/index.tsx`
- Gate por cliente y estados de carga/success: `src/components/organisms/BriefClientGate/index.tsx`
- Render del slide: `src/components/organisms/Wizard/StepSlide.tsx`
- Página de entrada del brief: `src/pages/brief.astro`
- Ruta por cliente: `src/pages/brief/[client].astro`
- Ruta de éxito por cliente: `src/pages/brief/[client]/success.astro`

## Cómo funciona

1. `brief/[client].astro` monta el brief del cliente y le pasa su configuración.
2. El wizard normaliza la configuración y crea el estado inicial.
3. Las respuestas se van guardando en `localStorage`.
4. Al avanzar, se validan las preguntas visibles del slide actual.
5. En el último paso, el wizard muestra un resumen editable.
6. Al confirmar, el wizard construye el payload y lo envía a Formspree.

## Modelo mental

El formulario se organiza así:

- `WizardConfig`
  - título general, descripción, tema, botones, slides.
- `WizardSlide`
  - título, subtítulo, descripción, visibilidad y preguntas.
- `WizardQuestion`
  - uno de varios tipos: `text`, `textarea`, `radio`, `multiselect`, `checkbox`, `file`, `image`, `date`, `static`, `title`, `subtitle`.

## Tipos de pregunta

### Campos de texto

- `text`
- `email`
- `tel`
- `url`
- `number`
- `date`

Usarlos para respuestas cortas o datos estructurados.

### Campos largos

- `textarea`
- `richtext`

Usarlos para contexto, explicación y respuestas más abiertas.

### Opciones

- `select`
- `radio`
- `multiselect`

Usarlos cuando quieras limitar el formato de respuesta y facilitar la captura.

### Booleanos

- `checkbox`

### Archivos

- `file`
- `image`

### Contenido no interactivo

- `static`
- `title`
- `subtitle`

Usarlos para texto de introducción, instrucciones o bloques de contexto.

## Cómo se agregan preguntas

Las preguntas se agregan en `src/lib/brief-wizard/defaultConfig.ts`, dentro del `slides` correspondiente.

Ejemplo:

```ts
{
  id: "contact_email",
  type: "email",
  label: "Correo de contacto",
  required: true,
  placeholder: "raymundo@empresa.com",
}
```

### Reglas recomendadas

- Cada `id` debe ser único en todo el wizard.
- Usa un `id` estable y descriptivo.
- Si la respuesta es importante para la propuesta, hazla `required`.
- Si la pregunta sólo aplica en cierto contexto, usa `visibleWhen`.
- Si el input necesita guía extra, usa `description` o `helperText`.

## Cómo se agregan respuestas y validaciones

Las respuestas se derivan de `answers`, que es un mapa `{ [questionId]: value }`.

Para validar:

- `required` marca el campo obligatorio.
- `validations` agrega reglas de validación específicas.
- `maxSelections` limita multiselección.

Ejemplos útiles:

```ts
{
  id: "project_budget",
  type: "number",
  label: "Presupuesto estimado",
  required: true,
  validations: [
    { type: "min", value: 1, message: "El presupuesto debe ser mayor a 0." },
  ],
}
```

```ts
{
  id: "services_needed",
  type: "multiselect",
  label: "Qué necesitas?",
  options: [...],
  maxSelections: 5,
}
```

## Visibilidad condicional

Para mostrar u ocultar preguntas o slides según otras respuestas, usa `visibleWhen`.

Ejemplo:

```ts
{
  id: "budget_details",
  type: "textarea",
  label: "Cuéntanos más del presupuesto",
  visibleWhen: {
    questionId: "project_goal_primary_goal",
    operator: "equals",
    value: "launch",
  },
}
```

Esto permite:

- mostrar sólo lo relevante;
- reducir fricción;
- crear experiencias distintas por tipo de cliente sin duplicar el wizard.

## Cómo se prellenan datos

Hay dos mecanismos prácticos:

### 1. `initialAnswers`

Es la forma recomendada para datos que vienen de una versión por cliente.

El componente `Wizard` acepta `initialAnswers`, así que una página cliente puede pasar respuestas ya listas al montar el formulario.

### 2. `defaultValue`

La lógica de evaluación ya respeta `defaultValue` si existe en la pregunta.

Si se quiere estandarizar su uso con autocompletado y tipado, conviene agregarlo explícitamente al tipo de pregunta correspondiente en `types.ts`.

## Cómo guardar progreso

Hoy el wizard guarda un borrador en `localStorage` con una clave fija:

- `portfolio-astro:brief-wizard:v1`

Cada cliente usa su propia variante:

- `portfolio-astro:brief-wizard:v1:seguro-con-sentido`

Además, cuando el formulario se envía con éxito, se guarda una marca separada:

- `portfolio-astro:brief-wizard:v1:seguro-con-sentido:submitted`

Así se evita mezclar respuestas entre clientes.

## Cómo agregar un cliente

Sin backend, la forma recomendada es una configuración local por slug.

### Estructura sugerida

```txt
src/
  lib/
    brief-wizard/
      clientProfiles.ts
  pages/
    brief/
      [client].astro
```

### Qué debe contener el perfil del cliente

Un cliente debería definir, como mínimo:

- `slug`
- `title`
- `subtitle`
- `description`
- `theme`
- `initialAnswers`
- `hiddenQuestionIds`
- `requiredQuestionIds`
- `aliases`, si quieres que el mismo cliente responda también a otros slugs

### Qué hace la ruta por cliente

La página `src/pages/brief/[client].astro`:

- resuelve el slug;
- carga el perfil local del cliente;
- mezcla los datos del cliente con el wizard base;
- hidrata `Wizard` con `initialAnswers`, branding y títulos personalizados;
- redirige a `/brief/[client]/success` si ya existe una respuesta enviada;
- guarda el borrador con una key separada por `wizardId`.

### Resumen y edición

Antes de enviar, el wizard muestra un resumen de todas las respuestas visibles.

- Cada bloque tiene un botón `Editar`.
- `Editar` lleva al slide correspondiente y resalta la pregunta.
- Al continuar desde esa edición, el wizard regresa al resumen en lugar de recorrer todo de nuevo.

### Estados de envío

- Mientras se hace `submit`, el wizard muestra un loading full-page.
- Si falla, muestra una pantalla de error con opción de reintentar.
- Si sale bien, marca el brief como enviado y redirige a `/brief/[client]/success`.

### Pregunta extra para Seguro con Sentido

El wizard base ya incluye una pregunta condicional para finanzas:

- `insurance_priority_lines`

Se muestra cuando `business_context_category = finance` y sirve para saber qué líneas de seguros priorizar primero.

### Ejemplo de perfil

```ts
export const seguroConPropositoClient = {
  slug: "seguro-con-proposito",
  title: "Brief para Seguro con Propósito",
  subtitle: "Cuéntanos sobre tu proyecto",
  description: "Formulario personalizado para este cliente.",
  initialAnswers: {
    contact_company_name: "Seguro con Propósito",
    contact_website: "https://...",
    business_context_category: "finance",
  },
}
```

### Flujo de la página por cliente

1. La ruta `/brief/[client]` recibe el slug.
2. Se busca el perfil en un catálogo local.
3. Se construye el config final:
   - base wizard;
   - overrides del cliente;
   - `initialAnswers`;
   - theme/copy.
4. Se monta `Wizard` con esa configuración.
5. Se guarda el progreso bajo una clave propia del cliente.

## Qué conviene personalizar por cliente

Esto sí vale la pena variar:

- copy de bienvenida;
- descripción general;
- color o tema visual;
- logo o identidad;
- algunas respuestas ya prellenadas;
- preguntas ocultas;
- preguntas obligatorias.

## Qué conviene mantener en el wizard base

Esto debe seguir compartido:

- lógica de navegación;
- validación;
- persistencia;
- envío final;
- estructura de slides y preguntas;
- helpers de evaluación;
- componentes de render.

## Recomendación de implementación

Si se va a construir la versión por cliente, yo lo haría en este orden:

1. Crear el catálogo de clientes.
2. Crear la ruta dinámica `/brief/[client]`.
3. Extender el config base con overrides por cliente.
4. Hacer que `localStorage` use una key por cliente.
5. Agregar `initialAnswers` para los datos que ya se conocen.
6. Después, si hace falta, permitir branding más fino por cliente.

## Qué pasarte para pedirle a Mateo

Si le vas a pedir esto a Mateo, pásale exactamente esto:

- que no duplique el wizard;
- que cree una versión por cliente usando un wizard base común;
- que la ruta sea `/brief/[client]`;
- que cada cliente pueda traer copy propio, tema propio y respuestas prellenadas;
- que el progreso se guarde por cliente;
- que no use backend;
- que todo quede documentado y tipado.

## Definición de terminado

Se considera listo cuando:

- `brief.astro` o la ruta por cliente renderiza correctamente;
- el perfil del cliente carga por slug;
- hay datos prellenados;
- el progreso se guarda por cliente;
- el formulario base sigue funcionando sin duplicación;
- la documentación de este archivo coincide con la implementación.
