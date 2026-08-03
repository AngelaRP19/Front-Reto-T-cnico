# Internacionalización (lingui) — cómo funciona

Referencia de cómo está armado el soporte de idiomas (español / inglés / francés) con [lingui](https://lingui.dev/). Igual que `ROUTING.md`, esto describe lo que hay implementado hoy, con sus decisiones y sus puntos flojos — no es la documentación oficial de la librería.

## Qué usa

Del ecosistema de lingui, el proyecto instala 4 paquetes, pero en la práctica solo usa 2 en tiempo de ejecución:

| Paquete | Para qué está | ¿Se usa hoy? |
|---|---|---|
| `@lingui/core` | El motor de traducción (`i18n.load()`, `i18n.activate()`, `i18n._()`) | **Sí**, es la base de todo |
| `@lingui/react` | El hook `useLingui()` y el `<I18nProvider>` | **Sí**, es como los componentes acceden al idioma activo |
| `@lingui/cli` | Los comandos `lingui extract`/`lingui compile` para generar catálogos desde el código | Instalado y con scripts en `package.json`, pero **no forma parte del flujo real** (ver más abajo) |
| `@lingui/macro` (+ `babel-plugin-macros`) | El macro `` t`texto` ``/`<Trans>` que permite escribir el texto original directo en el JSX y que se extraiga solo | Instalado, **no se usa en ningún archivo** — no hay un solo `import ... from "@lingui/macro"` ni `<Trans>` en `src/` |

Esto importa porque significa que **lingui se está usando en su modo "manual"** (API en tiempo de ejecución con IDs de string), no en el modo "macro" que es el que muestra la documentación oficial por defecto. Cualquiera que llegue a este proyecto esperando ver `` t`Hola` `` o `<Trans>Hola</Trans>` en el JSX no lo va a encontrar — acá el patrón es otro (ver la sección siguiente).

## Cómo se usa en un componente

El patrón, repetido en **todos** los componentes que tienen texto traducible (`Navbar`, `Footer`, `Hero`, `LoginPage`, `RegisterPage`, `ForgotPasswordPage`, `ResetPasswordPage`, `ChallengesPage`, `CardChallenge`, todo `features/profile/*`, `ExpansionDetail`), es siempre el mismo:

```jsx
import { useLingui } from "@lingui/react";

function MiComponente() {
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

  return <h1>{t("miComponente.titulo", "Texto en español por si falta la traducción")}</h1>;
}
```

- `t(id, message)` es una función local, **redefinida en cada archivo** (no hay un hook `useT()` ni un helper compartido) — es un wrapper de una línea sobre `i18n._({ id, message })`, la API real de `@lingui/core`.
- `id` es la clave que se busca en el catálogo del idioma activo (ver más abajo el formato, ej. `"navbar.home"`, `"login.button"`, `"profile.info.title"`). La convención de nombres es `dominio.subseccion.campo`, calcada de cómo está organizada `src/features/`.
- `message` es el texto en **español** que se muestra si el catálogo activo no tiene esa clave (fallback) — por eso cada `t(...)` en el código ya es legible en español aunque nunca se cargue ningún catálogo.
- Como cada componente redefine `t` a mano, si un componente nuevo necesita traducción hay que copiar esas dos líneas (`useLingui` + la función `t`) — no hay una forma más corta hoy.

**Cobertura parcial**: no todos los componentes están traducidos. `HomePage.jsx`, `card.jsx` y algunos textos sueltos (ej. "Añadir al carrito 🛒" en `ExpansionDetail.jsx`) siguen con el string en español hardcodeado, sin pasar por `t(...)`. No es un bug — es simplemente que la migración a lingui no llegó a esos archivos todavía.

## Los catálogos: `src/locales/{locale}/messages.js`

Cada idioma soportado tiene su propio archivo, un objeto plano `id → texto traducido`:

```js
// src/locales/es/messages.js
export const messages = {
  "auth.backToHome": "Volver al inicio",
  "login.title": "Iniciar sesión",
  "login.button": "Ingresar",
  // ...155 claves en total
};
```

Tres idiomas tienen catálogo: `es` (155 claves), `en` (155 claves), `fr` (153 claves). **Estos archivos están escritos/mantenidos a mano** — no salieron de correr `lingui compile` sobre algo extraído del código: los `.po` que debería generar `lingui extract` (`src/locales/es/messages.po`, `src/locales/en/messages.po`) están **vacíos** (0 bytes), y `fr` ni siquiera tiene un `.po` — solo el `.js` final. Si alguien corre `npm run extract` hoy, no va a tocar estos catálogos existentes de forma útil (ver la sección de gotchas).

## Configuración

### `src/lingui.config.js`

```js
module.exports = {
  locales: ["en", "es"],        // idiomas soportados
  sourceLocale: "en",           // idioma base
  catalogs: [
    { path: "src/locales/{locale}/messages", include: ["src"] }
  ],
  format: "po",
};
```

Dos detalles a tener en cuenta:
- **`fr` no está declarado acá** (solo `en`/`es`), aunque el catálogo `src/locales/fr/messages.js` existe y la app lo carga sin problema — francés es un idioma que se agregó "por fuera" de lo que sabe `@lingui/cli`.
- **`sourceLocale: "en"`** le dice a `lingui extract` que el texto que encuentre literal en el código (ej. el segundo argumento de `t(id, message)`) es inglés — pero en la práctica todos los `message` de fallback en el código están en **español**. Como el flujo de extracción no se usa activamente, esto no rompe nada hoy, pero si en algún momento se retoma `lingui extract` de verdad, esta configuración va a producir catálogos confusos (mensajes en español etiquetados como si fueran la fuente en inglés).

### `src/i18n.js` — activar y persistir el idioma

Este archivo (no confundir con `src/locales/`) es el que conecta lingui con el resto de la app:

```js
import { i18n } from "@lingui/core";

const SUPPORTED_LOCALES = ["es", "en", "fr"];

export function normalizeLocale(locale) {
  const normalizedLocale = (locale || "").toLowerCase();
  return SUPPORTED_LOCALES.includes(normalizedLocale) ? normalizedLocale : "es";
}

export async function activateLocale(locale) {
  const normalizedLocale = normalizeLocale(locale);
  const { messages } = await import(`./locales/${normalizedLocale}/messages.js`);
  i18n.load(normalizedLocale, messages);
  i18n.activate(normalizedLocale);
  window.localStorage.setItem("app-locale", normalizedLocale);
  return normalizedLocale;
}

export function getInitialLocale() {
  const storedLocale = window.localStorage.getItem("app-locale");
  return normalizeLocale(storedLocale || navigator.language?.split("-")[0] || "es");
}
```

- El idioma elegido se guarda en `localStorage` bajo la clave `"app-locale"` — persiste entre visitas.
- Si no hay nada guardado, usa el idioma del navegador (`navigator.language`) y si no es uno de los 3 soportados, cae a español por defecto.
- `import(`./locales/${locale}/messages.js`)` es un import dinámico — cada catálogo se carga solo cuando se necesita (Vite genera un chunk separado por idioma; se ve en el build como `messages-XXXX.js` × 3).
- `SUPPORTED_LOCALES` acá (`["es","en","fr"]`) es la lista real que usa la app — es **distinta** de `locales` en `lingui.config.js` (`["en","es"]`, sin `fr`). Son dos listas separadas que hay que mantener sincronizadas a mano.

### `src/main.jsx` — arranque

```jsx
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { activateLocale, getInitialLocale } from "./i18n";

async function bootstrapApp() {
  await activateLocale(getInitialLocale());

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <I18nProvider i18n={i18n}>
        <BrowserRouter>
          <ThemeProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </I18nProvider>
    </StrictMode>
  );
}

bootstrapApp();
```

La app **espera** (`await activateLocale(...)`) a que el catálogo del idioma inicial esté cargado antes de montar React — así no hay un parpadeo de textos sin traducir al primer render. `<I18nProvider>` envuelve todo por fuera de `<BrowserRouter>`, así que cualquier componente en cualquier ruta puede usar `useLingui()`.

## `LanguageSelector.jsx` — cómo se cambia el idioma

Es un `<select>` simple, ubicado en `Navbar` (visible en todas las pantallas con layout):

```jsx
function LanguageSelector() {
  const { i18n } = useLingui();
  const [locale, setLocale] = useState(() => normalizeLocale(i18n?.locale || getInitialLocale()));

  const handleChange = async (newLocale) => {
    const normalizedLocale = normalizeLocale(newLocale);
    setLocale(normalizedLocale);
    await activateLocale(normalizedLocale);
  };

  return (
    <select value={locale} onChange={(e) => handleChange(e.target.value)} aria-label="Select language">
      <option value="es">🇪🇸 ES</option>
      <option value="en">🇺🇸 EN</option>
      <option value="fr">🇫🇷 FR</option>
    </select>
  );
}
```

Al elegir un idioma, llama a la misma `activateLocale()` de `src/i18n.js` — carga el catálogo nuevo, lo activa en la instancia global de `i18n` (compartida por `I18nProvider`), y guarda la elección en `localStorage`. Como todos los componentes leen del mismo `i18n` vía `useLingui()`, el cambio se refleja en toda la app sin recargar la página (React vuelve a renderizar los componentes que usan `t(...)` porque `useLingui()` se suscribe a los cambios de `i18n`).

## Scripts de `package.json`

```json
"extract": "lingui extract",
"compile": "lingui compile",
"i18n": "lingui extract && lingui compile"
```

Estos comandos existen pero, como se explicó arriba, **hoy no son el mecanismo real** por el que se agregan traducciones (los `.po` de origen están vacíos). Si se quiere adoptar el flujo estándar de lingui a futuro (recomendado si el proyecto va a seguir creciendo en textos traducidos), el camino sería:
1. Migrar los `t(id, message)` actuales a los macros de `@lingui/macro` (`` t({ id, message }) `` o `<Trans id="...">mensaje</Trans>`) para que `lingui extract` los pueda encontrar automáticamente.
2. Correr `npm run extract` para generar los `.po` reales a partir del código.
3. Traducir los `.po` (a mano o con una herramienta como Crowdin/Weblate).
4. Correr `npm run compile` para generar los `.js` finales — reemplazando los que hoy están escritos a mano.
5. Agregar `fr` a `locales` en `lingui.config.js` para que quede cubierto por el mismo flujo.

## Cómo agregar una traducción nueva (con el flujo actual)

1. En el componente, envolvé el texto: `{t("dominio.campo", "Texto en español")}`.
2. Agregá la misma clave (`"dominio.campo"`) con su traducción en **los tres** `src/locales/{es,en,fr}/messages.js` a mano. Si te olvidás de un idioma, no rompe nada — simplemente ese idioma va a mostrar el `message` de fallback (el texto en español que pusiste en el paso 1) en vez de la traducción real.
3. No hace falta correr ningún script — los catálogos son archivos JS normales, se recargan solos con Vite en desarrollo.

## Cómo agregar un idioma nuevo

1. Crear `src/locales/<codigo>/messages.js` con el mismo formato plano (`id → texto`) que los existentes.
2. Agregar `<codigo>` a `SUPPORTED_LOCALES` en `src/i18n.js`.
3. Agregar una `<option>` en `LanguageSelector.jsx`.
4. (Opcional, para que `lingui extract`/`compile` lo reconozcan si se llega a usar) agregarlo también a `locales` en `src/lingui.config.js`.

## Cosas a tener en cuenta (gotchas)

- **`@lingui/macro` y `@lingui/cli` están instalados pero no se usan activamente** — el proyecto vive en modo "API manual" (`i18n._({id, message})` a mano en cada componente), no en el modo macro que documenta lingui por defecto.
- **Los catálogos `.js` son la fuente de verdad real, no los `.po`** — los `.po` están vacíos y no reflejan el estado actual de las traducciones. No confiar en ellos para saber qué está traducido.
- **`fr` es un idioma "de segunda clase"** respecto a la configuración de `lingui.config.js` (no listado ahí), aunque funciona igual de bien en tiempo de ejecución porque `src/i18n.js` no depende de esa config para nada — la usa solo el CLI, que hoy no se corre.
- **Cobertura incompleta**: `HomePage.jsx`, `card.jsx`, y textos sueltos como el botón "Añadir al carrito 🛒" en `ExpansionDetail.jsx` no pasan por `t(...)` todavía — quedan siempre en español sin importar el idioma elegido.
- **`sourceLocale: "en"`** en la config no coincide con el idioma real de los `message` de fallback en el código (español) — inofensivo mientras no se use `lingui extract` de verdad, pero hay que corregirlo si se retoma ese flujo.
