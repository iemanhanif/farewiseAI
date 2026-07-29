import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema(
  {
    airline: {
      type: String,
      required: [true, 'Airline is required'],
      trim: true
    },
    from: {
      type: String,
      required: [true, 'Departure city is required'],
      trim: true,
      index: true
    },
    to: {
      type: String,
      required: [true, 'Destination city is required'],
      trim: true,
      index: true
    },
    departureDate: {
      type: String, // Store as YYYY-MM-DD
      required: [true, 'Departure date is required'],
      index: true
    },
    returnDate: {
      type: String // Optional, store as YYYY-MM-DD
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      index: true
    },
    duration: {
      type: String, // e.g. "2h 15m" or "14h 30m"
      required: [true, 'Duration is required']
    },
    stops: {
      type: Number,
      default: 0
    },
    class: {
      type: String, // "Economy", "Business", "First"
      required: [true, 'Travel class is required'],
      enum: ['Economy', 'Business', 'First'],
      default: 'Economy'
    }
  },
  {
    timestamps: true
  }
);

const Flight = mongoose.model('Flight', flightSchema);
export default Flight;
