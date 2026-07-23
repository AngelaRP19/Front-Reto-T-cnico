# Conexión con el backend — inventario por archivo

Referencia rápida de qué archivo hace qué contra el backend Java (`API_GUIDE.md`). Para entender *cómo funciona* la capa de servicios en general (patrones, cómo agregar un endpoint nuevo) ver [`API.md`](API.md) — este documento es el inventario concreto de "qué toca cada archivo hoy".

## Configuración

### `.env` / `.env.example`
- `VITE_API_URL` — URL base del backend (`http://localhost:8081` por defecto). Copiar `.env.example` a `.env` para sobreescribirla.

## Capa base

### `src/services/apiClient.js`
Cliente HTTP compartido, usado por **todos** los servicios de features. No se conecta a ningún endpoint específico, es la base de todos.
- `API_BASE_URL` (export) — arma las URLs completas; también se usa para construir los links de redirect de OAuth (`window.location.href = ...`).
- `request(path, options)` (interno) — hace el `fetch`, agrega `Content-Type: application/json`, agrega `Authorization: Bearer <token>` automáticamente si hay token guardado y `auth !== false`, manda `credentials: "include"` (necesario para que viajen las cookies de sesión de OAuth2 entre `localhost:5173` y `localhost:8081`), y normaliza errores (usa `message` del body si el backend lo manda, o un mensaje genérico de conexión si falla la red).
- `apiClient.get/post/put/del` — wrappers sobre `request`.
- `getToken() / setToken() / clearToken()` — manejan el JWT en `localStorage` (clave `authToken`).

### `src/context/AuthContext.jsx`
No llama a la API directamente (salvo `checkOAuthSession` al montar), pero es el estado global de "quién está logueado" que consumen `Navbar.jsx` y las páginas de auth.
- `user` — objeto con lo que se sepa del usuario (`username`, y/o `firstName`/`lastName`, y/o `name`/`email`/`provider` si vino de OAuth). Persiste en `localStorage` (clave `authUser`) para sobrevivir un refresh.
- `setUser(data)` / `clearUser()` — actualizan el estado y `localStorage`.
- Al montar la app: si no hay `user` ni token guardado, intenta `checkOAuthSession()` una vez (por si el usuario vuelve de un login con Google/Meta) — si falla (caso normal sin sesión OAuth2), se ignora en silencio.

## Feature: `auth`

### `src/features/auth/services/authService.js`
Todas las llamadas de autenticación, construidas sobre `apiClient`.
- `register(payload)` → `POST /auth/register`. Body: `{firstName, lastName, username, email, country, password}`. Guarda el token si viene en la respuesta.
- `login(username, password)` → `POST /auth/login`. Body: `{username, password}` (el backend loguea por `username`, no por email — ver advertencia de `API_GUIDE.md`). Guarda el token.
- `logout()` → `POST /auth/logout` (con el token ya puesto por `apiClient`); si falla la llamada igual limpia el token localmente.
- `checkOAuthSession()` → `GET /auth/oauth2/success`. Requiere sesión OAuth2 activa (cookie, no JWT); devuelve `{token, name, email, provider}` y guarda el token si viene.

### `src/features/auth/pages/loginPage.jsx`
- Formulario usuario/contraseña → llama `login()`. En éxito: `setUser({ username })` (es el único dato que devuelve el login) y dispara `onLoginSuccess`.
- Botones "Google"/"Meta" → navegación de página completa a `${API_BASE_URL}/oauth2/authorization/google` / `/meta` (no es un `fetch`, es un redirect real; el resultado se recoge después vía `checkOAuthSession()` en `AuthContext`).
- Errores de red/backend se muestran con `err.message` (ya normalizado por `apiClient`).

### `src/features/auth/pages/registerPage.jsx`
- Validación de campos en el cliente **antes** de llamar al backend (ver tabla abajo) — si hay errores, no se hace ningún request.
- Formulario válido → llama `register()`. En éxito: `setUser({ username, firstName, lastName })` y dispara `onRegistered`.
- Mismos botones de Google/Meta que Login, mismo mecanismo de redirect.

**Validación de campos** (reglas tomadas de `API_GUIDE.md`):

| Campo | Regla |
|---|---|
| `firstName` / `lastName` | Solo letras y espacios |
| `username` | 3-30 caracteres: letras, números y `_` |
| `email` | Formato de correo válido |
| `country` | 2-56 caracteres |
| `password` | 8-50 caracteres, con mayúscula, minúscula, número y símbolo |
| `confirmPassword` | Debe coincidir con `password` |

(El campo "Nickname" que existía antes se quitó del formulario — no forma parte del body documentado de `/auth/register`.)

### `src/components/layout/Navbar.jsx`
No llama a la API directamente salvo `logout()`. Consume `user` de `AuthContext`:
- Si hay `user`: botón redondo con la inicial de `firstName`/`name`/`username`, que abre una ventana pequeña con el nombre a mostrar, `email`/`provider` si existen, y un botón "Cerrar sesión" que llama `logout()` (de `authService`) y luego `clearUser()`.
- Si no hay `user`: botón "Iniciar sesión" de siempre.

## Feature: `catalog`

### `src/features/catalog/services/expansionsService.js`
- `getExpansionPacks()` → `GET /nodos/expansionpacks` (público). Normaliza cada item del backend (`name`, `platforms`, `URLImage`, `characteristics`, `publicationDate`, `price` numérico) a la forma que ya esperan `Card.jsx`/`ExpansionDetail.jsx` (`title`, `platform`, `image`, `features`, `releaseDate`, `price` como texto `"$X.XXX COP"`).

### `src/App.jsx`
- Llama `getExpansionPacks()` en un `useEffect` al montar, guarda el resultado en `packs` y lo renderiza como `<Card>` en la sección `#catalogo`. Maneja estados de `loading`/`error` simples.

## Feature: `beta`

### `src/features/beta/services/subscriptionService.js`
- `createSubscription(payload)` → `POST /nodos/subscriptions/create` (público). Body: `{name, email, subscriptionType, country, consentMarketing}`.

### `src/features/beta/components/subscriptionForm.jsx`
- Modal abierto desde el botón "¿Quieres ser Beta testing??" del navbar.
- `tipoSuscripcion` del `<select>` usa los valores exactos del enum del backend (`BETA_TESTING`, `SIMMER_CHALLENGE`) — no texto libre.
- Al enviar (con términos aceptados): llama `createSubscription()`; en éxito muestra un mensaje de agradecimiento en vez de cerrar de inmediato; en error muestra `err.message`.

## Pendiente / conocido

- El flujo de Google/Meta OAuth (`handleOAuthLogin`/`handleOAuthRegister` → `checkOAuthSession`) sigue el patrón estándar de Spring Security OAuth2, pero el redirect final tras completar el login en el proveedor no está documentado en `API_GUIDE.md` — falta confirmar en vivo que el backend efectivamente devuelve al usuario a `localhost:5173` con la sesión activa.
