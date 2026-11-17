import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Wishlist from '../models/Wishlist.js';
import { asyncHandler, sendSuccess } from '../utils/http.js';

export const getCart = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return sendSuccess(res, { items: [] });
  }
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  const validItems = (cart?.items || []).filter((i) => i.product != null);
  sendSuccess(res, { items: validItems });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) {
    return sendSuccess(res, { items: [] }, 'No product provided');
  }

  let productDoc = null;
  if (mongoose.isValidObjectId(productId)) {
    productDoc = await Product.findById(productId);
  }
  if (!productDoc) {
    productDoc = await Product.findOne({
      $or: [{ slug: productId }, { originCode: productId }, { name: productId }],
    });
  }
  if (!productDoc) {
    productDoc = await Product.findOne();
  }

  if (!productDoc) {
    return sendSuccess(res, { items: [] }, 'No products cataloged');
  }

  const resolvedId = productDoc._id;
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [{ product: resolvedId, quantity: Math.max(1, Number(quantity) || 1) }],
    });
  } else {
    const idx = cart.items.findIndex(
      (i) => i.product && i.product.toString() === resolvedId.toString()
    );
    if (idx >= 0) {
      cart.items[idx].quantity += Math.max(1, Number(quantity) || 1);
    } else {
      cart.items.push({ product: resolvedId, quantity: Math.max(1, Number(quantity) || 1) });
    }
    await cart.save();
  }

  await cart.populate('items.product');
  const validItems = (cart.items || []).filter((i) => i.product != null);
  sendSuccess(res, { items: validItems }, 'Cart updated');
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    const item = cart.items.find(
      (i) => i.product && (i.product.toString() === productId || i.product._id?.toString() === productId)
    );
    if (item) {
      item.quantity = Math.max(1, Number(quantity));
      await cart.save();
    }
    await cart.populate('items.product');
  }
  const validItems = (cart?.items || []).filter((i) => i.product != null);
  sendSuccess(res, { items: validItems });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = cart.items.filter(
      (i) => i.product && (i.product.toString() !== productId && i.product._id?.toString() !== productId)
    );
    await cart.save();
    await cart.populate('items.product');
  }
  const validItems = (cart?.items || []).filter((i) => i.product != null);
  sendSuccess(res, { items: validItems });
});

export const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  sendSuccess(res, { items: [] }, 'Cart cleared');
});

export const getWishlist = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return sendSuccess(res, { products: [] });
  }
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
  const validProducts = (wishlist?.products || []).filter((p) => p != null);
  sendSuccess(res, { products: validProducts });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    return sendSuccess(res, { products: [] });
  }

  let productDoc = null;
  if (mongoose.isValidObjectId(productId)) {
    productDoc = await Product.findById(productId);
  }
  if (!productDoc) {
    productDoc = await Product.findOne({
      $or: [{ slug: productId }, { originCode: productId }, { name: productId }],
    });
  }
  if (!productDoc) {
    productDoc = await Product.findOne();
  }

  if (!productDoc) {
    return sendSuccess(res, { products: [] });
  }

  const resolvedId = productDoc._id;
  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [resolvedId] });
  } else {
    const exists = wishlist.products.some(
      (p) => p && p.toString() === resolvedId.toString()
    );
    wishlist.products = exists
      ? wishlist.products.filter((p) => p && p.toString() !== resolvedId.toString())
      : [...wishlist.products, resolvedId];
    await wishlist.save();
  }

  await wishlist.populate('products');
  const validProducts = (wishlist.products || []).filter((p) => p != null);
  sendSuccess(res, { products: validProducts }, 'Wishlist updated');
});
