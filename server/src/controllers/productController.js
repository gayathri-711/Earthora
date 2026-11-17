import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Farmer from '../models/Farmer.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import { DEMO_PRODUCTS } from '../config/demoProducts.js';
import { ApiError, asyncHandler, sendSuccess } from '../utils/http.js';

export const listProducts = asyncHandler(async (req, res) => {
  const { category, search, featured, minPrice, maxPrice, sort, limit = 100 } = req.query;

  if (mongoose.connection.readyState !== 1) {
    let list = [...DEMO_PRODUCTS];
    if (category && category !== 'all' && category !== 'All') {
      list = list.filter((p) => p.category === category.toLowerCase());
    }
    if (featured === 'true') {
      list = list.filter((p) => p.featured === true);
    }
    if (search) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.shortDescription.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (limit) {
      list = list.slice(0, Number(limit));
    }
    return sendSuccess(res, { products: list });
  }

  const query = {};

  if (category && category !== 'all' && category !== 'All') {
    query.category = category.toLowerCase();
  }
  if (featured === 'true') query.featured = true;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } },
      { supplierName: { $regex: search, $options: 'i' } },
    ];
  }
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const sortMap = {
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    rating: { rating: -1 },
    newest: { createdAt: -1 },
  };

  try {
    const products = await Product.find(query)
      .populate('farmer', 'name farmName location specialty certifications image verified')
      .sort(sortMap[sort] || { featured: -1, createdAt: -1 })
      .limit(Number(limit));

    sendSuccess(res, { products });
  } catch (err) {
    console.warn('[Products] DB query error, falling back to demo products:', err.message);
    let list = [...DEMO_PRODUCTS];
    if (featured === 'true') list = list.filter((p) => p.featured === true);
    if (limit) list = list.slice(0, Number(limit));
    sendSuccess(res, { products: list });
  }
});

export const getProductDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (mongoose.connection.readyState !== 1) {
    const p = DEMO_PRODUCTS.find((item) => item._id === id || item.slug === id) || DEMO_PRODUCTS[0];
    return sendSuccess(res, { product: p, reviews: [] });
  }
  const query = mongoose.isValidObjectId(id) ? { _id: id } : { slug: id };
  const product = await Product.findOne(query).populate(
    'farmer',
    'name farmName location specialty certifications bio image experience'
  );

  if (!product) {
    throw new ApiError(404, 'Marketplace item not found');
  }

  const reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 });
  sendSuccess(res, { product, reviews });
});

export const addProductReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  if (!comment || !rating) {
    throw new ApiError(400, 'Rating and comment are required');
  }

  const query = mongoose.isValidObjectId(id) ? { _id: id } : { slug: id };
  const product = await Product.findOne(query);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const review = await Review.create({
    product: product._id,
    user: req.user?._id || null,
    userName: req.user?.name || req.body.userName || 'Verified Grower',
    rating: Math.min(5, Math.max(1, Number(rating))),
    comment,
  });

  const stats = await Review.aggregate([
    { $match: { product: product._id } },
    { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  if (stats[0]) {
    product.rating = Number(stats[0].avg.toFixed(1));
    product.reviewCount = stats[0].count;
    await product.save();
  }

  sendSuccess(res, { review }, 'Review published', 201);
});

export const listCategories = asyncHandler(async (_req, res) => {
  const categories = [
    { id: 'all', name: 'All Products', slug: 'all', icon: 'Layers' },
    { id: 'seeds', name: 'Seeds & Seedlings', slug: 'seeds', icon: 'Sprout' },
    { id: 'fertilizers', name: 'Organic Fertilizers', slug: 'fertilizers', icon: 'Sparkles' },
    { id: 'equipment', name: 'Farming Equipment', slug: 'equipment', icon: 'Tractor' },
    { id: 'irrigation', name: 'Smart Irrigation', slug: 'irrigation', icon: 'Droplets' },
    { id: 'produce', name: 'Fresh Farm Produce', slug: 'produce', icon: 'Apple' },
  ];
  sendSuccess(res, { categories });
});

export const listFarmers = asyncHandler(async (_req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return sendSuccess(res, {
      farmers: [
        {
          _id: '6735e0000000000000000011',
          name: 'Elena Vance',
          farmName: 'Green Valley Regenerative Farm',
          location: 'Sonoma County, CA',
          specialty: 'Heirloom Brassicas & Bio-Intensive Roots',
          totalAcres: 45,
          cultivatedAcres: 38,
          primaryCrops: ['Savoy Cabbage', 'Heirloom Vine Tomatoes', 'Winter Rye Cover'],
          certifications: ['USDA Organic', 'Regenerative Organic Certified', 'Earthora Verified'],
          verified: true,
          image: '/assets/img/farmers/farmer-elena.jpg',
        },
        {
          _id: '6735e0000000000000000012',
          name: 'Marcus Thorne',
          farmName: 'Sunridge Agro-Ecosystems',
          location: 'Willamette Valley, OR',
          specialty: 'Ancient Grains & Silvopasture Orchard Systems',
          totalAcres: 78,
          cultivatedAcres: 64,
          primaryCrops: ['Ancient Einkorn Wheat', 'Honeycrisp Apples', 'Comfrey Understory'],
          certifications: ['Certified Biodynamic', 'Earthora Verified'],
          verified: true,
          image: '/assets/img/farmers/farmer-marcus.jpg',
        },
      ],
    });
  }
  const farmers = await Farmer.find({ verified: true }).sort({ createdAt: -1 });
  sendSuccess(res, { farmers });
});
