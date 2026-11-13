import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import { asyncHandler, sendSuccess } from '../utils/http.js';

export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  sendSuccess(res, { items: cart?.items || [] });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [{ product: productId, quantity }] });
  } else {
    const idx = cart.items.findIndex((i) => i.product.toString() === productId);
    if (idx >= 0) cart.items[idx].quantity += Number(quantity);
    else cart.items.push({ product: productId, quantity: Number(quantity) });
    await cart.save();
  }

  await cart.populate('items.product');
  sendSuccess(res, { items: cart.items }, 'Cart updated');
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    const item = cart.items.find((i) => i.product.toString() === productId);
    if (item) {
      item.quantity = Math.max(1, Number(quantity));
      await cart.save();
    }
    await cart.populate('items.product');
  }
  sendSuccess(res, { items: cart?.items || [] });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    await cart.save();
    await cart.populate('items.product');
  }
  sendSuccess(res, { items: cart?.items || [] });
});

export const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  sendSuccess(res, { items: [] }, 'Cart cleared');
});

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
  sendSuccess(res, { products: wishlist?.products || [] });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
  } else {
    const exists = wishlist.products.some((p) => p.toString() === productId);
    wishlist.products = exists
      ? wishlist.products.filter((p) => p.toString() !== productId)
      : [...wishlist.products, productId];
    await wishlist.save();
  }

  await wishlist.populate('products');
  sendSuccess(res, { products: wishlist.products }, 'Wishlist updated');
});

