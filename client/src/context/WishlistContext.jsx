import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'earthora_wishlist';

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('agriva_wishlist');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!isAuthenticated) return;
    api
      .get('/wishlist')
      .then(({ data }) => {
        if (Array.isArray(data.data?.products)) {
          setItems(data.data.products);
        }
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const isWishlisted = (productId) => items.some((p) => p._id === productId);

  const toggleWishlist = async (product) => {
    const exists = isWishlisted(product._id);
    setItems((prev) =>
      exists ? prev.filter((p) => p._id !== product._id) : [...prev, product]
    );
    showToast(
      exists ? `Removed ${product.name} from wishlist.` : `Saved ${product.name} to wishlist.`,
      exists ? 'info' : 'success'
    );

    if (isAuthenticated) {
      try {
        await api.post('/wishlist/toggle', { productId: product._id });
      } catch {
        // Local wishlist persists cleanly
      }
    }
  };

  return (
    <WishlistContext.Provider value={{ items, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}

