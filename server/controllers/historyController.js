import SearchHistory from '../models/SearchHistory.js';

/**
 * @desc    Get user search history
 * @route   GET /api/history
 * @access  Private
 */
export const getSearchHistory = async (req, res, next) => {
  try {
    const history = await SearchHistory.find({ userId: req.user._id })
      .sort({ searchDate: -1 });
    res.json(history);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a search history entry
 * @route   DELETE /api/history/:id
 * @access  Private
 */
export const deleteHistoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find history item and verify owner
    const item = await SearchHistory.findOne({ _id: id, userId: req.user._id });
    if (!item) {
      return res.status(404).json({ message: 'Search history entry not found' });
    }

    await item.deleteOne();
    res.json({ message: 'Search history entry deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear all search history for user
 * @route   DELETE /api/history
 * @access  Private
 */
export const clearAllHistory = async (req, res, next) => {
  try {
    await SearchHistory.deleteMany({ userId: req.user._id });
    res.json({ message: 'All search history cleared successfully' });
  } catch (error) {
    next(error);
  }
};
