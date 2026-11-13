import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Farmer from '../models/Farmer.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import { ApiError, asyncHandler, sendSuccess } from '../utils/http.js';

export const listProducts = asyncHandler(async (req, res) => {
  const { category, search, featured, minPrice, maxPrice, sort, limit = 50 } = req.query;
  const query = {};

  if (category && category !== 'all') query.category = category;
  if (featured === 'true') query.featured = true;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } },
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

  const products = await Product.find(query)
    .populate('farmer', 'name farmName location specialty certifications image verified')
    .sort(sortMap[sort] || { featured: -1, createdAt: -1 })
    .limit(Number(limit));

  sendSuccess(res, { products });
});

export const getProductDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const query = mongoose.isValidObjectId(id) ? { _id: id } : { slug: id };
  const product = await Product.findOne(query).populate(
    'farmer',
    'name farmName location specialty certifications bio image experience'
  );

  if (!product) {
    throw new ApiError(404, 'Product not found');
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
    userName: req.user?.name || req.body.userName || 'Verified Shopper',
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
  const categories = await Category.find().sort({ name: 1 });
  sendSuccess(res, { categories });
});

export const listFarmers = asyncHandler(async (_req, res) => {
  const farmers = await Farmer.find({ verified: true }).sort({ createdAt: -1 });
  sendSuccess(res, { farmers });
});

