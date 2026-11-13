import { Router } from 'express';
import {
  getBlogBySlug,
  listBlogs,
  submitContactMessage,
  subscribeNewsletter,
} from '../controllers/contentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadImage } from '../middleware/uploadMiddleware.js';
import { ApiError, sendSuccess } from '../utils/http.js';

const router = Router();
router.get('/blogs', listBlogs);
router.get('/blogs/:slug', getBlogBySlug);
router.post('/contact', submitContactMessage);
router.post('/contact/newsletter', subscribeNewsletter);

router.post('/upload', protect, uploadImage.single('image'), (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Image file is required');
  }
  sendSuccess(res, { url: `/uploads/${req.file.filename}` }, 'Image uploaded', 201);
});

export default router;

