import { Router } from 'express';
import {
  getProducts,
  getProduct,
  getProductsByCategory,
  getCategories,
  getFeaturedProducts,
} from '../controllers/product.controller';

const router = Router();

// All routes are public
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);

export default router;
