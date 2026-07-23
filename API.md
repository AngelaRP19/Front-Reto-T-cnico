# Conexión con el API (backend Java)

Este proyecto ya trae armada la capa para hablar con el backend Java. Hay dos piezas:

- **`src/services/apiClient.js`** — cliente HTTP compartido, uno solo para todo el proyecto.
- **`src/features/<feature>/services/*.js`** — un archivo de servicio por feature (hoy solo existe `src/features/auth/services/authService.js`), que usa `apiClient` para exponer funciones concretas (`login`, `register`, etc.) a los componentes.

La idea: los componentes nunca llaman `fetch` directamente ni arman headers/URLs a mano. Llaman una función de un `*Service.js`, y esa función usa `apiClient` por debajo.

## `apiClient.js`

```js
import { apiClient, getToken, setToken, clearToken } from "../../services/apiClient";
```

Qué hace por vos:

- **URL base**: lee `VITE_API_URL` del entorno (ver [Variables de entorno](#variables-de-entorno) abajo). Si no está definida, usa `http://localhost:8081` como fallback.
- **Headers**: agrega `Content-Type: application/json` siempre, y `Authorization: Bearer <token>` automáticamente si hay un token guardado — salvo que se pase `{ auth: false }` (usado en login/register, donde todavía no hay token).
- **Body**: si le pasás un objeto en `post`/`put`, lo serializa a JSON solo.
- **Errores normalizados**: si el backend responde con un error (status no-2xx), lanza un `Error` cuyo `.message` es el `message` que venga en el body de la respuesta (si el backend lo manda así), o un mensaje genérico si no. Si falla la conexión (backend caído, sin red), lanza un `Error` con un mensaje de "no se pudo conectar". En los dos casos, alcanza con un `try { ... } catch (err) { setServerError(err.message) }` en el componente.
- **Sesión**: `getToken()` / `setToken(token)` / `clearToken()` manejan el token en `localStorage` bajo la clave `authToken`.

Métodos disponibles: `apiClient.get(path, options)`, `apiClient.post(path, body, options)`, `apiClient.put(path, body, options)`, `apiClient.del(path, options)`.

## Ejemplo real: `authService.js`

```js
// src/features/auth/services/authService.js
import { apiClient, setToken, clearToken } from "../../../services/apiClient";

export async function register(payload) {
  const data = await apiClient.post("/auth/register", payload, { auth: false });
  if (data?.token) setToken(data.token);
  return data;
}

export async function login(email, password) {
  const data = await apiClient.post("/auth/login", { email, password }, { auth: false });
  if (data?.token) setToken(data.token);
  return data;
}

export function logout() {
  clearToken();
}
```

Y así se usa desde la página (ver `src/features/auth/pages/loginPage.jsx` / `registerPage.jsx` completos):

```js
try {
  const data = await login(email, password);
  onLoginSuccess?.(data);
} catch (err) {
  setServerError(err.message);
}
```

## Cómo conectar una funcionalidad nueva al API

Ejemplo: conectar el formulario de beta testing (`src/features/beta/components/subscriptionForm.jsx`) a un endpoint real.

1. Crear `src/features/beta/services/betaService.js`.
2. Importar `apiClient` desde `../../../services/apiClient` (la profundidad depende de dónde quede el archivo — contá las carpetas hasta `src/`).
3. Exportar una función por acción, por ejemplo:
   ```js
   import { apiClient } from "../../../services/apiClient";

   export function subscribe(payload) {
     return apiClient.post("/beta/subscriptions", payload);
   }
   ```
4. En el componente, importar esa función y llamarla dentro de un `try/catch` en el `handleSubmit`, igual que en `loginPage.jsx`/`registerPage.jsx`.

No hace falta tocar `apiClient.js` para esto — solo se toca si cambia algo del comportamiento *global* (por ejemplo, agregar un header nuevo para todas las requests, o cambiar cómo se maneja el token expirado).

## Manejo de sesión

El token se guarda en `localStorage` (clave `authToken`) apenas `login`/`register` devuelven uno. `apiClient` lo agrega solo en cada request subsiguiente que no tenga `{ auth: false }`. Para cerrar sesión, llamar `logout()` desde `authService.js` (limpia el token guardado).

## Variables de entorno

- `.env.example` documenta las variables esperadas — copiarlo a `.env` (no se sube a git) y ajustar los valores reales.
- `VITE_API_URL`: URL base del backend Java (ej. `http://localhost:8081`). Vite solo expone al cliente las variables que empiezan con `VITE_`.
