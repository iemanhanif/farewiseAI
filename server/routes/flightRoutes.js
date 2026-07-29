import express from 'express';
import {
  searchFlights,
  getMonthlyFares,
  getDashboardStats
} from '../controllers/flightController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/search', searchFlights);
router.get('/monthly-prices', getMonthlyFares);
router.get('/dashboard-stats', protect, getDashboardStats);

export default router;
