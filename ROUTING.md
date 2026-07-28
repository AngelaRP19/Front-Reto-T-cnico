# Enrutamiento (react-router-dom)

Hasta ahora toda la app vivía en una sola URL (`http://localhost:5173`): `App.jsx` manejaba un `useState` con el nombre de la "vista" activa (`home`, `login`, `register`, etc.) y renderizaba un componente u otro a mano, pasando funciones como `onHomeClick`/`onBack` por props. Eso significaba: no había forma de compartir un link directo a un pack de expansión, refrescar la página siempre te devolvía a home, y no existía un 404.

Se migró a [`react-router-dom`](https://reactrouter.com/) (v7.x, declarativo — `<BrowserRouter>`/`<Routes>`/`<Route>`, sin `createBrowserRouter`/loaders, porque nada acá necesita esa complejidad) para que cada pantalla tenga su propia URL real.

## Tabla de rutas

| Ruta | Página | Layout (Navbar + Footer) |
|---|---|---|
| `/` | `HomePage` (Hero + grilla de catálogo) | Sí |
| `/catalogo/:packId` | `ExpansionDetailPage` | Sí |
| `/comunidad` | `ChallengesPage` | Sí |
| `/login` | `LoginPage` | No |
| `/register` | `RegisterPage` | No |
| `*` (cualquier otra) | `NotFoundPage` | No |

`/login` y `/register` quedan fuera del layout compartido a propósito — son pantallas completas, igual que antes de la migración.

## Estructura

- **`src/App.jsx`**: ahora es *solo* el árbol de rutas (`<Routes>`), sin ningún estado de navegación.
- **`src/main.jsx`**: envuelve todo con `<BrowserRouter>` (por fuera de `ThemeProvider`/`AuthProvider`).
- **`src/components/layout/MainLayout.jsx`** (nuevo): `<Navbar/>` + [`<Outlet/>`](https://reactrouter.com/en/main/components/outlet) + `<Footer/>`. Es el elemento de la ruta padre que agrupa `/`, `/catalogo/:packId` y `/comunidad` — reemplaza el bloque `<Navbar/>...<Footer/>` que se repetía tres veces en el `App.jsx` viejo.
- **`src/pages/NotFoundPage.jsx`** (nuevo): primer archivo de un directorio `src/pages/` — para páginas que no pertenecen a ningún dominio de `src/features/<dominio>/pages/` (un 404 no es del dominio "catalog" ni "auth" ni "challenges").
- **`src/features/catalog/pages/HomePage.jsx`** / **`ExpansionDetailPage.jsx`** (nuevos): la Home y el detalle de un pack, extraídos de lo que antes vivía inline en `App.jsx`.
- **`src/features/catalog/hooks/useExpansionPacks.js`** (nuevo): ver la sección de abajo.

## Navegación: `<Link>` y `useNavigate()`

`Navbar.jsx` ya no recibe props de navegación (`onLoginClick`, `onHomeClick`, etc.) — antes eran 5 callbacks que App.jsx le pasaba en cada una de sus 5 vistas. Ahora navega por sí solo:

- Links reales (`Inicio`, `Comunidad`, cada card del catálogo) → `<Link to="...">`.
- Navegación disparada por lógica (ej. el botón "Iniciar sesión", o redirigir a `/register` cuando alguien sin cuenta toca "¿Quieres ser beta tester?") → `useNavigate()`.

Mismo patrón en `loginPage.jsx`, `registerPage.jsx` y `CardChallenge.jsx`: ya no reciben `onBack`/`onRequireLogin`/etc. por props, usan los hooks de router directamente.

## Detalle de un pack (`/catalogo/:packId`) — deep-linking real

El backend solo expone `GET /nodos/expansionpacks` (la lista completa) — no existe un endpoint por `id`. Para que `/catalogo/:packId` funcione también al **refrescar la página o entrar por un link directo** (no solo haciendo click desde el catálogo), `ExpansionDetailPage` no depende de que el usuario haya pasado por Home antes:

- `useExpansionPacks()` (hook nuevo) pide la lista una sola vez y la cachea a nivel de módulo (una promesa compartida). Si ya se cargó (ej. viniendo de un click en Home), no vuelve a pedirla. Si es la primera carga de la sesión (ej. refresh en `/catalogo/5`), la pide normal.
- `ExpansionDetailPage` busca el pack por `id` dentro de esa lista. Si no lo encuentra (id inválido, o el pack fue borrado), muestra `NotFoundPage` en vez de datos falsos — antes `ExpansionDetail.jsx` tenía un objeto hardcodeado de relleno para cuando no había `data`; se eliminó, `data` ahora es obligatorio.

**Trade-off aceptado**: entrar directo a `/catalogo/:id` sin pasar por Home hace un fetch de la lista completa solo para mostrar un pack. Es aceptable porque el catálogo es público y chico; si creciera mucho, la solución de fondo sería agregar `GET /nodos/expansionpacks/{id}` en el backend.

## Volver a donde estabas después de loguearte

Cuando `CardChallenge` redirige a un usuario sin sesión a `/login` (al tocar "Acepto el reto"), le manda de dónde vino:

```js
navigate("/login", { state: { from: location.pathname } });
```

y `LoginPage`, al loguearse con éxito, vuelve ahí en vez de ir siempre a home:

```js
navigate(location.state?.from ?? "/", { replace: true });
```

`from` siempre lo pone el propio código (nunca un query param de la URL), así que no hay riesgo de que alguien arme un link para redirigir a un sitio externo.

## Login/registro con Google o Meta (OAuth) — no cambia

Los botones de Google/Meta siguen haciendo una navegación de página completa (no es parte del router de React):

```js
window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
```

Spring Security, al terminar el login con el proveedor, redirige de vuelta a la URL configurada en el backend (`frontend.url`, hoy `http://localhost:5173/`) — es decir, a la raíz `/`, que sigue siendo la Home. `AuthContext` detecta esa sesión al montar (`checkOAuthSession()`) sin importar en qué ruta esté React Router en ese momento, así que **no hace falta ningún cambio en el backend** para que esto siga funcionando.

## 404

Cualquier ruta que no matchee ninguna de la tabla de arriba cae en `NotFoundPage` (ruta `*`, siempre al final de la lista de `<Route>`).

## SPA fallback (dev vs. producción)

En desarrollo (`npm run dev`) y en `npm run preview`, Vite sirve `index.html` para cualquier ruta que no sea un archivo real (comportamiento por defecto, `appType: 'spa'`) — por eso refrescar en `/catalogo/5` funciona sin configuración extra. **Si el día de mañana se despliega en un hosting estático** (Vercel, Netlify, nginx, etc.), ese hosting necesita su propia regla de rewrite ("todas las rutas devuelven `index.html`"), porque ninguno de esos hostings sabe de las rutas de React por su cuenta. Hoy no hay ningún archivo de config de deploy en el repo (`vercel.json`, `_redirects`, etc.) — queda pendiente para cuando se elija dónde desplegar.
