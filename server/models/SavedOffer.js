const mongoose = require('mongoose');

const savedOfferSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate saves by the same user for the same offer
savedOfferSchema.index({ user: 1, offer: 1 }, { unique: true });

module.exports = mongoose.model('SavedOffer', savedOfferSchema);
