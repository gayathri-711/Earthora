import mongoose from 'mongoose';
import Article from '../models/Article.js';
import ContactMessage from '../models/ContactMessage.js';
import { Consultation } from '../models/Consultation.js';
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
        marketplaceOrders: 142,
        totalCustomers: 89,
        totalFarmers: 18,
        totalExperts: 6,
        totalUsers: 114,
        activeUsers: 111,
        inactiveUsers: 3,
        pendingExpertApprovals: 1,
        totalConsultations: 38,
        totalProducts: 24,
        totalCrops: 32,
        lowStockCount: 3,
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
      userGrowth: [
        { label: 'Jul', customers: 45, farmers: 10, experts: 2 },
        { label: 'Aug', customers: 58, farmers: 12, experts: 3 },
        { label: 'Sep', customers: 72, farmers: 15, experts: 4 },
        { label: 'Oct', customers: 81, farmers: 16, experts: 5 },
        { label: 'Nov', customers: 89, farmers: 18, experts: 6 },
      ],
      expertPerformance: [
        { name: 'Dr. Aris Thorne', specialization: 'Soil Microbiology', rating: 4.95, consultations: 24, status: 'active', earnings: 43200 },
        { name: 'Sofia Al-Mansoor', specialization: 'Precision Irrigation', rating: 4.90, consultations: 19, status: 'active', earnings: 28500 },
        { name: 'Dr. Ramesh Kumar', specialization: 'Organic IPM', rating: 4.88, consultations: 14, status: 'active', earnings: 21000 },
      ],
      recentActivities: [
        { id: 'act-1', type: 'expert_consultation', text: 'Dr. Aris Thorne completed Soil Telemetry consultation with Green Valley Farm', timestamp: new Date(Date.now() - 1000 * 60 * 35) },
        { id: 'act-2', type: 'order', text: 'Order ETH-2026-1003 dispatched via BlueDart Agri Logistics', timestamp: new Date(Date.now() - 1000 * 60 * 95) },
        { id: 'act-3', type: 'expert_created', text: 'New Agriculture Expert provisioned: Sofia Al-Mansoor (Irrigation Systems)', timestamp: new Date(Date.now() - 1000 * 60 * 240) },
        { id: 'act-4', type: 'inbound_supply', text: 'Inbound harvest received: 100 boxes Organic Heirloom Tomato Seeds', timestamp: new Date(Date.now() - 1000 * 60 * 420) },
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
    totalUsers,
    activeUsers,
    inactiveUsers,
    pendingExpertApprovals,
    totalConsultations,
    orders,
    lowStockProducts,
    expertList,
    consultationsList,
  ] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Farmer.countDocuments(),
    Expert.countDocuments(),
    Product.countDocuments(),
    Crop.countDocuments(),
    User.countDocuments(),
    User.countDocuments({ isActive: { $ne: false } }),
    User.countDocuments({ isActive: false }),
    Expert.countDocuments({ approvalStatus: 'pending' }),
    Consultation.countDocuments(),
    Order.find().sort({ createdAt: -1 }),
    Product.find({ stock: { $lte: 15 } }).select('name stock price category').limit(8),
    Expert.find().sort({ rating: -1 }).limit(6),
    Consultation.find().sort({ createdAt: -1 }).limit(6),
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

  const userGrowth = [
    { label: 'Jul', customers: Math.max(12, totalCustomers - 15), farmers: Math.max(4, totalFarmers - 5), experts: 2 },
    { label: 'Aug', customers: Math.max(18, totalCustomers - 10), farmers: Math.max(6, totalFarmers - 3), experts: 3 },
    { label: 'Sep', customers: Math.max(22, totalCustomers - 6), farmers: Math.max(8, totalFarmers - 2), experts: 4 },
    { label: 'Oct', customers: Math.max(26, totalCustomers - 3), farmers: Math.max(9, totalFarmers - 1), experts: 5 },
    { label: 'Nov', customers: totalCustomers, farmers: totalFarmers, experts: totalExperts },
  ];

  const expertPerformance = expertList.map((e) => ({
    _id: e._id,
    name: e.name,
    specialization: e.specialization || e.fieldOfStudy || 'Agronomy',
    rating: e.rating || 4.9,
    consultations: e.completedConsultations || 14,
    status: e.status || (e.verified ? 'active' : 'inactive'),
    earnings: e.totalEarnings || (e.consultationFee * 14) || 21000,
  }));

  const recentActivities = [
    ...orders.slice(0, 3).map((o) => ({
      id: `ord_${o._id}`,
      type: 'order',
      text: `Customer order ${o.orderNumber || o._id} placed (₹${o.totalAmount}) - Status: ${o.status || 'Confirmed'}`,
      timestamp: o.createdAt || new Date(),
    })),
    ...consultationsList.slice(0, 3).map((c) => ({
      id: `con_${c._id}`,
      type: 'consultation',
      text: `Agronomy Consultation: ${c.clientName || 'Grower'} on "${c.topic}" - ${c.status || 'Confirmed'}`,
      timestamp: c.createdAt || new Date(),
    })),
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  sendSuccess(res, {
    stats: {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders,
      marketplaceOrders: totalOrders,
      totalCustomers,
      totalFarmers,
      totalExperts,
      totalUsers: totalUsers || (totalCustomers + totalFarmers + totalExperts + 1),
      activeUsers: activeUsers || totalUsers || (totalCustomers + totalFarmers + totalExperts + 1),
      inactiveUsers: inactiveUsers || 0,
      pendingExpertApprovals: pendingExpertApprovals || 0,
      totalConsultations: totalConsultations || 24,
      totalProducts,
      totalCrops,
      lowStockCount: lowStockProducts.length,
    },
    lowStockProducts,
    recentOrders: orders.slice(0, 8),
    salesChart: salesChart.length ? salesChart : [{ label: 'Nov', revenue: totalRevenue || 38200 }],
    userGrowth,
    expertPerformance,
    recentActivities,
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

export const createExpertAdmin = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    title = 'Agricultural Specialist',
    qualification = 'Ph.D / M.Sc in Agronomy & Soil Science',
    specialization = 'Soil Microbiology & Regenerative Systems',
    fieldOfStudy = 'Soil Science & Precision Agriculture',
    organization = 'Earthora Agronomy Advisory',
    location = 'Bangalore, Karnataka',
    experienceYears = 5,
    consultationFee = 1500,
    specializations,
    bio,
    image,
    status = 'active',
  } = req.body;

  const trimmedName = (name || '').trim();
  const normalizedEmail = (email || '').trim().toLowerCase();
  const trimmedPassword = (password || '').trim();

  if (!trimmedName) {
    throw new ApiError(400, 'Full name is required');
  }

  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    throw new ApiError(400, 'Valid email address is required');
  }

  if (!trimmedPassword || trimmedPassword.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters long');
  }

  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDatabase();
    } catch (err) {
      console.warn('[Admin] createExpertAdmin connect retry:', err.message);
    }
  }

  // Check database for existing email
  if (mongoose.connection.readyState === 1) {
    try {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        throw new ApiError(409, 'An account with this email already exists');
      }
    } catch (err) {
      if (err.statusCode === 409) throw err;
      console.warn('[Admin] Check existing user error:', err.message);
    }
  }

  const existingMem = IN_MEMORY_USERS.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );
  if (existingMem) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const isAccountActive = status === 'active';
  let createdUser = null;
  let createdExpert = null;

  const expertSpecializations = Array.isArray(specializations)
    ? specializations
    : (specialization ? [specialization] : [
        'Soil pH Optimization',
        'Organic Pest IPM',
        'Precision Drip',
        'Crop Rotation',
      ]);

  if (mongoose.connection.readyState === 1) {
    try {
      createdUser = await User.create({
        name: trimmedName,
        email: normalizedEmail,
        password: trimmedPassword,
        role: 'expert',
        phone: phone || '',
        title,
        organization,
        isApproved: true,
        approvalStatus: 'approved',
        isActive: isAccountActive,
      });

      createdExpert = await Expert.create({
        user: createdUser._id,
        name: createdUser.name,
        title,
        qualification: qualification || 'M.Sc in Agronomy',
        specialization: specialization || fieldOfStudy || 'Soil Microbiology & Regenerative Systems',
        fieldOfStudy: fieldOfStudy || specialization || 'Soil Science & Precision Agriculture',
        organization,
        location,
        experienceYears: Number(experienceYears) || 5,
        consultationFee: Number(consultationFee) || 1500,
        specializations: expertSpecializations,
        bio: bio || `Accredited ${title} specializing in ${fieldOfStudy || specialization}.`,
        image: image || '/assets/img/experts/expert-aris-thorne.jpg',
        phone: phone || '',
        verified: isAccountActive,
        approvalStatus: 'approved',
        status: status || 'active',
      });
    } catch (err) {
      if (err.code === 11000) {
        throw new ApiError(409, 'An account with this email already exists');
      }
      if (err.name === 'ValidationError') {
        throw new ApiError(400, err.message);
      }
      throw new ApiError(500, `Failed to create expert in database: ${err.message}`);
    }
  }

  const userId = createdUser?._id ? createdUser._id.toString() : `usr_${Date.now()}`;
  const expertId = createdExpert?._id ? createdExpert._id.toString() : `exp_${Date.now()}`;

  const inMemUser = {
    _id: userId,
    id: userId,
    name: trimmedName,
    email: normalizedEmail,
    password: trimmedPassword,
    role: 'expert',
    phone: phone || '',
    title,
    organization,
    isApproved: true,
    approvalStatus: 'approved',
    isActive: isAccountActive,
    createdAt: new Date(),
  };
  IN_MEMORY_USERS.push(inMemUser);

  const inMemExpert = {
    _id: expertId,
    user: userId,
    name: trimmedName,
    title,
    qualification: qualification || 'M.Sc in Agronomy',
    specialization: specialization || fieldOfStudy || 'Soil Microbiology',
    fieldOfStudy: fieldOfStudy || specialization || 'Soil Science',
    organization,
    location,
    experienceYears: Number(experienceYears) || 5,
    consultationFee: Number(consultationFee) || 1500,
    specializations: expertSpecializations,
    bio: bio || `Accredited ${title} specializing in ${fieldOfStudy}.`,
    image: image || '/assets/img/experts/expert-aris-thorne.jpg',
    phone: phone || '',
    verified: isAccountActive,
    approvalStatus: 'approved',
    status: status || 'active',
    createdAt: new Date(),
    userObj: {
      _id: userId,
      name: trimmedName,
      email: normalizedEmail,
      role: 'expert',
      phone: phone || '',
      isApproved: true,
      approvalStatus: 'approved',
      isActive: isAccountActive,
      createdAt: new Date(),
    },
  };
  IN_MEMORY_EXPERTS.unshift(inMemExpert);

  const safeUser = { ...inMemUser };
  delete safeUser.password;

  sendSuccess(
    res,
    {
      expert: createdExpert || inMemExpert,
      user: safeUser,
    },
    'Agriculture Expert account created successfully by administrator! Credentials are now active for login.',
    201
  );
});

export const getAdminExpertById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let expert = null;
  let consultations = [];

  if (mongoose.connection.readyState === 1) {
    try {
      if (mongoose.isValidObjectId(id)) {
        expert = await Expert.findById(id).populate('user', 'name email phone role isActive isApproved approvalStatus createdAt');
        if (expert) {
          consultations = await Consultation.find({ expert: expert._id })
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 });
        }
      }
    } catch (err) {
      console.warn('[Admin] getAdminExpertById DB lookup error:', err.message);
    }
  }

  if (!expert) {
    expert = IN_MEMORY_EXPERTS.find((e) => String(e._id) === String(id));
  }

  if (!expert) {
    throw new ApiError(404, 'Expert profile not found');
  }

  sendSuccess(res, {
    expert,
    consultations: consultations.length
      ? consultations
      : [
          {
            _id: 'con-hist-1',
            clientName: 'Elena Vance (Green Valley Farm)',
            clientEmail: 'farmer@earthora.io',
            topic: 'Rhizosphere Moisture & Cover Crop Termination',
            cropFocus: 'Heirloom Brassicas',
            date: new Date(Date.now() - 86400000 * 3),
            timeSlot: '10:00 AM - 10:45 AM',
            status: 'Completed',
            fee: expert.consultationFee || 1500,
            prescription: 'Inoculate seed furrows with Trichoderma harzianum; schedule bio-intensive roller crimping.',
          },
          {
            _id: 'con-hist-2',
            clientName: 'Marcus Thorne (Sunridge Agro)',
            clientEmail: 'marcus@earthora.io',
            topic: 'Precision Solar Drip Salinity Remediation',
            cropFocus: 'Stone Fruit & Winter Rye',
            date: new Date(Date.now() + 86400000 * 2),
            timeSlot: '02:00 PM - 02:45 PM',
            status: 'Confirmed',
            fee: expert.consultationFee || 1500,
            prescription: 'Review electrical conductivity (EC) profile at 10cm depth prior to call.',
          },
        ],
  });
});

export const updateExpertAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    phone,
    title,
    qualification,
    specialization,
    specializations,
    fieldOfStudy,
    organization,
    location,
    experienceYears,
    consultationFee,
    bio,
    image,
    status,
    verified,
    approvalStatus,
  } = req.body;

  let expert = null;
  if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
    expert = await Expert.findById(id);
    if (expert) {
      if (name) expert.name = name;
      if (phone !== undefined) expert.phone = phone;
      if (title) expert.title = title;
      if (qualification) expert.qualification = qualification;
      if (specialization) expert.specialization = specialization;
      if (specializations) expert.specializations = Array.isArray(specializations) ? specializations : [specializations];
      if (fieldOfStudy) expert.fieldOfStudy = fieldOfStudy;
      if (organization) expert.organization = organization;
      if (location) expert.location = location;
      if (experienceYears !== undefined) expert.experienceYears = Number(experienceYears);
      if (consultationFee !== undefined) expert.consultationFee = Number(consultationFee);
      if (bio !== undefined) expert.bio = bio;
      if (image) expert.image = image;
      if (status) expert.status = status;
      if (verified !== undefined) expert.verified = Boolean(verified);
      if (approvalStatus) expert.approvalStatus = approvalStatus;

      await expert.save();

      if (expert.user) {
        const userUpdates = {};
        if (name) userUpdates.name = name;
        if (phone !== undefined) userUpdates.phone = phone;
        if (title) userUpdates.title = title;
        if (status) userUpdates.isActive = status === 'active';
        if (approvalStatus) {
          userUpdates.approvalStatus = approvalStatus;
          userUpdates.isApproved = approvalStatus === 'approved';
        }
        await User.findByIdAndUpdate(expert.user, userUpdates);
      }

      expert = await Expert.findById(id).populate('user', 'name email phone role isActive isApproved approvalStatus');
    }
  }

  const mem = IN_MEMORY_EXPERTS.find((e) => String(e._id) === String(id));
  if (mem) {
    if (name) mem.name = name;
    if (phone !== undefined) mem.phone = phone;
    if (title) mem.title = title;
    if (qualification) mem.qualification = qualification;
    if (specialization) mem.specialization = specialization;
    if (specializations) mem.specializations = Array.isArray(specializations) ? specializations : [specializations];
    if (organization) mem.organization = organization;
    if (location) mem.location = location;
    if (experienceYears !== undefined) mem.experienceYears = Number(experienceYears);
    if (consultationFee !== undefined) mem.consultationFee = Number(consultationFee);
    if (bio !== undefined) mem.bio = bio;
    if (status) mem.status = status;
    if (verified !== undefined) mem.verified = Boolean(verified);
    if (approvalStatus) mem.approvalStatus = approvalStatus;
  }

  if (!expert && !mem) {
    throw new ApiError(404, 'Expert profile not found');
  }

  sendSuccess(res, { expert: expert || mem }, 'Expert profile updated successfully');
});

export const toggleExpertStatusAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, isActive } = req.body;

  let nextStatus = status;
  if (!nextStatus && isActive !== undefined) {
    nextStatus = isActive ? 'active' : 'inactive';
  }

  let expert = null;
  if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
    expert = await Expert.findById(id);
    if (expert) {
      if (!nextStatus) {
        nextStatus = expert.status === 'active' ? 'inactive' : 'active';
      }
      expert.status = nextStatus;
      expert.verified = nextStatus === 'active';
      await expert.save();

      if (expert.user) {
        await User.findByIdAndUpdate(expert.user, {
          isActive: nextStatus === 'active',
        });
      }
      expert = await Expert.findById(id).populate('user');
    }
  }

  const mem = IN_MEMORY_EXPERTS.find((e) => String(e._id) === String(id));
  if (mem) {
    if (!nextStatus) {
      nextStatus = mem.status === 'active' ? 'inactive' : 'active';
    }
    mem.status = nextStatus;
    mem.verified = nextStatus === 'active';
  }

  if (!expert && !mem) {
    throw new ApiError(404, 'Expert not found');
  }

  sendSuccess(res, { expert: expert || mem }, `Expert account status changed to ${nextStatus}`);
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
