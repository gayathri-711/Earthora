import mongoose from 'mongoose';
import Article from '../models/Article.js';
import ContactMessage from '../models/ContactMessage.js';
import Crop from '../models/Crop.js';
import Expert from '../models/Expert.js';
import Farmer from '../models/Farmer.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import SoilTest from '../models/SoilTest.js';
import User from '../models/User.js';
import { DEMO_USERS } from '../config/demoUsers.js';
import { ApiError, asyncHandler, sendSuccess } from '../utils/http.js';

export const getAdminOverview = asyncHandler(async (_req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return sendSuccess(res, {
      stats: {
        totalRevenue: 48920.5,
        totalOrders: 142,
        totalCustomers: 89,
        totalFarmers: 18,
        totalExperts: 6,
        totalProducts: 24,
        totalCrops: 32,
      },
      salesChart: [
        { label: 'Jan', revenue: 3200 },
        { label: 'Feb', revenue: 4100 },
        { label: 'Mar', revenue: 5800 },
        { label: 'Apr', revenue: 7200 },
        { label: 'May', revenue: 8900 },
        { label: 'Jun', revenue: 11200 },
        { label: 'Jul', revenue: 8520.5 },
      ],
      recentOrders: [
        { _id: '6735e0000000000000000101', orderNumber: 'ETH-2026-1001', customerName: 'Claire Bennett', totalAmount: 1840, status: 'In Transit', createdAt: new Date() },
        { _id: '6735e0000000000000000102', orderNumber: 'ETH-2026-1002', customerName: 'Michael Chang', totalAmount: 920, status: 'Harvested', createdAt: new Date() },
        { _id: '6735e0000000000000000103', orderNumber: 'ETH-2026-1003', customerName: 'Sara Lin', totalAmount: 3150, status: 'Confirmed', createdAt: new Date() }
      ],
      lowStockProducts: [
        { name: 'Organic Heirloom Tomato Seeds', stock: 8, price: 349, category: 'seeds' },
        { name: 'Biochar Enriched Compost (25kg)', stock: 5, price: 899, category: 'fertilizers' },
        { name: 'Solar Drip Irrigation Solenoid Valve', stock: 12, price: 2199, category: 'irrigation' }
      ],
    });
  }
  const [
    totalOrders,
    totalCustomers,
    totalFarmers,
    totalExperts,
    totalProducts,
    totalCrops,
    orders,
    lowStockProducts,
  ] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Farmer.countDocuments(),
    Expert.countDocuments(),
    Product.countDocuments(),
    Crop.countDocuments(),
    Order.find().sort({ createdAt: -1 }),
    Product.find({ stock: { $lte: 15 } }).select('name stock price category').limit(8),
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
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders,
      totalCustomers,
      totalFarmers,
      totalExperts,
      totalProducts,
      totalCrops,
      lowStockCount: lowStockProducts.length,
    },
    lowStockProducts,
    recentOrders: orders.slice(0, 8),
    salesChart: salesChart.length ? salesChart : [{ label: 'Nov', revenue: totalRevenue || 38200 }],
  });
});

export const getAllOrders = asyncHandler(async (_req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return sendSuccess(res, { orders: [] });
  }
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
  if (mongoose.connection.readyState !== 1) {
    return sendSuccess(res, { users: DEMO_USERS });
  }
  const users = await User.find().sort({ createdAt: -1 });
  sendSuccess(res, { users });
});

export const getAllFarmers = asyncHandler(async (_req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return sendSuccess(res, {
      farmers: [
        { _id: '6735e0000000000000000011', name: 'Elena Vance', farmName: 'Green Valley Regenerative Farm', location: 'Sonoma County, CA', totalAcres: 45, verified: true },
        { _id: '6735e0000000000000000012', name: 'Marcus Thorne', farmName: 'Sunridge Agro-Ecosystems', location: 'Willamette Valley, OR', totalAcres: 78, verified: true },
      ],
    });
  }
  const farmers = await Farmer.find().sort({ createdAt: -1 });
  sendSuccess(res, { farmers });
});

export const updateFarmerVerification = asyncHandler(async (req, res) => {
  const farmer = await Farmer.findByIdAndUpdate(
    req.params.id,
    { verified: Boolean(req.body.verified) },
    { new: true }
  );
  if (!farmer) throw new ApiError(404, 'Farmer profile not found');
  sendSuccess(res, { farmer });
});

export const getAllExperts = asyncHandler(async (_req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return sendSuccess(res, {
      experts: [
        { _id: '6735e0000000000000000021', name: 'Dr. Aris Thorne', title: 'Principal Soil Microbiologist', fieldOfStudy: 'Soil Science', verified: true, approvalStatus: 'approved' },
        { _id: '6735e0000000000000000022', name: 'Sofia Al-Mansoor', title: 'Precision Irrigation Engineer', fieldOfStudy: 'Smart Water Systems', verified: true, approvalStatus: 'approved' },
      ],
    });
  }
  const experts = await Expert.find()
    .populate('user', 'name email role phone isApproved approvalStatus createdAt')
    .sort({ createdAt: -1 });
  sendSuccess(res, { experts });
});

export const approveExpert = asyncHandler(async (req, res) => {
  const expert = await Expert.findById(req.params.id);
  if (!expert) throw new ApiError(404, 'Expert profile not found');

  expert.verified = true;
  expert.approvalStatus = 'approved';
  await expert.save();

  if (expert.user) {
    await User.findByIdAndUpdate(expert.user, {
      isApproved: true,
      approvalStatus: 'approved',
    });
  }

  const populated = await Expert.findById(expert._id).populate(
    'user',
    'name email role phone isApproved approvalStatus'
  );
  sendSuccess(
    res,
    { expert: populated },
    'Agriculture Expert accepted and verified. Login access has been granted.'
  );
});

export const rejectExpert = asyncHandler(async (req, res) => {
  const expert = await Expert.findById(req.params.id);
  if (!expert) throw new ApiError(404, 'Expert profile not found');

  expert.verified = false;
  expert.approvalStatus = 'rejected';
  await expert.save();

  if (expert.user) {
    await User.findByIdAndUpdate(expert.user, {
      isApproved: false,
      approvalStatus: 'rejected',
    });
  }

  const populated = await Expert.findById(expert._id).populate(
    'user',
    'name email role phone isApproved approvalStatus'
  );
  sendSuccess(res, { expert: populated }, 'Agriculture Expert registration rejected.');
});

export const updateExpertVerification = asyncHandler(async (req, res) => {
  const { verified, approvalStatus } = req.body;
  const isVerified = Boolean(verified);
  const status = approvalStatus || (isVerified ? 'approved' : 'pending');

  const expert = await Expert.findById(req.params.id);
  if (!expert) throw new ApiError(404, 'Expert profile not found');

  expert.verified = isVerified;
  expert.approvalStatus = status;
  await expert.save();

  if (expert.user) {
    await User.findByIdAndUpdate(expert.user, {
      isApproved: isVerified,
      approvalStatus: status,
    });
  }

  const populated = await Expert.findById(expert._id).populate(
    'user',
    'name email role phone isApproved approvalStatus'
  );
  sendSuccess(res, { expert: populated }, 'Expert status updated.');
});

export const deleteProductAdmin = asyncHandler(async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) throw new ApiError(404, 'Product not found');
  sendSuccess(res, {}, 'Product deleted');
});

export const createProductAdmin = asyncHandler(async (req, res) => {
  const { name, category, price, stock, unit, shortDescription, description, image, supplierName } = req.body;
  const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}-${Date.now().toString().slice(-4)}`;
  const product = await Product.create({
    name,
    slug,
    category: category || 'equipment',
    categoryLabel: category || 'Equipment',
    price: Number(price),
    stock: Number(stock || 20),
    unit: unit || '1 unit',
    shortDescription,
    description: description || shortDescription,
    image: image || '/assets/img/products/heirloom-tomatoes.jpg',
    supplierName: supplierName || 'Earthora Ecosystem Supplier',
  });
  sendSuccess(res, { product }, 'Product listed', 201);
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

export const resolveMessageAdmin = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { status: 'resolved' },
    { new: true }
  );
  sendSuccess(res, { message }, 'Marked resolved');
});
