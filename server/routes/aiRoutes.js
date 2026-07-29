import express from 'express';
import { recommendFlights, chatWithAssistant } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/recommend', recommendFlights);
router.post('/chat', protect, chatWithAssistant);

export default router;
