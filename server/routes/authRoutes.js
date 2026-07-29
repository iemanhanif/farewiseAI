import express from 'express';
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  registerValidator,
  loginValidator,
  profileUpdateValidator,
  forgotPasswordValidator,
  resetPasswordValidator
} from '../validators/inputValidators.js';

const router = express.Router();

router.post('/register', registerValidator, registerUser);
router.post('/login', loginValidator, loginUser);
router.post('/forgot-password', forgotPasswordValidator, forgotPassword);
router.post('/reset-password', resetPasswordValidator, resetPassword);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, profileUpdateValidator, updateUserProfile);

export default router;
