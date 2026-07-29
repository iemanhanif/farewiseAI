import SavedFlight from '../models/SavedFlight.js';
import Flight from '../models/Flight.js';

/**
 * @desc    Get user's favorite flights
 * @route   GET /api/favorites
 * @access  Private
 */
export const getFavorites = async (req, res, next) => {
  try {
    const favorites = await SavedFlight.find({ userId: req.user._id })
      .populate('flightId')
      .sort({ savedAt: -1 });
    
    // Filter out null references if a flight was removed from seed
    const activeFavorites = favorites.filter(item => item.flightId !== null);
    
    res.json(activeFavorites);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Save a flight to favorites
 * @route   POST /api/favorites
 * @access  Private
 */
export const saveFlight = async (req, res, next) => {
  try {
    const { flightId } = req.body;

    if (!flightId) {
      return res.status(400).json({ message: 'Flight ID is required' });
    }

    // Check if flight exists
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    // Check if already favorited
    const existingFav = await SavedFlight.findOne({
      userId: req.user._id,
      flightId
    });

    if (existingFav) {
      return res.status(400).json({ message: 'Flight already in favorites' });
    }

    // Create favorite
    const fav = await SavedFlight.create({
      userId: req.user._id,
      flightId
    });

    res.status(201).json({
      message: 'Flight added to favorites successfully',
      favorite: fav
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove a flight from favorites
 * @route   DELETE /api/favorites/:flightId
 * @access  Private
 */
export const removeFlight = async (req, res, next) => {
  try {
    const { flightId } = req.params;

    const fav = await SavedFlight.findOne({
      userId: req.user._id,
      flightId
    });

    if (!fav) {
      return res.status(404).json({ message: 'Saved flight not found' });
    }

    await fav.deleteOne();
    res.json({ message: 'Flight removed from favorites successfully' });
  } catch (error) {
    next(error);
  }
};
