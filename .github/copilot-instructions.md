# Hackscate - Instrucciones para GitHub Copilot

## Descripción del Proyecto

Hackscate es el sitio web oficial del evento de hackathon organizado por Open Source UC (OSUC) en la Pontificia Universidad Católica de Chile. Es una aplicación web estática construida con tecnologías modernas.

## Stack Tecnológico

### Framework Principal
- **Astro v5.15.3**: Framework web moderno con arquitectura de islas (Islands Architecture)
- Renderizado estático por defecto (SSG - Static Site Generation)
- 0 JavaScript enviado al cliente por defecto
- File-based routing en el directorio `src/pages/`

### Styling
- **Tailwind CSS v4.1.16**: Framework utility-first
- **@tailwindcss/vite v4.1.16**: Plugin de Vite para Tailwind v4
- Configuración mediante sintaxis `@theme` en archivos CSS
- Fuente personalizada: **Mona Sans**
- **Sistema de tokens de color personalizado**:
  - `--color-primary` / `text-primary` / `bg-primary`: Color de texto principal (#D9D9D9)
  - `--color-background` / `bg-background`: Color de fondo principal (#111111)
  - `--color-accent` / `text-accent` / `bg-accent`: Color de acento azul (#138DFF)

### TypeScript
- Configuración estricta (`astro/tsconfigs/strict`)
- Path aliases configurados:
  - `@/*` → `src/*`
  - `@layouts/*` → `src/layouts/*`
  - `@components/*` → `src/components/*`

### Build Tool
- **Vite**: Bundler integrado con Astro

## Estructura del Proyecto

```
src/
├── assets/              # Assets procesados por Vite
├── components/          # Componentes reutilizables de Astro
│   ├── icons/          # Componentes de iconos (OsucIcon.astro)
│   └── sponsors/       # Componentes para sponsors (NumberedCard, Sidebar, SponsorshipTable)
├── layouts/            # Layouts de página (Layout.astro)
├── pages/              # Rutas (file-based routing)
│   ├── index.astro    # Landing page
│   └── sponsors.astro # Página de sponsors
└── styles/             # Estilos globales
    ├── global.css     # Importa theme.css y Tailwind
    └── theme.css      # Variables de tema personalizadas
```

## Convenciones de Código

### Componentes Astro
- Usar extensión `.astro` para componentes
- Estructura: frontmatter (---) seguido de template HTML
- Importar componentes usando path aliases (`@/` o `@components/`, `@layouts/`)
- Ejemplo:
```astro
---
import Layout from "@layouts/Layout.astro";
import Component from "@components/Component.astro";
---

<Layout title="Page Title">
  <Component />
</Layout>
```

### Styling
- **Priorizar Tailwind utility classes** en lugar de CSS personalizado
- Usar clases de Tailwind directamente en los componentes
- Para estilos globales, usar `src/styles/global.css`
- Para variables de tema, usar `src/styles/theme.css`
- Sintaxis de Tailwind v4 con `@theme` directive
- **Siempre usar tokens de color en lugar de valores hexadecimales**:
  - `text-primary` o `bg-primary`: Para el color de texto principal
  - `bg-background`: Para el color de fondo principal
  - `text-accent` o `bg-accent`: Para el color de acento azul

### TypeScript
- Siempre usar imports con path aliases cuando sea posible
- Ejemplos válidos:
  - `import Layout from "@layouts/Layout.astro"`
  - `import { something } from "@/utils/helpers"`
  - `import Component from "@components/icons/OsucIcon.astro"`

### Naming Conventions
- Componentes: PascalCase (ej: `NumberedCard.astro`, `SponsorshipTable.astro`)
- Archivos de páginas: kebab-case o lowercase (ej: `index.astro`, `sponsors.astro`)
- Directorios: lowercase (ej: `components/`, `layouts/`)

## Características del Proyecto

### Páginas Actuales
1. **`/` (index.astro)**: Landing page "Work in Progress" con diseño minimalista
2. **`/sponsors` (sponsors.astro)**: Página informativa para patrocinadores con:
   - Sidebar de navegación (sticky en desktop)
   - Secciones: About us, The Event, Attendee Profile, Prospective Matrix, Contact
   - Tabla de niveles de sponsorship
   - Diseño responsive (mobile-first)

### Componentes Clave
- **Layout.astro**: Layout base con meta tags y configuración de página
- **Sidebar.astro**: Navegación lateral para la página de sponsors
- **NumberedCard.astro**: Tarjeta numerada para mostrar información
- **SponsorshipTable.astro**: Tabla de beneficios de sponsorship
- **OsucIcon.astro**: Icono del logo de OSUC

## Patrones de Diseño

### Responsive Design
- Mobile-first approach
- Breakpoints de Tailwind: `sm:`, `md:`, `lg:`, `xl:`
- Sidebar oculto en mobile (`hidden lg:inline`)

### Color Scheme
- **Usar siempre tokens de color**, no valores hexadecimales directos
- Token `primary`: #D9D9D9 (gris claro - texto)
- Token `background`: #111111 (negro oscuro - fondo)
- Token `accent`: #138DFF (azul - acentos)
- Efectos de sombra: `rgb(19 141 255)` para glow effects con accent color

### Layout Patterns
- Uso de Flexbox para layouts principales
- Sticky sidebar en desktop
- Max-width containers para contenido (`lg:max-w-2xl xl:max-w-4xl`)

## Comandos Disponibles

- `npm run dev` - Servidor de desarrollo (localhost:4321)
- `npm run build` - Build de producción
- `npm run preview` - Preview de la build

## Guías para Copilot

### Al crear nuevos componentes:
1. Usar la extensión `.astro`
2. Incluir frontmatter si necesita imports o lógica
3. Usar path aliases para imports
4. Aplicar clases de Tailwind para styling
5. Seguir la estructura de carpetas existente

### Al agregar estilos:
1. Priorizar utility classes de Tailwind
2. Solo agregar CSS personalizado si es absolutamente necesario
3. Mantener consistencia con el color scheme existente

### Al crear páginas:
1. Colocar en `src/pages/` (file-based routing)
2. Envolver contenido en `<Layout>` component
3. Configurar title y meta tags apropiados
4. Mantener diseño responsive

### Al trabajar con TypeScript:
1. Usar siempre path aliases configurados
2. Mantener tipado estricto
3. No usar `any` a menos que sea absolutamente necesario

## Contexto del Proyecto

- **Organización**: Open Source UC (OSUC)
- **Universidad**: Pontificia Universidad Católica de Chile
- **Evento**: Hackscate (hackathon)
- **Fundación OSUC**: 2006
- **Enfoque**: Proyectos de innovación tecnológica estudiantil

## Notas Importantes

- El proyecto usa Astro 5.x (última versión estable)
- Tailwind CSS v4 tiene nueva sintaxis con `@theme`
- No enviar JavaScript innecesario al cliente (aprovechar SSG de Astro)
- Optimizar para rendimiento y SEO
- Mantener accesibilidad (a11y) en todos los componentes
