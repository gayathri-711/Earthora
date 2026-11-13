import { Router } from 'express';
import {
  createFarmerProduct,
  deleteFarmerProduct,
  getFarmerDashboard,
  updateFarmerOrderStatus,
  updateFarmerProduct,
  updateFarmerProfile,
} from '../controllers/farmerController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();
router.use(protect, authorize('farmer', 'admin'));

router.get('/dashboard', getFarmerDashboard);
router.put('/profile', updateFarmerProfile);
router.post('/products', createFarmerProduct);
router.put('/products/:id', updateFarmerProduct);
router.delete('/products/:id', deleteFarmerProduct);
router.patch('/orders/:id/status', updateFarmerOrderStatus);

export default router;

