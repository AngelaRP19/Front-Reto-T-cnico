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
        const existingItem = get().items.find((existing) => existing.id === item.id);

        if (existingItem) {
          set((state) => ({
            items: state.items.map((existing) =>
              existing.id === item.id ? { ...existing, quantity: existing.quantity + 1 } : existing
            ),
          }));
          return;
        }

        set((state) => ({
          items: [...state.items, { ...item, quantity: 1 }],
        }));
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        }));
      },
      clearCart: () => set({ items: [] }),
      getItemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
      getSubtotal: () =>
        get().items.reduce((sum, item) => sum + Number(item.price.replace(/[^\d]/g, "")) * item.quantity, 0),
    }),
    {
      name: "expansion-cart-storage",
      storage,
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore;
