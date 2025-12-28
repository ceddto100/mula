import express, { Router } from 'express';
import {
  createCheckoutSession,
  handleWebhook,
  verifyPayment,
} from '../controllers/payment.controller';
import { auth } from '../middleware/auth';

const router = Router();

// Webhook needs raw body for signature verification
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

// Protected routes
router.post('/create-checkout-session', auth, createCheckoutSession);
router.get('/verify/:sessionId', auth, verifyPayment);

export default router;
