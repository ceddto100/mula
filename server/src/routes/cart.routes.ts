import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cart.controller';
import { auth } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { cartItemValidation } from '../utils/validators';

const router = Router();

// All routes are protected
router.use(auth);

router.get('/', getCart);
router.post('/', cartItemValidation, validateRequest, addToCart);
router.put('/:itemId', updateCartItem);
router.delete('/:itemId', removeFromCart);
router.delete('/', clearCart);

export default router;
