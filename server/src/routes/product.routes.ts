import { Router } from 'express';
import {
  getProducts,
  getProduct,
  getProductByHandle,
  getProductsByCategory,
  getProductsByType,
  getProductsByCollection,
  getProductsByVendor,
  getCategories,
  getProductTypes,
  getCollections,
  getVendors,
  getFeaturedProducts,
  searchProducts,
  getFilterOptions,
} from '../controllers/product.controller';
import { validateRequest } from '../middleware/validateRequest';
import { handleValidation, productQueryValidation } from '../utils/validators';

const router = Router();

// All routes are public

// Product listings
router.get('/', productQueryValidation, validateRequest, getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);

// Filter options
router.get('/filters', getFilterOptions);

// Taxonomy
router.get('/categories', getCategories);
router.get('/types', getProductTypes);
router.get('/collections', getCollections);
router.get('/vendors', getVendors);

// Products by taxonomy
router.get('/category/:category', getProductsByCategory);
router.get('/type/:type', getProductsByType);
router.get('/collection/:collection', getProductsByCollection);
router.get('/vendor/:vendor', getProductsByVendor);

// Single product by handle (SEO-friendly - must come before :id)
router.get('/handle/:handle', handleValidation, validateRequest, getProductByHandle);

// Single product by ID
router.get('/:id', getProduct);

export default router;
