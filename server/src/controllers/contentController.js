import Blog from '../models/Blog.js';
import ContactMessage, { NewsletterSubscriber } from '../models/ContactMessage.js';
import { ApiError, asyncHandler, sendSuccess } from '../utils/http.js';

export const listBlogs = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit || 20);
  const blogs = await Blog.find().sort({ publishedAt: -1 }).limit(limit);
  sendSuccess(res, { blogs });
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog) throw new ApiError(404, 'Article not found');
  sendSuccess(res, { blog });
});

export const submitContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    throw new ApiError(400, 'Name, email, subject, and message are required');
  }
  const saved = await ContactMessage.create({ name, email, phone, subject, message });
  sendSuccess(res, { contact: saved }, 'Message received', 201);
});

export const subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, 'Email is required');
  await NewsletterSubscriber.findOneAndUpdate(
    { email: email.toLowerCase() },
    { email: email.toLowerCase() },
    { upsert: true, new: true }
  );
  sendSuccess(res, {}, 'Subscribed to harvest updates', 201);
});

