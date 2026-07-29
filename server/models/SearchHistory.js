import mongoose from 'mongoose';

const searchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    from: {
      type: String,
      required: true,
      trim: true
    },
    to: {
      type: String,
      required: true,
      trim: true
    },
    departureDate: {
      type: String,
      required: true
    },
    returnDate: {
      type: String
    },
    cheapestPrice: {
      type: Number
    },
    searchDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);
export default SearchHistory;
