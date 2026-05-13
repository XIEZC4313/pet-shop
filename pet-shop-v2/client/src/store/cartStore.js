import { create } from 'zustand';
import api from '../api';

const useCartStore = create((set, get) => ({
  items: [],
  total: 0,
  open: false,

  setOpen: (open) => set({ open }),
  toggle: () => set(s => ({ open: !s.open })),

  fetch: async () => {
    try {
      const res = await api.get('/cart');
      set({ items: res.data.items, total: res.data.total });
    } catch { /* not logged in */ }
  },

  add: async (productId, quantity = 1) => {
    await api.post('/cart', { productId, quantity });
    await get().fetch();
    set({ open: true });
  },

  updateQuantity: async (itemId, quantity) => {
    await api.put(`/cart/${itemId}`, { quantity });
    await get().fetch();
  },

  remove: async (itemId) => {
    await api.delete(`/cart/${itemId}`);
    await get().fetch();
  },

  count: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));

export default useCartStore;
