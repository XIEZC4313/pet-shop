import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((item) => item.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((item) => item.product.id !== productId)
            : state.items.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
              ),
        }));
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      clearCart: () => set({ items: [], coupon: null }),

      setCoupon: (coupon) => set({ coupon }),

      getTotal: () => {
        const { items, coupon } = get();
        let total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

        if (coupon) {
          if (coupon.discountType === 'percent') {
            total *= 1 - coupon.discountValue / 100;
          } else {
            total = Math.max(0, total - coupon.discountValue);
          }
        }

        return total;
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    { name: 'pet-shop-cart' }
  )
);

export default useCartStore;
