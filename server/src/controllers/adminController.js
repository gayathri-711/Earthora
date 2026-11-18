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
import { DEMO_USERS, IN_MEMORY_USERS, IN_MEMORY_EXPERTS } from '../config/demoUsers.js';
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
  let dbUsers = [];
  if (mongoose.connection.readyState === 1) {
    try {
      dbUsers = await User.find().select('-password').sort({ createdAt: -1 });
    } catch (err) {
      console.warn('[Admin] getAllUsers DB error:', err.message);
    }
  }

  const existingEmails = new Set(dbUsers.map((u) => u.email.toLowerCase()));
  const extraInMem = IN_MEMORY_USERS.filter(
    (u) => !existingEmails.has(u.email.toLowerCase())
  ).map((u) => {
    const copy = { ...u };
    delete copy.password;
    return copy;
  });

  const combined = [...dbUsers, ...extraInMem];
  sendSuccess(res, { users: combined });
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
  if (mongoose.connection.readyState !== 1) {
    return sendSuccess(res, { farmer: { _id: req.params.id, verified: Boolean(req.body.verified) } });
  }
  const farmer = await Farmer.findByIdAndUpdate(
    req.params.id,
    { verified: Boolean(req.body.verified) },
    { new: true }
  );
  if (!farmer) throw new ApiError(404, 'Farmer profile not found');
  sendSuccess(res, { farmer });
});

export const getAllExperts = asyncHandler(async (_req, res) => {
  let dbExperts = [];
  if (mongoose.connection.readyState === 1) {
    try {
      dbExperts = await Expert.find()
        .populate('user', 'name email role phone isApproved approvalStatus createdAt')
        .sort({ createdAt: -1 });
    } catch (err) {
      console.warn('[Admin] getAllExperts DB lookup error:', err.message);
    }
  }

  // Merge in-memory expert applications (newly registered experts awaiting or completed approval)
  const existingDbIds = new Set(dbExperts.map((e) => String(e._id)));
  const inMemoryMapped = IN_MEMORY_EXPERTS.filter(
    (e) => !existingDbIds.has(String(e._id))
  ).map((e) => ({
    ...e,
    user: e.userObj || {
      name: e.name,
      email: e.email || 'expert@earthora.io',
      role: 'expert',
      isApproved: e.approvalStatus === 'approved',
      approvalStatus: e.approvalStatus,
    },
  }));

  const allExperts = [...dbExperts, ...inMemoryMapped];
  sendSuccess(res, { experts: allExperts });
});

export const approveExpert = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let updated = null;

  // 1. Update in-memory registry
  const mem = IN_MEMORY_EXPERTS.find((e) => String(e._id) === String(id));
  if (mem) {
    mem.verified = true;
    mem.approvalStatus = 'approved';
    if (mem.userObj) {
      mem.userObj.isApproved = true;
      mem.userObj.approvalStatus = 'approved';
    }

    const memUser = IN_MEMORY_USERS.find(
      (u) =>
        String(u._id) === String(mem.user) ||
        (mem.userObj && u.email.toLowerCase() === mem.userObj.email.toLowerCase())
    );
    if (memUser) {
      memUser.isApproved = true;
      memUser.approvalStatus = 'approved';
    }

    updated = {
      ...mem,
      user: mem.userObj || {
        name: mem.name,
        email: memUser?.email || 'expert@earthora.io',
        role: 'expert',
        isApproved: true,
        approvalStatus: 'approved',
      },
    };
  }

  // 2. Also update database if connected
  if (mongoose.connection.readyState === 1) {
    try {
      const expert = await Expert.findById(id);
      if (expert) {
        expert.verified = true;
        expert.approvalStatus = 'approved';
        await expert.save();

        if (expert.user) {
          const userDoc = await User.findByIdAndUpdate(
            expert.user,
            {
              isApproved: true,
              approvalStatus: 'approved',
            },
            { new: true }
          );
          if (userDoc) {
            const inMem = IN_MEMORY_USERS.find(
              (u) => u.email.toLowerCase() === userDoc.email.toLowerCase()
            );
            if (inMem) {
              inMem.isApproved = true;
              inMem.approvalStatus = 'approved';
            }
          }
        }

        updated = await Expert.findById(expert._id).populate(
          'user',
          'name email role phone isApproved approvalStatus'
        );
      }
    } catch (err) {
      console.warn('[Admin] approveExpert DB update error:', err.message);
    }
  }

  if (!updated && !mem) {
    throw new ApiError(404, 'Expert profile not found');
  }

  sendSuccess(
    res,
    { expert: updated || mem },
    'Agriculture Expert accepted and verified. Login access has been granted.'
  );
});

export const rejectExpert = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let updated = null;

  // 1. Update in-memory registry
  const mem = IN_MEMORY_EXPERTS.find((e) => String(e._id) === String(id));
  if (mem) {
    mem.verified = false;
    mem.approvalStatus = 'rejected';
    if (mem.userObj) {
      mem.userObj.isApproved = false;
      mem.userObj.approvalStatus = 'rejected';
    }

    const memUser = IN_MEMORY_USERS.find(
      (u) =>
        String(u._id) === String(mem.user) ||
        (mem.userObj && u.email.toLowerCase() === mem.userObj.email.toLowerCase())
    );
    if (memUser) {
      memUser.isApproved = false;
      memUser.approvalStatus = 'rejected';
    }

    updated = {
      ...mem,
      user: mem.userObj || {
        name: mem.name,
        email: memUser?.email || 'expert@earthora.io',
        role: 'expert',
        isApproved: false,
        approvalStatus: 'rejected',
      },
    };
  }

  // 2. Update database if connected
  if (mongoose.connection.readyState === 1) {
    try {
      const expert = await Expert.findById(id);
      if (expert) {
        expert.verified = false;
        expert.approvalStatus = 'rejected';
        await expert.save();

        if (expert.user) {
          await User.findByIdAndUpdate(expert.user, {
            isApproved: false,
            approvalStatus: 'rejected',
          });
        }

        updated = await Expert.findById(expert._id).populate(
          'user',
          'name email role phone isApproved approvalStatus'
        );
      }
    } catch (err) {
      console.warn('[Admin] rejectExpert DB update error:', err.message);
    }
  }

  if (!updated && !mem) {
    throw new ApiError(404, 'Expert profile not found');
  }

  sendSuccess(res, { expert: updated || mem }, 'Agriculture Expert registration rejected.');
});

export const updateExpertVerification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { verified, approvalStatus } = req.body;
  const isVerified = Boolean(verified);
  const status = approvalStatus || (isVerified ? 'approved' : 'pending');

  let updated = null;
  const mem = IN_MEMORY_EXPERTS.find((e) => String(e._id) === String(id));
  if (mem) {
    mem.verified = isVerified;
    mem.approvalStatus = status;
    if (mem.userObj) {
      mem.userObj.isApproved = isVerified;
      mem.userObj.approvalStatus = status;
    }
    const memUser = IN_MEMORY_USERS.find(
      (u) =>
        String(u._id) === String(mem.user) ||
        (mem.userObj && u.email.toLowerCase() === mem.userObj.email.toLowerCase())
    );
    if (memUser) {
      memUser.isApproved = isVerified;
      memUser.approvalStatus = status;
    }
    updated = {
      ...mem,
      user: mem.userObj || {
        name: mem.name,
        email: memUser?.email || 'expert@earthora.io',
        role: 'expert',
        isApproved: isVerified,
        approvalStatus: status,
      },
    };
  }

  if (mongoose.connection.readyState === 1) {
    try {
      const expert = await Expert.findById(id);
      if (expert) {
        expert.verified = isVerified;
        expert.approvalStatus = status;
        await expert.save();

        if (expert.user) {
          await User.findByIdAndUpdate(expert.user, {
            isApproved: isVerified,
            approvalStatus: status,
          });
        }

        updated = await Expert.findById(expert._id).populate(
          'user',
          'name email role phone isApproved approvalStatus'
        );
      }
    } catch (err) {
      console.warn('[Admin] updateExpertVerification DB error:', err.message);
    }
  }

  sendSuccess(res, { expert: updated || mem }, 'Expert status updated.');
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
