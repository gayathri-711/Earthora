import { Router } from 'express';
import { createOrder, getMyOrders, trackOrder } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/track/:orderNumber', trackOrder);
router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);

export default router;

