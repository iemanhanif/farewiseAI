import { getFlightRecommendation, askTravelAssistant } from '../services/geminiService.js';
import Flight from '../models/Flight.js';

/**
 * @desc    Analyze flight search results and generate recommendation
 * @route   POST /api/ai/recommend
 * @access  Public
 */
export const recommendFlights = async (req, res, next) => {
  try {
    const { flights, searchParams } = req.body;

    if (!flights || !searchParams) {
      return res.status(400).json({ message: 'Flights list and search parameters are required' });
    }

    const recommendation = await getFlightRecommendation(flights, searchParams);
    res.json({ recommendation });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Chat with the AI travel assistant chatbot
 * @route   POST /api/ai/chat
 * @access  Private
 */
export const chatWithAssistant = async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const reply = await askTravelAssistant(message, history || []);
    res.json({ reply });
  } catch (error) {
    next(error);
  }
};
