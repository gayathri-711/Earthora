import { Router } from 'express';
import {
  createArticle,
  getArticleBySlug,
  getArticles,
} from '../controllers/knowledgeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getArticles);
router.get('/:slug', getArticleBySlug);
router.post('/', protect, createArticle);

export default router;
