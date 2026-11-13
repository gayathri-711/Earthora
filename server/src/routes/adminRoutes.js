import { Router } from 'express';
import {
  createProductAdmin,
  deleteProductAdmin,
  deleteReviewAdmin,
  getAdminOverview,
  getAllExperts,
  getAllFarmers,
  getAllMessagesAdmin,
  getAllOrders,
  getAllReviewsAdmin,
  getAllUsers,
  resolveMessageAdmin,
  updateExpertVerification,
  updateFarmerVerification,
  updateOrderStatus,
} from '../controllers/adminController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();
router.use(protect, authorize('admin'));

router.get('/overview', getAdminOverview);
router.get('/orders', getAllOrders);
router.patch('/orders/:id', updateOrderStatus);
router.get('/users', getAllUsers);
router.get('/farmers', getAllFarmers);
router.patch('/farmers/:id', updateFarmerVerification);
router.get('/experts', getAllExperts);
router.patch('/experts/:id', updateExpertVerification);
router.post('/products', createProductAdmin);
router.delete('/products/:id', deleteProductAdmin);
router.get('/reviews', getAllReviewsAdmin);
router.delete('/reviews/:id', deleteReviewAdmin);
router.get('/messages', getAllMessagesAdmin);
router.patch('/messages/:id/resolve', resolveMessageAdmin);

export default router;
