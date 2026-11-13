import { Router } from 'express';
import {
  addProductReview,
  getProductDetails,
  listCategories,
  listFarmers,
  listProducts,
} from '../controllers/productController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/products', listProducts);
router.get('/products/:id', getProductDetails);
router.post('/products/:id/reviews', optionalAuth, addProductReview);
router.get('/categories', listCategories);
router.get('/farmers', listFarmers);

export default router;

