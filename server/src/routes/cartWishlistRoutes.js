import { Router } from 'express';
import {
  addToCart,
  clearCart,
  getCart,
  getWishlist,
  removeCartItem,
  toggleWishlist,
  updateCartItem,
} from '../controllers/cartWishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/cart', protect, getCart);
router.post('/cart', protect, addToCart);
router.patch('/cart/:productId', protect, updateCartItem);
router.delete('/cart/:productId', protect, removeCartItem);
router.delete('/cart', protect, clearCart);

router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/toggle', protect, toggleWishlist);

export default router;
