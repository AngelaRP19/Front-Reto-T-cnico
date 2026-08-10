import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const storage =
  typeof window !== "undefined"
    ? createJSONStorage(() => localStorage)
    : createJSONStorage(() => ({
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      }));

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
            message: `Ya tienes "${item.title}" para la plataforma ${item.platform}.`,
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
          message: "Producto agregado al carrito.",
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

export default useCartStore;