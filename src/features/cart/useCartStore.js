import { create } from 'zustand';

export const useCartStore = create((set) => ({
  cart: null,
  loading: false,
  error: null,

  // Endpoint #20: Obtener el carrito
  fetchCart: async (token) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('http://localhost:8081/nodos/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Error al obtener el carrito');
      const data = await response.json();
      set({ cart: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Endpoint #24: Comprar desde el carrito
  purchaseCart: async (token, paymentMethod = 'CARD') => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('http://localhost:8081/nodos/buys/purchase', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'text/plain'
        },
        body: paymentMethod
      });

      if (!response.ok) throw new Error('Error al procesar la compra');
      const order = await response.json();
      
      set({ cart: null, loading: false });
      return order;
    } catch (err) {
      set({ error: err.message, loading: false });
      return null;
    }
  }
}));