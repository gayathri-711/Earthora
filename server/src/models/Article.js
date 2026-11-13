import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: {
      type: String,
      enum: [
        'Smart Irrigation',
        'Soil Regeneration',
        'Precision Farming',
        'Pest & Crop Health',
        'Organic Standards',
        'AgTech Insights',
      ],
      default: 'Precision Farming',
    },
    author: { type: String, default: 'Earthora Agritech Editorial' },
    authorTitle: { type: String, default: 'Agronomy Research Lead' },
    readTime: { type: String, default: '5 min read' },
    image: { type: String, default: '/assets/img/knowledge/precision-drip-irrigation.jpg' },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: ['AgTech', 'Sustainable', 'IoT'] },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Article', articleSchema);

