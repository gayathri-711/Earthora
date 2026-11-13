import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Inventory from '../models/Inventory.js';
import Order, { OrderItem } from '../models/Order.js';
import Payment from '../models/Payment.js';
import Product from '../models/Product.js';
import { ApiError, asyncHandler, sendSuccess } from '../utils/http.js';

const COUPONS = {
  ORGANIC10: 0.1,
  FARMFRESH15: 0.15,
};

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod = 'card', couponCode } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'Order must contain at least one product');
  }
  if (!shippingAddress?.fullName || !shippingAddress?.street || !shippingAddress?.city) {
    throw new ApiError(400, 'Complete shipping address is required');
  }

  const orderItems = [];
  let subtotal = 0;

  for (const entry of items) {
    const product = mongoose.isValidObjectId(entry.productId)
      ? await Product.findById(entry.productId)
      : await Product.findOne({
          $or: [{ slug: entry.slug }, { name: entry.name }],
        });
    if (!product) {
      throw new ApiError(404, `Product not found: ${entry.name || entry.productId}`);
    }
    const qty = Math.max(1, Number(entry.quantity || 1));
    if (product.stock < qty) {
      throw new ApiError(400, `Insufficient stock for ${product.name} (${product.stock} available)`);
    }

    const previousStock = product.stock;
    product.stock -= qty;
    await product.save();

    await Inventory.create({
      product: product._id,
      farmer: product.farmer,
      changeAmount: -qty,
      previousStock,
      newStock: product.stock,
      reason: 'order',
    });

    subtotal += product.price * qty;
    orderItems.push({
      product: product._id,
      farmer: product.farmer,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: qty,
    });
  }

  const rate = couponCode ? COUPONS[couponCode.toUpperCase()] || 0 : 0;
  const discount = Number((subtotal * rate).toFixed(2));
  const shippingFee = subtotal >= 50 ? 0 : 4.95;
  const totalAmount = Number(Math.max(0, subtotal - discount + shippingFee).toFixed(2));

  const orderNumber = `ETH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const paymentStatus = paymentMethod === 'card' ? 'paid' : 'pending';

  const order = await Order.create({
    orderNumber,
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    paymentStatus,
    status: 'pending',
    couponCode: rate > 0 ? couponCode.toUpperCase() : null,
    subtotal,
    discount,
    shippingFee,
    totalAmount,
  });

  await OrderItem.insertMany(
    orderItems.map((i) => ({
      order: order._id,
      ...i,
    }))
  );

  await Payment.create({
    order: order._id,
    user: req.user._id,
    amount: totalAmount,
    method: paymentMethod,
    status: paymentStatus,
    transactionId: `TXN-${Date.now()}`,
  });

  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

  sendSuccess(res, { order }, 'Order confirmed', 201);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  sendSuccess(res, { orders });
});

export const trackOrder = asyncHandler(async (req, res) => {
  const { orderNumber } = req.params;
  const order = await Order.findOne({ orderNumber: orderNumber.toUpperCase() }).select(
    'orderNumber status paymentStatus paymentMethod totalAmount createdAt items shippingAddress.city'
  );
  if (!order) {
    throw new ApiError(404, `No order found with number ${orderNumber}`);
  }
  sendSuccess(res, { order });
});
