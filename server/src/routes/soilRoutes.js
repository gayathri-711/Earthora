import { Router } from 'express';
import {
  createSoilTest,
  getSoilAnalytics,
  getSoilTestById,
  getSoilTests,
} from '../controllers/soilController.js';
import { optionalAuth, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuth, getSoilTests);
router.get('/analytics', getSoilAnalytics);
router.get('/:id', getSoilTestById);
router.post('/', protect, createSoilTest);

export default router;
