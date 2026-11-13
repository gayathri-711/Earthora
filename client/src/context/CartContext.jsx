import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);
const STORAGE_KEY = 'earthora_cart';

function normalizeItem(rawItem) {
  if (!rawItem) return null;

  // Handle case where item might be flat product or nested { product, quantity }
  let product = rawItem.product || rawItem;
  if (!product || typeof product !== 'object') return null;

  const price = Number(product.price);
  if (isNaN(price)) return null;

  const quantity = Math.max(1, Number(rawItem.quantity) || 1);

  return {
    product: {
      _id: product._id || product.slug || `prod-${Date.now()}`,
      slug: product.slug || '',
      name: product.name || 'Organic Agricultural Item',
      price: price,
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      unit: product.unit || '1 unit',
      stock: Number(product.stock) || 99,
      image: product.image || '/assets/img/products/heirloom-tomatoes.jpg',
      supplierName: product.supplierName || 'Earthora Verified Partner',
      category: product.category || 'produce',
      categoryLabel: product.categoryLabel || 'Produce',
    },
    quantity,
  };
}

function readLocalCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('agriva_cart');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeItem).filter(Boolean);
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
    try {
      const validItems = items.map(normalizeItem).filter(Boolean);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validItems));
    } catch {
      // Ignore storage errors
    }
  }, [items]);

  const syncServerCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const { data } = await api.get('/cart');
      if (Array.isArray(data.data?.items) && data.data.items.length > 0) {
        const normalized = data.data.items.map(normalizeItem).filter(Boolean);
        if (normalized.length > 0) {
          setItems(normalized);
        }
      }
    } catch {
      // Fallback to local cart when offline
    }
  }, [isAuthenticated]);

  useEffect(() => {
    syncServerCart();
  }, [syncServerCart]);

  const addToCart = async (product, quantity = 1) => {
    if (!product || typeof product !== 'object') return;

    if (product.stock !== undefined && product.stock <= 0) {
      showToast(`${product.name || 'Item'} is currently out of stock.`, 'error');
      return;
    }

    const safeQty = Math.max(1, Number(quantity) || 1);
    const prodId = product._id || product.slug || product.name;

    setItems((prev) => {
      const safePrev = prev.map(normalizeItem).filter(Boolean);
      const existingIdx = safePrev.findIndex(
        (i) => (i.product._id === prodId || i.product.slug === prodId)
      );

      if (existingIdx >= 0) {
        const existing = safePrev[existingIdx];
        const nextQty = Math.min(existing.quantity + safeQty, existing.product.stock || 99);
        const updated = [...safePrev];
        updated[existingIdx] = { ...existing, quantity: nextQty };
        return updated;
      }

      const fresh = normalizeItem({ product, quantity: safeQty });
      return fresh ? [...safePrev, fresh] : safePrev;
    });

    showToast(`Added ${product.name || 'item'} to agricultural cart.`, 'success');

    if (isAuthenticated) {
      try {
        await api.post('/cart', {
          productId: product._id || product.slug,
          quantity: safeQty,
        });
      } catch {
        // Local cart remains completely functional
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const safeQty = Math.max(1, Number(quantity) || 1);
    setItems((prev) =>
      prev
        .map(normalizeItem)
        .filter(Boolean)
        .map((i) => {
          if (i.product._id !== productId && i.product.slug !== productId) return i;
          const maxStock = i.product.stock || 99;
          return { ...i, quantity: Math.min(safeQty, maxStock) };
        })
    );

    if (isAuthenticated) {
      try {
        await api.patch(`/cart/${productId}`, { quantity: safeQty });
      } catch {
        // Local cart remains functional
      }
    }
  };

  const removeFromCart = async (productId) => {
    setItems((prev) =>
      prev
        .map(normalizeItem)
        .filter(Boolean)
        .filter((i) => i.product._id !== productId && i.product.slug !== productId)
    );
    showToast('Item removed from cart.', 'info');

    if (isAuthenticated) {
      try {
        await api.delete(`/cart/${productId}`);
      } catch {
        // Local cart remains functional
      }
    }
  };

  const clearCart = async () => {
    setItems([]);
    setCoupon(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('agriva_cart');
    } catch {
      // Ignore
    }
    if (isAuthenticated) {
      try {
        await api.delete('/cart');
      } catch {
        // Ignore
      }
    }
  };

  const applyCoupon = (code) => {
    if (!code) return false;
    const normalized = code.trim().toUpperCase();
    if (normalized === 'ORGANIC10') {
      setCoupon({ code: 'ORGANIC10', percent: 10 });
      showToast('Promo ORGANIC10 applied: 10% discount on entire order!', 'success');
      return true;
    }
    if (normalized === 'FARMFRESH15') {
      setCoupon({ code: 'FARMFRESH15', percent: 15 });
      showToast('Promo FARMFRESH15 applied: 15% discount on entire order!', 'success');
      return true;
    }
    showToast('Invalid promo code. Try ORGANIC10 or FARMFRESH15.', 'error');
    return false;
  };

  const summary = useMemo(() => {
    const safeItems = items.map(normalizeItem).filter(Boolean);
    const subtotal = safeItems.reduce(
      (sum, item) => sum + (Number(item.product?.price) || 0) * (Number(item.quantity) || 1),
      0
    );
    const discount = coupon ? (subtotal * coupon.percent) / 100 : 0;
    const shipping = subtotal === 0 || subtotal >= 50 ? 0 : 4.95;
    const tax = Number((subtotal * 0.05).toFixed(2));
    const total = Math.max(0, subtotal - discount + shipping + tax);
    const count = safeItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

    return {
      subtotal: Number(subtotal.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      tax,
      total: Number(total.toFixed(2)),
      count,
    };
  }, [items, coupon]);

  return (
    <CartContext.Provider
      value={{
        items: items.map(normalizeItem).filter(Boolean),
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
