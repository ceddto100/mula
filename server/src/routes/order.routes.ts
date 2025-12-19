import { Router } from 'express';
import {
  getOrders,
  getOrder,
  getOrderByNumber,
  getOrderBySession,
} from '../controllers/order.controller';
import { auth } from '../middleware/auth';

const router = Router();

// All routes are protected
router.use(auth);

router.get('/', getOrders);
router.get('/number/:orderNumber', getOrderByNumber);
router.get('/session/:sessionId', getOrderBySession);
router.get('/:id', getOrder);

export default router;
