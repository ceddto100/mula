import { Router } from 'express';
import {
  getDashboardStats,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts,
  getAdminOrders,
  updateOrderStatus,
  uploadImage,
  uploadImages,
  deleteImage,
} from '../controllers/admin.controller';
import { auth } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';
import { validateRequest } from '../middleware/validateRequest';
import { productValidation, mongoIdValidation } from '../utils/validators';
import { upload } from '../config/cloudinary';

const router = Router();

// All routes are protected and require admin role
router.use(auth);
router.use(adminAuth);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Products
router.get('/products', getAdminProducts);
router.post('/products', productValidation, validateRequest, createProduct);
router.put('/products/:id', mongoIdValidation, validateRequest, updateProduct);
router.delete('/products/:id', mongoIdValidation, validateRequest, deleteProduct);

// Orders
router.get('/orders', getAdminOrders);
router.put('/orders/:id', mongoIdValidation, validateRequest, updateOrderStatus);

// Image upload
router.post('/upload', upload.single('image'), uploadImage);
router.post('/upload-multiple', upload.array('images', 10), uploadImages);
router.delete('/image', deleteImage);

export default router;
