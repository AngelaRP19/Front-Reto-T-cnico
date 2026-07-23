# Front-Reto-Tecnico

Proyecto React + Vite (Tailwind CSS v4 para estilos) organizado por responsabilidad: componentes de UI reutilizables separados de la lógica de negocio de cada feature (auth, beta testing), con una capa de servicios lista para conectarse a un backend Java.

## Estructura del proyecto

### Raíz
- `index.html`: punto de entrada del navegador para Vite.
- `package.json`: scripts, dependencias y metadatos del proyecto.
- `vite.config.js`: configuración de Vite (incluye el plugin de Tailwind).
- `eslint.config.js`: reglas de linting.
- `README.md`: este archivo.
- `API.md`: cómo funciona la capa de conexión al API y cómo conectar una funcionalidad nueva.
- `.env.example`: plantilla de variables de entorno (copiar a `.env`).

### `public/`
Archivos estáticos servidos tal cual por Vite (favicon, etc.).

### `src/`

#### `src/assets/`
Recursos estáticos importados desde el código (imágenes, SVG).

#### `src/components/`
Componentes de UI reutilizables, sin lógica de negocio.
- `common/`: piezas genéricas usadas en toda la app — `Button.jsx` (variantes `primary`/`outline`/`oauth`/`link`) y `FormInput.jsx` (label + input, con soporte de `error`/`hint`).
- `layout/`: estructura visual del sitio — `navbar.jsx`, `hero.jsx`, `card.jsx`, `footer.jsx`.

#### `src/context/`
Contextos globales de React. Hoy: `ThemeContext.jsx`, maneja el modo claro/oscuro (atributo `data-theme` en `<html>`, consumido por las variables CSS de `src/styles/index.css`).

#### `src/features/`
Módulos por dominio de negocio. Cada feature agrupa sus propias páginas/componentes y su propio servicio de API si necesita hablar con el backend.
- **`auth/`** — inicio de sesión y registro.
  - `pages/loginPage.jsx`, `pages/registerPage.jsx`: las pantallas completas (sin separar en "form" + "page" aparte — no hay router ni otro lugar donde el formulario se use fuera de su pantalla, así que un wrapper adicional no aportaría nada).
  - `services/authService.js`: `login`, `register`, `logout` — conectados al backend Java vía `apiClient` (ver [`API.md`](API.md)).
- **`beta/`** — inscripción a beta testing.
  - `components/subscriptionForm.jsx`: modal de inscripción, abierto desde el botón del navbar.

#### `src/services/`
Cliente HTTP compartido (`apiClient.js`): base URL, headers, token de sesión y manejo de errores centralizados, para que los servicios de cada feature no repitan esa lógica. Ver [`API.md`](API.md) para el detalle completo y cómo agregar un servicio nuevo.

#### `src/styles/`
`index.css` — variables de tema (claro/oscuro) y configuración de Tailwind (`@theme inline`, que mapea las variables CSS a clases utilitarias como `bg-main`, `text-text`, etc.).

#### `src/utils/`
Reservada para funciones utilitarias puras (formateo, validaciones, helpers) compartidas entre features. Vacía por ahora.

#### `src/App.jsx` / `src/main.jsx`
`main.jsx` monta `App` dentro de `ThemeProvider`. `App.jsx` alterna entre pantallas (`home`, `login`, `register`) con un `useState` simple — no hay router instalado todavía.

## Convenciones

- **Componentes reutilizables** van en `components/` (sin lógica de negocio ni llamadas a API). **Lógica de negocio y pantallas** van en `features/<dominio>/`.
- Cada feature que necesite hablar con el backend agrega su propio `features/<dominio>/services/<nombre>Service.js`, construido sobre `src/services/apiClient.js` — nunca `fetch` directo desde un componente. Ver [`API.md`](API.md).
- El tema claro/oscuro se maneja con variables CSS + Tailwind (`src/styles/index.css`) — para agregar un color nuevo, se define ahí (una vez en `:root`, una vez en `[data-theme="dark"]`) y se mapea en el bloque `@theme inline`, no se hardcodean colores nuevos en los componentes.

## Empezar

```bash
npm install
cp .env.example .env   # y ajustar VITE_API_URL si el backend Java no corre en localhost:8081
npm run dev
```
