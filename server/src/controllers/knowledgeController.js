import mongoose from 'mongoose';
import Article from '../models/Article.js';
import { ApiError, asyncHandler, sendSuccess } from '../utils/http.js';

const DEMO_ARTICLES = [
  {
    _id: '6735e0000000000000000061',
    title: 'The Biochar Standard: Restoring Organic Carbon in Degraded Soils',
    slug: 'biochar-soil-carbon-restoration',
    category: 'Soil Health',
    excerpt: 'Comprehensive field guide to pyrolysis biomass, nutrient loading, and microbial inoculation.',
    author: 'Dr. Aris Thorne',
    readTime: '6 min read',
    publishedAt: new Date(),
    featured: true,
    image: '/assets/img/knowledge/article-biochar.jpg',
  },
  {
    _id: '6735e0000000000000000062',
    title: 'Precision Solar Drip: Slashing Water Waste by 28% in Arid Blocks',
    slug: 'precision-solar-drip-irrigation',
    category: 'Smart Technology',
    excerpt: 'How IoT LoRaWAN soil moisture tension probes actuate automated solar valves.',
    author: 'Sofia Al-Mansoor',
    readTime: '5 min read',
    publishedAt: new Date(),
    featured: true,
    image: '/assets/img/knowledge/article-drip.jpg',
  },
  {
    _id: '6735e0000000000000000063',
    title: 'Living Mulch & Cover Crop Poly-Cultures for Maximum Nitrogen Fixation',
    slug: 'living-mulch-cover-crop-polycultures',
    category: 'Regenerative Agriculture',
    excerpt: 'Pairing hairy vetch with winter rye to build 120 lbs of organic nitrogen per acre.',
    author: 'Elena Vance',
    readTime: '7 min read',
    publishedAt: new Date(),
    featured: true,
    image: '/assets/img/knowledge/article-covercrops.jpg',
  },
  {
    _id: '6735e0000000000000000064',
    title: 'Indigenous Seed Saving and Climate Resilience in Semiarid Farmlands',
    slug: 'indigenous-seed-saving-climate-resilience',
    category: 'Seeds & Heritage',
    excerpt: 'Preserving open-pollinated heirloom grain varieties to withstand heat spikes and erratic rainfall.',
    author: 'Marcus Thorne',
    readTime: '4 min read',
    publishedAt: new Date(),
    featured: false,
    image: '/assets/img/knowledge/article-seeds.jpg',
  },
];

export const getArticles = asyncHandler(async (req, res) => {
  const { category, search, limit = 50 } = req.query;

  if (mongoose.connection.readyState !== 1) {
    let list = [...DEMO_ARTICLES];
    if (category && category !== 'All') list = list.filter((a) => a.category === category);
    if (search) {
      list = list.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase()));
    }
    if (limit) list = list.slice(0, Number(limit));
    return sendSuccess(res, { articles: list });
  }

  const filter = {};
  if (category && category !== 'All') filter.category = category;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  try {
    const articles = await Article.find(filter).sort({ publishedAt: -1 }).limit(Number(limit));
    sendSuccess(res, { articles });
  } catch (err) {
    console.warn('[Knowledge] DB query error, falling back to demo articles:', err.message);
    let list = [...DEMO_ARTICLES];
    if (limit) list = list.slice(0, Number(limit));
    sendSuccess(res, { articles: list });
  }
});

export const getArticleBySlug = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const a = DEMO_ARTICLES.find((art) => art.slug === req.params.slug) || DEMO_ARTICLES[0];
    return sendSuccess(res, { article: a });
  }
  const article = await Article.findOne({ slug: req.params.slug });
  if (!article) throw new ApiError(404, 'Article not found');
  sendSuccess(res, { article });
});

export const createArticle = asyncHandler(async (req, res) => {
  const { title, category, excerpt, content, tags, image, readTime } = req.body;
  if (!title || !content || !excerpt) {
    throw new ApiError(400, 'Title, excerpt, and content are required');
  }

  const slug = `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60)}-${Date.now().toString().slice(-4)}`;

  const article = await Article.create({
    title,
    slug,
    category: category || 'Precision Farming',
    author: req.user?.name || 'Earthora Research Team',
    authorTitle: req.user?.title || 'Agronomy Specialist',
    readTime: readTime || '5 min read',
    image: image || '/assets/img/knowledge/precision-drip-irrigation.jpg',
    excerpt,
    content,
    tags: Array.isArray(tags) ? tags : ['AgTech', 'Sustainable', 'Farming'],
  });

  sendSuccess(res, { article }, 'Article published to Knowledge Hub', 201);
});

