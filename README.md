# Front-Reto-Tecnico

Proyecto base con React + Vite organizado con una estructura pensada para crecer sin mezclar responsabilidades. La referencia principal para esta organización es la guía de estructura recomendada para React 2025.

## Estructura del proyecto

### Raíz
- `index.html`: punto de entrada del navegador para Vite.
- `package.json`: scripts, dependencias y metadatos del proyecto.
- `vite.config.js`: configuración de Vite.
- `eslint.config.js`: reglas de linting.
- `README.md`: documentación del proyecto.
- `.env.example`: plantilla de variables de entorno.

### `public/`
Archivos estáticos servidos tal cual por Vite.
- Ideal para íconos, imágenes públicas, favicon y recursos que no pasan por el bundler.

### `src/`
Código fuente de la aplicación.

#### `src/assets/`
Recursos estáticos importados desde el código.
- Imágenes internas, SVG, tipografías y otros medios reutilizables.

#### `src/components/`
Componentes reutilizables de UI.
- `common/`: base para componentes compartidos de uso general, como botones, inputs, modales o tarjetas.
- `layout/`: componentes de estructura visual reutilizable, como header, footer, sidebar o navbar.

#### `src/config/`
Configuración de la aplicación.
- Variables de entorno normalizadas.
- Constantes de configuración global.
- Endpoints base, flags de feature y opciones de entorno.

#### `src/context/`
Contextos globales de React.
- Providers para auth, tema, sesión o estado compartido entre pantallas.

#### `src/features/`
Módulos por funcionalidad o dominio.
- Cada feature puede agrupar componentes, hooks, servicios y estado propio.
- Es la carpeta ideal para separar lógica por negocio, por ejemplo `auth`, `dashboard` o `profile`.

#### `src/hooks/`
Hooks personalizados reutilizables.
- Lógica compartida para fetching, formularios, debounce, validaciones o acceso a datos.

#### `src/pages/`
Vistas a nivel de ruta.
- Cada archivo o carpeta representa una pantalla completa o una página navegable.

#### `src/routes/`
Configuración de rutas.
- Definición de rutas públicas y protegidas.
- Composición del router principal de la app.

#### `src/services/`
Capa de comunicación externa.
- Llamadas a APIs.
- Instancias de `fetch` o `axios`.
- Integraciones con servicios externos.

#### `src/store/`
Estado global de la aplicación.
- Redux, Zustand, Recoil o cualquier otra solución de estado compartido.
- Aquí suele vivir la configuración central del store y los slices o módulos globales.

#### `src/styles/`
Estilos globales.
- Variables visuales.
- Hojas de estilo globales.
- Temas o tokens de diseño.

#### `src/types/`
Tipos e interfaces compartidas.
- Especialmente útil si el proyecto migra a TypeScript.
- Tipos de respuestas de API, entidades y props reutilizables.

#### `src/utils/`
Funciones utilitarias.
- Formateo de fechas, validaciones, helpers, constantes y funciones puras compartidas.

### Nota de estructura
- La guía también suele mencionar una carpeta `layouts/`, pero en este proyecto esa responsabilidad se agrupa dentro de `src/components/layout/`.
- Si más adelante el proyecto crece, se puede dividir por feature y mover componentes compartidos sin romper la organización general.

## Recomendación práctica
Para este proyecto conviene mantener la separación por responsabilidad: componentes reutilizables en `components`, lógica de negocio en `features`, acceso a datos en `services`, estado global en `store` y utilidades puras en `utils`.
