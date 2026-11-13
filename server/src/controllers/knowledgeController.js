import Article from '../models/Article.js';
import { ApiError, asyncHandler, sendSuccess } from '../utils/http.js';

export const getArticles = asyncHandler(async (req, res) => {
  const { category, search, limit = 50 } = req.query;
  const filter = {};
  if (category && category !== 'All') filter.category = category;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  const articles = await Article.find(filter).sort({ publishedAt: -1 }).limit(Number(limit));
  sendSuccess(res, { articles });
});

export const getArticleBySlug = asyncHandler(async (req, res) => {
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
    image: image || '/assets/img/home-4/news-1.jpg',
    excerpt,
    content,
    tags: Array.isArray(tags) ? tags : ['AgTech', 'Sustainable', 'Farming'],
  });

  sendSuccess(res, { article }, 'Article published to Knowledge Hub', 201);
});
