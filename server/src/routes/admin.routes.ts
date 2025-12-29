import { Router } from 'express';
import {
  getDashboardStats,
  createProduct,
  updateProduct,
  deleteProduct,
  hardDeleteProduct,
  getAdminProducts,
  getAdminProduct,
  updateInventory,
  bulkUpdateStatus,
  getFilterOptions,
  getAdminOrders,
  updateOrderStatus,
  uploadImage,
  uploadImages,
  deleteImage,
} from '../controllers/admin.controller';
import { auth } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';
import { validateRequest } from '../middleware/validateRequest';
import {
  shopifyProductValidation,
  shopifyProductUpdateValidation,
  mongoIdValidation,
} from '../utils/validators';
import { upload } from '../config/cloudinary';

const router = Router();

// All routes are protected and require admin role
router.use(auth);
router.use(adminAuth);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Products (Shopify-style)
router.get('/products', getAdminProducts);
router.get('/products/filters', getFilterOptions);
router.get('/products/:id', mongoIdValidation, validateRequest, getAdminProduct);
router.post('/products', shopifyProductValidation, validateRequest, createProduct);
router.put('/products/:id', mongoIdValidation, shopifyProductUpdateValidation, validateRequest, updateProduct);
router.delete('/products/:id', mongoIdValidation, validateRequest, deleteProduct);
router.delete('/products/:id/permanent', mongoIdValidation, validateRequest, hardDeleteProduct);

// Inventory management
router.put('/products/:id/inventory', mongoIdValidation, validateRequest, updateInventory);

// Bulk operations
router.post('/products/bulk/status', bulkUpdateStatus);

// Orders
router.get('/orders', getAdminOrders);
router.put('/orders/:id', mongoIdValidation, validateRequest, updateOrderStatus);

// Image upload
router.post('/upload', upload.single('image'), uploadImage);
router.post('/upload-multiple', upload.array('images', 10), uploadImages);
router.delete('/image', deleteImage);

export default router;
