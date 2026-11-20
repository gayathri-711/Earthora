import { Router } from 'express';
import {
  approveExpert,
  createExpertAdmin,
  createProductAdmin,
  deleteProductAdmin,
  deleteReviewAdmin,
  getAdminExpertById,
  getAdminOverview,
  getAllExperts,
  getAllFarmers,
  getAllMessagesAdmin,
  getAllOrders,
  getAllReviewsAdmin,
  getAllSupplyReceipts,
  getAllUsers,
  createSupplyReceipt,
  deleteSupplyReceipt,
  rejectExpert,
  resolveMessageAdmin,
  toggleExpertStatusAdmin,
  updateExpertAdmin,
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
router.get('/supply-receipts', getAllSupplyReceipts);
router.post('/supply-receipts', createSupplyReceipt);
router.delete('/supply-receipts/:id', deleteSupplyReceipt);
router.get('/users', getAllUsers);
router.get('/farmers', getAllFarmers);
router.patch('/farmers/:id', updateFarmerVerification);
router.get('/experts', getAllExperts);
router.post('/experts', createExpertAdmin);
router.get('/experts/:id', getAdminExpertById);
router.put('/experts/:id', updateExpertAdmin);
router.patch('/experts/:id', updateExpertAdmin);
router.patch('/experts/:id/status', toggleExpertStatusAdmin);
router.patch('/experts/:id/approve', approveExpert);
router.patch('/experts/:id/reject', rejectExpert);
router.post('/products', createProductAdmin);
router.delete('/products/:id', deleteProductAdmin);
router.get('/reviews', getAllReviewsAdmin);
router.delete('/reviews/:id', deleteReviewAdmin);
router.get('/messages', getAllMessagesAdmin);
router.patch('/messages/:id/resolve', resolveMessageAdmin);

export default router;
