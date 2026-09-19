const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add an offer title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add an offer description'],
    },
    category: {
      type: String,
      required: [true, 'Please specify category'],
    },
    discountType: {
      type: String,
      enum: ['percentage', 'flat', 'bogo', 'special'],
      default: 'percentage',
    },
    discountValue: {
      type: String,
      required: [true, 'Please add discount value (e.g. 20%, $15 Off, Buy 1 Get 1 Free)'],
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    discountedPrice: {
      type: Number,
      default: 0,
    },
    promoCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: 'DEAL2026',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, 'Please add an expiration date'],
    },
    termsConditions: {
      type: String,
      default: 'Valid on in-store and online redemption. Cannot be combined with other offers. One coupon per customer.',
    },
    bannerImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80',
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    savesCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'expired', 'draft', 'active'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Offer', offerSchema);
