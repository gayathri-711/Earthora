import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);
const STORAGE_KEY = 'earthora_cart';

function readLocalCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('agriva_cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [items, setItems] = useState(readLocalCart);
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const syncServerCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const { data } = await api.get('/cart');
      if (Array.isArray(data.data?.items) && data.data.items.length > 0) {
        setItems(
          data.data.items.map((item) => ({
            product: item.product,
            quantity: item.quantity,
          }))
        );
      }
    } catch {
      // Fallback to local cart when offline or unseeded
    }
  }, [isAuthenticated]);

  useEffect(() => {
    syncServerCart();
  }, [syncServerCart]);

  const addToCart = async (product, quantity = 1) => {
    if (product.stock !== undefined && product.stock <= 0) {
      showToast(`${product.name} is currently out of stock.`, 'error');
      return;
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.product._id === product._id);
      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, product.stock || 99);
        return prev.map((i) => (i.product._id === product._id ? { ...i, quantity: nextQty } : i));
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock || 99) }];
    });

    showToast(`Added ${product.name} to cart.`);

    if (isAuthenticated) {
      try {
        await api.post('/cart', { productId: product._id, quantity });
      } catch {
        // Local cart remains functional
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const safeQty = Math.max(1, quantity);
    setItems((prev) =>
      prev.map((i) => {
        if (i.product._id !== productId) return i;
        const maxStock = i.product.stock || 99;
        return { ...i, quantity: Math.min(safeQty, maxStock) };
      })
    );

    if (isAuthenticated) {
      try {
        await api.patch(`/cart/${productId}`, { quantity: safeQty });
      } catch {
        // Ignore offline fallback
      }
    }
  };

  const removeFromCart = async (productId) => {
    setItems((prev) => prev.filter((i) => i.product._id !== productId));
    showToast('Removed item from cart.', 'info');
    if (isAuthenticated) {
      try {
        await api.delete(`/cart/${productId}`);
      } catch {
        // Ignore offline fallback
      }
    }
  };

  const clearCart = async () => {
    setItems([]);
    setCoupon(null);
    localStorage.removeItem(STORAGE_KEY);
    if (isAuthenticated) {
      try {
        await api.delete('/cart');
      } catch {
        // Ignore offline fallback
      }
    }
  };

  const applyCoupon = (code) => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'ORGANIC10') {
      setCoupon({ code: 'ORGANIC10', percent: 10 });
      showToast('Coupon ORGANIC10 applied (10% off).');
      return true;
    }
    if (normalized === 'FARMFRESH15') {
      setCoupon({ code: 'FARMFRESH15', percent: 15 });
      showToast('Coupon FARMFRESH15 applied (15% off).');
      return true;
    }
    showToast('Invalid coupon code. Try ORGANIC10 or FARMFRESH15.', 'error');
    return false;
  };

  const summary = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const discount = coupon ? (subtotal * coupon.percent) / 100 : 0;
    const shipping = subtotal === 0 || subtotal >= 50 ? 0 : 4.95;
    const total = Math.max(0, subtotal - discount + shipping);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, discount, shipping, total, count };
  }, [items, coupon]);

  return (
    <CartContext.Provider
      value={{
        items,
        coupon,
        summary,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

