import mongoose from 'mongoose';

const monthlyPriceSchema = new mongoose.Schema(
  {
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
      index: true
    },
    month: {
      type: String, // e.g. "January", "February", etc.
      required: [true, 'Month is required']
    },
    averagePrice: {
      type: Number,
      required: [true, 'Average price is required']
    }
  },
  {
    timestamps: true
  }
);

// Enforce unique combination of destination and month
monthlyPriceSchema.index({ destination: 1, month: 1 }, { unique: true });

const MonthlyPrice = mongoose.model('MonthlyPrice', monthlyPriceSchema);
export default MonthlyPrice;
