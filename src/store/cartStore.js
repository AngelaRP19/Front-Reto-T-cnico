import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { i18n } from "@lingui/core";

const AUTH_USER_KEY = "authUser";
export const GUEST_CART_SCOPE = "guest";

export function getCartScopeId(user) {
  return user && user.id !== undefined && user.id !== null
    ? String(user.id)
    : GUEST_CART_SCOPE;
}

function getBrowserLocalStorage() {
  return typeof window !== "undefined" ? window.localStorage : undefined;
}

function readStoredAuthUser() {
  const ls = getBrowserLocalStorage();
  if (!ls) return null;
  try {
    const raw = ls.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Cada usuario tiene su propio carrito: la clave real de
// localStorage se calcula en el momento de la llamada según
// quién esté logueado, para que el carrito no se filtre entre cuentas.
function scopedKey(baseName) {
  return `${baseName}-${getCartScopeId(readStoredAuthUser())}`;
}

const scopedStorage = {
  getItem: (name) => getBrowserLocalStorage()?.getItem(scopedKey(name)) ?? null,
  setItem: (name, value) => getBrowserLocalStorage()?.setItem(scopedKey(name), value),
  removeItem: (name) => getBrowserLocalStorage()?.removeItem(scopedKey(name)),
};

const storage = createJSONStorage(() => scopedStorage);

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existingItem = get().items.find(
          (existing) =>
            existing.id === item.id &&
            existing.platform === item.platform
        );

        // La misma expansión para la misma plataforma
        // no puede agregarse nuevamente.
        if (existingItem) {
          return {
            success: false,
            message: i18n._({
              id: "cart.duplicateItem",
              message: 'Ya tienes "{title}" para la plataforma {platform}.',
              values: { title: item.title, platform: item.platform },
            }),
          };
        }

        set((state) => ({
          items: [
            ...state.items,
            {
              ...item,
              quantity: 1,
            },
          ],
        }));

        return {
          success: true,
          message: i18n._({ id: "cart.addSuccess", message: "Producto agregado al carrito." }),
        };
      },

      removeItem: (id, platform) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.id === id && item.platform === platform)
          ),
        }));
      },

      updateQuantity: (id, platform, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id, platform);
          return;
        }

        // Una misma expansión + plataforma siempre
        // puede tener máximo una unidad.
        const newQuantity = Math.min(quantity, 1);

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.platform === platform
              ? {
                  ...item,
                  quantity: newQuantity,
                }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () =>
        get().items.reduce(
          (count, item) => count + item.quantity,
          0
        ),

      getSubtotal: () =>
        get().items.reduce(
          (sum, item) =>
            sum +
            Number(
              String(item.price).replace(/[^\d]/g, "")
            ) *
              item.quantity,
          0
        ),
    }),
    {
      name: "expansion-cart-storage",
      storage,
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);

// Al cambiar de cuenta hay que cargar el carrito guardado del usuario
// nuevo (o vaciarlo si todavía no tiene uno) en un solo paso: cada
// `setState` dispara un guardado automático a storage, así que resetear
// primero y rehidratar después pisaría el carrito guardado del usuario
// con un array vacío antes de poder leerlo.
export function switchCartScope() {
  const stored = storage.getItem("expansion-cart-storage");
  useCartStore.setState({ items: stored?.state?.items ?? [] });
}

export default useCartStore;