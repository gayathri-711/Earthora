import { Router } from 'express';
import {
  createCrop,
  deleteCrop,
  getCropById,
  getCrops,
  logFertilizer,
  logIrrigation,
  updateCrop,
} from '../controllers/cropController.js';
import { optionalAuth, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuth, getCrops);
router.get('/:id', getCropById);
router.post('/', protect, createCrop);
router.put('/:id', protect, updateCrop);
router.post('/:id/irrigation', protect, logIrrigation);
router.post('/:id/fertilizer', protect, logFertilizer);
router.delete('/:id', protect, deleteCrop);

export default router;

