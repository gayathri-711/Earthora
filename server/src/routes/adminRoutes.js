import { Router } from 'express';
import {
  createBlogAdmin,
  createCategoryAdmin,
  deleteProductAdmin,
  deleteReviewAdmin,
  getAdminOverview,
  getAllFarmers,
  getAllMessagesAdmin,
  getAllOrders,
  getAllReviewsAdmin,
  getAllUsers,
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
router.delete('/products/:id', deleteProductAdmin);
router.post('/categories', createCategoryAdmin);
router.post('/blogs', createBlogAdmin);
router.get('/reviews', getAllReviewsAdmin);
router.delete('/reviews/:id', deleteReviewAdmin);
router.get('/messages', getAllMessagesAdmin);

export default router;

