import express from 'express';
import {
  getSearchHistory,
  deleteHistoryItem,
  clearAllHistory
} from '../controllers/historyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Secure all endpoints in this file

router.route('/')
  .get(getSearchHistory)
  .delete(clearAllHistory);

router.delete('/:id', deleteHistoryItem);

export default router;
