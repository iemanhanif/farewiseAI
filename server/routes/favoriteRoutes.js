import express from 'express';
import {
  getFavorites,
  saveFlight,
  removeFlight
} from '../controllers/favoriteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Secure all endpoints in this file

router.route('/')
  .get(getFavorites)
  .post(saveFlight);

router.delete('/:flightId', removeFlight);

export default router;
