import mongoose from 'mongoose';

const savedFlightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    flightId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flight',
      required: true
    },
    savedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure uniqueness of user+flight combination
savedFlightSchema.index({ userId: 1, flightId: 1 }, { unique: true });

const SavedFlight = mongoose.model('SavedFlight', savedFlightSchema);
export default SavedFlight;
