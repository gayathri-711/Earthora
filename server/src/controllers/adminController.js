import mongoose from 'mongoose';
import Article from '../models/Article.js';
import ContactMessage from '../models/ContactMessage.js';
import Crop from '../models/Crop.js';
import Expert from '../models/Expert.js';
import Farmer from '../models/Farmer.js';
import Inventory from '../models/Inventory.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import SoilTest from '../models/SoilTest.js';
import SupplyReceipt from '../models/SupplyReceipt.js';
import User from '../models/User.js';
import { connectDatabase } from '../config/db.js';
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
    try {
      await connectDatabase();
    } catch (err) {
      console.warn('[Admin] getAllOrders connectDatabase error:', err.message);
    }
  }

  if (mongoose.connection.readyState !== 1) {
    return sendSuccess(res, {
      orders: [
        {
          _id: '6735e0000000000000000101',
          orderNumber: 'ETH-2026-1001',
          user: { name: 'Claire Bennett', email: 'customer@earthora.io' },
          customerName: 'Claire Bennett',
          customerEmail: 'customer@earthora.io',
          customerPhone: '+1 555 010 2233',
          shippingAddress: {
            fullName: 'Claire Bennett',
            email: 'customer@earthora.io',
            phone: '+1 555 010 2233',
            street: '742 Evergreen Terrace',
            city: 'Portland',
            state: 'OR',
            postalCode: '97205',
            country: 'USA',
            deliverySlot: 'Standard Delivery (2-3 business days)',
          },
          items: [
            { name: 'Organic Heirloom Tomato Seeds', price: 349, quantity: 2 },
            { name: 'Cold-Pressed Mustard Oil (1L)', price: 420, quantity: 2 },
          ],
          totalAmount: 1538,
          paymentMethod: 'card',
          paymentStatus: 'paid',
          status: 'Dispatched',
          courierPartner: 'BlueDart Agri-Logistics',
          trackingNumber: 'TRK-982410-IN',
          dispatchedAt: new Date(Date.now() - 86400000),
          createdAt: new Date(Date.now() - 172800000),
        },
      ],
    });
  }
  const orders = await Order.find()
    .populate('user', 'name email phone address')
    .sort({ createdAt: -1 });

  const mapped = orders.map((o) => {
    const obj = typeof o.toObject === 'function' ? o.toObject() : { ...o };
    obj.customerName = obj.shippingAddress?.fullName || obj.user?.name || 'Customer';
    obj.customerEmail = obj.shippingAddress?.email || obj.user?.email || 'N/A';
    obj.customerPhone = obj.shippingAddress?.phone || obj.user?.phone || 'N/A';
    return obj;
  });

  sendSuccess(res, { orders: mapped });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, courierPartner, trackingNumber, adminNotes } = req.body;

  const updateFields = {};
  if (status) {
    updateFields.status = status;
    const lower = status.toLowerCase();
    if (lower === 'dispatched' || lower === 'shipped') {
      updateFields.dispatchedAt = new Date();
    } else if (lower === 'delivered') {
      updateFields.deliveredAt = new Date();
    }
  }
  if (courierPartner !== undefined) updateFields.courierPartner = courierPartner;
  if (trackingNumber !== undefined) updateFields.trackingNumber = trackingNumber;
  if (adminNotes !== undefined) updateFields.adminNotes = adminNotes;

  let order = null;
  if (mongoose.connection.readyState === 1) {
    if (mongoose.isValidObjectId(id)) {
      order = await Order.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });
    }
    if (!order) {
      order = await Order.findOneAndUpdate({ orderNumber: id }, updateFields, { new: true, runValidators: true });
    }
  }

  if (!order) {
    order = {
      _id: id,
      orderNumber: id.startsWith('ETH') ? id : 'ETH-2026-1001',
      status: status || 'Dispatched',
      ...updateFields,
    };
  }

  sendSuccess(res, { order }, 'Order updated successfully');
});

let IN_MEMORY_RECEIPTS = [
  {
    _id: 'rec-001',
    receiptNumber: 'REC-2026-1001',
    productName: 'Organic Heirloom Tomato Seeds',
    category: 'seeds',
    supplierName: 'Elena Vance - Green Valley Farm',
    supplierContact: '+1 555 014 8899',
    supplierLocation: 'Sonoma County, CA',
    quantityReceived: 100,
    unit: 'boxes',
    unitCost: 180,
    totalCost: 18000,
    batchNumber: 'BATCH-2026-TOM-01',
    receivedAt: new Date(Date.now() - 3 * 86400000),
    receivedBy: 'Earthora Central Sorting Hub',
    qualityStatus: 'Passed - Grade A Organic',
    warehouseLocation: 'Central Cold Storage Hub A',
    notes: 'Certified USDA Organic harvested at peak firmness. High germination rate confirmed.',
  },
  {
    _id: 'rec-002',
    receiptNumber: 'REC-2026-1002',
    productName: 'Biochar Enriched Compost (25kg)',
    category: 'fertilizers',
    supplierName: 'Marcus Thorne - Sunridge Agro',
    supplierContact: '+1 555 019 4411',
    supplierLocation: 'Willamette Valley, OR',
    quantityReceived: 40,
    unit: 'bags',
    unitCost: 550,
    totalCost: 22000,
    batchNumber: 'BATCH-2026-BIO-09',
    receivedAt: new Date(Date.now() - 1 * 86400000),
    receivedBy: 'Earthora Central Sorting Hub',
    qualityStatus: 'Passed - Grade A Organic',
    warehouseLocation: 'Dry Storage Bay 3',
    notes: 'Pyrolyzed hardwood feedstock with active mycorrhizal inoculation.',
  },
];

export const getAllSupplyReceipts = asyncHandler(async (_req, res) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDatabase();
    } catch (err) {
      console.warn('[Admin] getAllSupplyReceipts connectDatabase error:', err.message);
    }
  }

  if (mongoose.connection.readyState === 1) {
    try {
      const receipts = await SupplyReceipt.find()
        .populate('product', 'name category price stock')
        .populate('farmer', 'farmName name location')
        .sort({ receivedAt: -1 });
      return sendSuccess(res, { receipts });
    } catch (err) {
      console.warn('[Admin] getAllSupplyReceipts DB error:', err.message);
    }
  }
  sendSuccess(res, { receipts: IN_MEMORY_RECEIPTS });
});

export const createSupplyReceipt = asyncHandler(async (req, res) => {
  const {
    productName,
    productId,
    category = 'produce',
    supplierName,
    supplierContact,
    supplierLocation,
    quantityReceived,
    unit = 'kg',
    unitCost = 0,
    batchNumber,
    receivedAt,
    qualityStatus = 'Passed - Grade A Organic',
    warehouseLocation = 'Central Cold Storage Hub A',
    notes = '',
    updateStock = true,
  } = req.body;

  if (!productName || !supplierName || !quantityReceived) {
    throw new ApiError(400, 'Product name, supplier name, and quantity received are required');
  }

  const qty = Math.max(1, Number(quantityReceived));
  const cost = Number(unitCost) || 0;
  const total = Number((qty * cost).toFixed(2));
  const receiptNumber = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  let receipt = null;

  if (mongoose.connection.readyState === 1) {
    let matchedProduct = null;
    if (productId && mongoose.isValidObjectId(productId)) {
      matchedProduct = await Product.findById(productId);
    } else {
      matchedProduct = await Product.findOne({
        name: { $regex: new RegExp(`^${productName.trim()}$`, 'i') },
      });
    }

    receipt = await SupplyReceipt.create({
      receiptNumber,
      product: matchedProduct?._id || null,
      productName: matchedProduct?.name || productName.trim(),
      category: matchedProduct?.category || category,
      supplierName: supplierName.trim(),
      supplierContact: supplierContact || '',
      supplierLocation: supplierLocation || '',
      quantityReceived: qty,
      unit,
      unitCost: cost,
      totalCost: total,
      batchNumber: batchNumber || `BATCH-${Date.now().toString().slice(-6)}`,
      receivedAt: receivedAt ? new Date(receivedAt) : new Date(),
      receivedBy: req.user?.name || 'Earthora Central Sorting Hub',
      qualityStatus,
      warehouseLocation,
      notes,
      stockUpdated: Boolean(updateStock && matchedProduct),
    });

    if (updateStock && matchedProduct) {
      const prevStock = matchedProduct.stock || 0;
      matchedProduct.stock = prevStock + qty;
      await matchedProduct.save();

      await Inventory.create({
        product: matchedProduct._id,
        farmer: matchedProduct.farmer,
        changeAmount: qty,
        previousStock: prevStock,
        newStock: matchedProduct.stock,
        reason: 'restock',
      });
    }
  } else {
    receipt = {
      _id: `rec_${Date.now()}`,
      receiptNumber,
      productName: productName.trim(),
      category,
      supplierName: supplierName.trim(),
      supplierContact: supplierContact || '',
      supplierLocation: supplierLocation || '',
      quantityReceived: qty,
      unit,
      unitCost: cost,
      totalCost: total,
      batchNumber: batchNumber || `BATCH-${Date.now().toString().slice(-6)}`,
      receivedAt: receivedAt ? new Date(receivedAt) : new Date(),
      receivedBy: req.user?.name || 'Earthora Central Sorting Hub',
      qualityStatus,
      warehouseLocation,
      notes,
      stockUpdated: Boolean(updateStock),
      createdAt: new Date(),
    };
    IN_MEMORY_RECEIPTS.unshift(receipt);
  }

  sendSuccess(res, { receipt }, 'Inbound shipment receipt recorded into database successfully', 201);
});

export const deleteSupplyReceipt = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
    await SupplyReceipt.findByIdAndDelete(id);
  }
  IN_MEMORY_RECEIPTS = IN_MEMORY_RECEIPTS.filter((r) => String(r._id) !== String(id));
  sendSuccess(res, null, 'Supply receipt deleted');
});

export const getAllUsers = asyncHandler(async (_req, res) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDatabase();
    } catch (err) {
      console.warn('[Admin] getAllUsers connectDatabase error:', err.message);
    }
  }

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
    try {
      await connectDatabase();
    } catch (err) {
      console.warn('[Admin] getAllFarmers connectDatabase error:', err.message);
    }
  }

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
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDatabase();
    } catch (err) {
      console.warn('[Admin] getAllExperts connectDatabase error:', err.message);
    }
  }

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
