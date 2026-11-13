import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, default: 'Sustainable Farming' },
    author: { type: String, default: 'Agriva Editorial' },
    readTime: { type: String, default: '5 min read' },
    image: { type: String, default: '/assets/img/home-4/news-1.jpg' },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Blog', blogSchema);

