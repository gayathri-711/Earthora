import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: {
      type: String,
      enum: ['seeds', 'fertilizers', 'equipment', 'irrigation', 'produce'],
      required: true,
      default: 'produce',
    },
    categoryLabel: { type: String, default: 'Fresh Produce' },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
    supplierName: { type: String, default: 'Earthora Verified Partner' },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: null },
    unit: { type: String, default: '1 kg' },
    stock: { type: Number, required: true, min: 0, default: 0 },
    harvestDate: { type: Date, default: Date.now },
    season: { type: String, default: 'Year-Round' },
    certifications: { type: [String], default: ['USDA Organic', 'Earthora Verified'] },
    originCode: { type: String, default: '' },
    image: { type: String, default: '/assets/img/products/heirloom-tomatoes.jpg' },
    gallery: { type: [String], default: [] },
    shortDescription: { type: String, required: true },
    description: { type: String, default: '' },
    specs: {
      type: Map,
      of: String,
      default: {},
    },
    featured: { type: Boolean, default: false },
    rating: { type: Number, default: 4.9 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
