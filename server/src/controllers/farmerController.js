import mongoose from 'mongoose';
import Farmer from '../models/Farmer.js';
import Inventory from '../models/Inventory.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { ApiError, asyncHandler, sendSuccess } from '../utils/http.js';

async function resolveFarmerProfile(user) {
  let farmer = await Farmer.findOne({ user: user._id });
  if (!farmer) {
    farmer = await Farmer.create({
      user: user._id,
      name: user.name,
      farmName: `${user.name}'s Organic Farm`,
      location: 'Regional Organic Hub',
      verified: true,
    });
  }
  return farmer;
}

export const getFarmerDashboard = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return sendSuccess(res, {
      farmer: {
        name: req.user?.name || 'Elena Vance',
        farmName: req.user?.organization || 'Green Valley Regenerative Farm',
        totalAcres: 45,
        cultivatedAcres: 38,
        specialty: 'Heirloom Brassicas & Bio-Intensive Roots',
        verified: true,
      },
      products: [
        { _id: '6735e0000000000000000031', name: 'Heirloom Vine Tomatoes', price: 180, stock: 45, category: 'produce' },
        { _id: '6735e0000000000000000032', name: 'Crisp Savoy Cabbage', price: 120, stock: 30, category: 'produce' },
      ],
      orders: [],
      stats: {
        totalRevenue: 14200,
        activeProducts: 2,
        lowStock: 0,
        totalOrders: 18,
      },
    });
  }
  const farmer = await resolveFarmerProfile(req.user);
  const products = await Product.find({ farmer: farmer._id }).sort({ createdAt: -1 });
  const orders = await Order.find({ 'items.farmer': farmer._id }).sort({ createdAt: -1 });

  let totalRevenue = 0;
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (item.farmer?.toString() === farmer._id.toString()) {
        totalRevenue += item.price * item.quantity;
      }
    });
  });

  const lowStock = products.filter((p) => p.stock <= 15).length;

  sendSuccess(res, {
    farmer,
    products,
    orders,
    stats: {
      totalRevenue,
      totalOrders: orders.length,
      totalProducts: products.length,
      lowStock,
    },
  });
});

export const updateFarmerProfile = asyncHandler(async (req, res) => {
  const farmer = await resolveFarmerProfile(req.user);
  const { farmName, location, specialty, bio, certifications } = req.body;
  if (farmName) farmer.farmName = farmName;
  if (location) farmer.location = location;
  if (specialty !== undefined) farmer.specialty = specialty;
  if (bio !== undefined) farmer.bio = bio;
  if (Array.isArray(certifications)) farmer.certifications = certifications;
  await farmer.save();
  sendSuccess(res, { farmer }, 'Farm profile updated');
});

export const createFarmerProduct = asyncHandler(async (req, res) => {
  const farmer = await resolveFarmerProfile(req.user);
  const {
    name,
    category,
    price,
    unit,
    stock,
    harvestDate,
    certifications,
    shortDescription,
    description,
    image,
  } = req.body;

  if (!name || !category || price === undefined || !shortDescription) {
    throw new ApiError(400, 'Product name, category, price, and description are required');
  }

  const slug = `${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}-${Date.now().toString().slice(-4)}`;

  const categoryLabels = {
    vegetables: 'Fresh Vegetables',
    fruits: 'Orchard Fruits',
    grains: 'Heritage Grains',
    'dairy-honey': 'Raw Honey & Dairy',
  };

  const product = await Product.create({
    name,
    slug,
    category,
    categoryLabel: categoryLabels[category] || category,
    farmer: farmer._id,
    price: Number(price),
    unit: unit || '1 kg',
    stock: Number(stock || 0),
    harvestDate: harvestDate ? new Date(harvestDate) : new Date(),
    certifications: Array.isArray(certifications) ? certifications : ['USDA Organic'],
    originCode: `AGR-${Date.now().toString().slice(-5)}`,
    image: image || '/assets/img/products/heirloom-tomatoes.jpg',
    gallery: [image || '/assets/img/products/heirloom-tomatoes.jpg'],
    shortDescription,
    description: description || shortDescription,
  });

  await Inventory.create({
    product: product._id,
    farmer: farmer._id,
    changeAmount: product.stock,
    previousStock: 0,
    newStock: product.stock,
    reason: 'restock',
  });

  sendSuccess(res, { product }, 'Product created', 201);
});

export const updateFarmerProduct = asyncHandler(async (req, res) => {
  const farmer = await resolveFarmerProfile(req.user);
  const product = await Product.findOne({ _id: req.params.id, farmer: farmer._id });
  if (!product) {
    throw new ApiError(404, 'Product not found in your farm catalog');
  }

  const previousStock = product.stock;
  const allowed = ['name', 'price', 'unit', 'stock', 'harvestDate', 'shortDescription', 'description'];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });
  await product.save();

  if (req.body.stock !== undefined && Number(req.body.stock) !== previousStock) {
    await Inventory.create({
      product: product._id,
      farmer: farmer._id,
      changeAmount: product.stock - previousStock,
      previousStock,
      newStock: product.stock,
      reason: 'adjustment',
    });
  }

  sendSuccess(res, { product }, 'Product updated');
});

export const deleteFarmerProduct = asyncHandler(async (req, res) => {
  const farmer = await resolveFarmerProfile(req.user);
  const deleted = await Product.findOneAndDelete({ _id: req.params.id, farmer: farmer._id });
  if (!deleted) {
    throw new ApiError(404, 'Product not found in your farm catalog');
  }
  sendSuccess(res, {}, 'Product deleted');
});

export const updateFarmerOrderStatus = asyncHandler(async (req, res) => {
  const farmer = await resolveFarmerProfile(req.user);
  const { status } = req.body;
  const order = await Order.findOne({ _id: req.params.id, 'items.farmer': farmer._id });
  if (!order) {
    throw new ApiError(404, 'Order not found for your farm');
  }
  order.status = status;
  if (status === 'delivered') order.paymentStatus = 'paid';
  await order.save();
  sendSuccess(res, { order }, 'Order status updated');
});

