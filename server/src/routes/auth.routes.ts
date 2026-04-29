import { Router } from 'express';
import passport from 'passport';
import {
  register,
  login,
  logout,
  getMe,
  googleCallback,
  updateProfile,
  addAddress,
  deleteAddress,
} from '../controllers/auth.controller';
import { auth } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { registerValidation, loginValidation, addressValidation } from '../utils/validators';
import { getPrimaryClientUrl } from '../utils/clientUrl';

const router = Router();
const clientUrl = getPrimaryClientUrl();

// Public routes
router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.post('/logout', logout);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${clientUrl}/login?error=auth_failed`,
    session: false,
  }),
  googleCallback
);

// Protected routes
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);
router.post('/address', auth, addressValidation, validateRequest, addAddress);
router.delete('/address/:addressId', auth, deleteAddress);

export default router;
