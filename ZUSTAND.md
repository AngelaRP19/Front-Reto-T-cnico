# Zustand en este proyecto

## Qué es y por qué se usa acá

[Zustand](https://github.com/pmndrs/zustand) es una librería chica para manejar estado global en React, sin el "boilerplate" de Redux ni los problemas de re-render de un Context grande. Se usa acá para el **carrito de compras**: es un dato que varios componentes que no son padre-hijo entre sí necesitan leer y modificar (la navbar, la página de detalle de cada expansión), así que ponerlo en Context o pasarlo por props sería incómodo. Con Zustand, cualquier componente se conecta al store directamente con un hook, sin envolver la app en un Provider.

## Dónde vive

Todos los stores están en **`src/store/`**, un archivo por store:

```
src/store/
  cartStore.js        ← el store del carrito (el único que existe hoy)
  cartStore.test.js    ← sus tests (vitest)
```

Cada archivo exporta por default un hook `useXStore` (convención: `useCartStore`, y si se agrega otro sería `useAlgoStore`).

## El store que existe: `cartStore.js`

```js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
```

- **`create`** es la función base de Zustand: le pasás una función `(set, get) => ({ ...estado y acciones... })` y te devuelve el hook `useCartStore`.
  - `set(nuevoEstadoParcial)` actualiza el store (se combina con lo que ya había, como `setState` de una clase).
  - `get()` lee el estado actual desde *dentro* de una acción, sin tener que pasarlo como parámetro.
- **`persist`** es un middleware que envuelve el store para que se guarde solo en `localStorage` y se recupere solo al recargar la página — así el carrito no se vacía si el usuario refresca o cierra el navegador.
  - `createJSONStorage(() => localStorage)` le dice a `persist` qué API de storage usar (podría ser `sessionStorage` u otra). El archivo tiene un fallback a un storage "falso" (que no hace nada) para el caso de SSR, donde `window`/`localStorage` no existen — no aplica hoy porque la app es solo cliente (Vite SPA), pero queda como protección.
  - `name: "expansion-cart-storage"` es la clave bajo la que se guarda en `localStorage`.
  - `partialize` elige **qué parte** del estado se persiste — acá solo `items` (no tendría sentido persistir cosas como un flag de "cargando").

### Estado y acciones actuales

```js
{
  items: [],  // [{ id, title, price, platform, image, quantity }]

  addItem(item)               // agrega un pack+plataforma; si ya existe ese mismo par, no lo duplica (devuelve {success:false, message})
  removeItem(id, platform)    // saca un pack+plataforma puntual del carrito
  updateQuantity(id, platform, quantity)  // hoy la cantidad está topada a 1 (no se puede comprar el mismo pack+plataforma dos veces)
  clearCart()                 // vacía todo

  getItemCount()   // selector derivado: total de unidades
  getSubtotal()    // selector derivado: suma de precios × cantidad
}
```

La identidad de un ítem en el carrito es **`id` + `platform` juntos** (podés tener el mismo pack de expansión para "Steam" y para "PC" como dos líneas separadas, pero no dos veces para la misma plataforma).

### Cómo se consume

**Patrón de selector** — siempre pedile al store *un pedazo* del estado, no el store entero:

```js
// navbar.jsx
const itemCount = useCartStore((state) => state.getItemCount());
const cartItems = useCartStore((state) => state.items);
const removeItem = useCartStore((state) => state.removeItem);
const updateQuantity = useCartStore((state) => state.updateQuantity);
const clearCart = useCartStore((state) => state.clearCart);
```

```js
// ExpansionDetail.jsx
const addItem = useCartStore((state) => state.addItem);
// ...
const result = addItem({ id: expansion.id, title: expansion.title, price: expansion.price, platform: platform.name, image: expansion.image });
if (!result?.success) {
  setCartMessage(result?.message || "No se pudo agregar el producto al carrito.");
}
```

**Por qué selector y no `useCartStore()` a secas**: si tomás el store completo, tu componente se re-renderiza cada vez que *cualquier* campo cambia. Si solo pedís `state.items`, tu componente solo se re-renderiza cuando `items` cambia — el resto de las actualizaciones del store no te afectan. Es la misma idea que `useSelector` en Redux.

**Fuera de un componente** (por ejemplo, un cálculo puntual que no necesita suscribirse a cambios) se puede leer el estado directo con `.getState()`, sin el hook:

```js
useCartStore.getState().getSubtotal()
```

Esto es lo que hace `navbar.jsx` al mostrar el subtotal dentro del dropdown del carrito.

## `cartAccess.js` — no es un store

`src/utils/cartAccess.js` es solo una función auxiliar, **no tiene nada que ver con Zustand**:

```js
export function canAccessCart(user) {
  return Boolean(user);
}
```

Se usa para decidir si mostrar el botón/ícono del carrito en la navbar y el botón "Añadir al carrito" en el detalle de una expansión (hoy: solo si hay un usuario logueado). Vale la pena tenerlo claro porque el nombre puede confundirse con algo del store — es una regla de negocio simple, no estado.

## Cómo agregar un store nuevo

1. Crear el archivo en `src/store/miCosaStore.js`.
2. Definir el estado inicial y las acciones con `create()`:
   ```js
   import { create } from "zustand";

   const useMiCosaStore = create((set, get) => ({
     valor: null,
     setValor: (v) => set({ valor: v }),
   }));

   export default useMiCosaStore;
   ```
3. Decidir si necesita `persist`:
   - **Sí** (como el carrito) si el dato debe sobrevivir a un refresh de la página.
   - **No** si es un dato de sesión/temporal (por ejemplo, el resultado de una consulta al backend que puede cambiar en cualquier momento — no tendría sentido guardarlo en `localStorage`).
   - Si usás `persist`, copiá el patrón de `cartStore.js` (`createJSONStorage`, `name` único, `partialize` si solo querés persistir una parte).
4. Consumirlo siempre con el patrón de selector: `useMiCosaStore((state) => state.valor)`, nunca `useMiCosaStore()` completo.
5. Si el store necesita tests, seguí el patrón de `cartStore.test.js`: `useMiCosaStore.setState({...})` para resetear/preparar estado antes de cada test, y `useMiCosaStore.getState()` para leer/llamar acciones sin montar ningún componente.

## Nota

De paso noté que `cartStore.test.js` está desactualizado: el segundo test espera que agregar el mismo `id` dos veces sume la cantidad a 2, pero la implementación actual de `addItem` ya no funciona así — ahora bloquea el duplicado (mismo `id` + `platform`) y devuelve `{success:false}` en vez de incrementar. Ese test hoy fallaría si se corriera. No lo toqué porque no era parte de lo que pediste, pero te lo señalo por si querés que lo actualice en otro momento.
