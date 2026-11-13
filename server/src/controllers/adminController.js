import Blog from '../models/Blog.js';
import Category from '../models/Category.js';
import ContactMessage from '../models/ContactMessage.js';
import Farmer from '../models/Farmer.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import { ApiError, asyncHandler, sendSuccess } from '../utils/http.js';

export const getAdminOverview = asyncHandler(async (_req, res) => {
  const [totalOrders, totalCustomers, totalFarmers, totalProducts, orders, lowStockProducts] =
    await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Farmer.countDocuments(),
      Product.countDocuments(),
      Order.find().sort({ createdAt: -1 }),
      Product.find({ stock: { $lte: 15 } }).select('name stock price').limit(8),
    ]);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const monthBuckets = new Map();
  orders.forEach((o) => {
    const label = new Date(o.createdAt).toLocaleString('en-US', { month: 'short' });
    monthBuckets.set(label, (monthBuckets.get(label) || 0) + (o.totalAmount || 0));
  });

  const salesChart = Array.from(monthBuckets.entries()).map(([label, revenue]) => ({
    label,
    revenue: Number(revenue.toFixed(2)),
  }));

  sendSuccess(res, {
    stats: {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalFarmers,
      totalProducts,
      lowStockCount: lowStockProducts.length,
    },
    lowStockProducts,
    recentOrders: orders.slice(0, 6),
    salesChart: salesChart.length ? salesChart : [{ label: 'Nov', revenue: totalRevenue }],
  });
});

export const getAllOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  sendSuccess(res, { orders });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!order) throw new ApiError(404, 'Order not found');
  sendSuccess(res, { order });
});

export const getAllUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  sendSuccess(res, { users });
});

export const getAllFarmers = asyncHandler(async (_req, res) => {
  const farmers = await Farmer.find().sort({ createdAt: -1 });
  sendSuccess(res, { farmers });
});

export const updateFarmerVerification = asyncHandler(async (req, res) => {
  const farmer = await Farmer.findByIdAndUpdate(
    req.params.id,
    { verified: Boolean(req.body.verified) },
    { new: true }
  );
  if (!farmer) throw new ApiError(404, 'Farmer not found');
  sendSuccess(res, { farmer });
});

export const deleteProductAdmin = asyncHandler(async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) throw new ApiError(404, 'Product not found');
  sendSuccess(res, {}, 'Product deleted');
});

export const createCategoryAdmin = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const category = await Category.create({ name, slug, description });
  sendSuccess(res, { category }, 'Category created', 201);
});

export const createBlogAdmin = asyncHandler(async (req, res) => {
  const { title, category, excerpt, content, image } = req.body;
  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60)}-${Date.now()
    .toString()
    .slice(-4)}`;
  const blog = await Blog.create({
    title,
    slug,
    category,
    excerpt,
    content,
    author: req.user.name,
    image: image || '/assets/img/home-4/news-1.jpg',
  });
  sendSuccess(res, { blog }, 'Blog published', 201);
});

export const getAllReviewsAdmin = asyncHandler(async (_req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  sendSuccess(res, { reviews });
});

export const deleteReviewAdmin = asyncHandler(async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  sendSuccess(res, {}, 'Review removed');
});

export const getAllMessagesAdmin = asyncHandler(async (_req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  sendSuccess(res, { messages });
});

