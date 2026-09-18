const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'Review must belong to a business'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide a rating between 1 and 5 stars'],
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      trim: true,
      maxlength: [1000, 'Review cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting multiple reviews for the same business
reviewSchema.index({ business: 1, user: 1 }, { unique: true });

// Static method to compute average rating for a business
reviewSchema.statics.calculateAverageRating = async function (businessId) {
  const Business = mongoose.model('Business');
  const stats = await this.aggregate([
    { $match: { business: businessId } },
    {
      $group: {
        _id: '$business',
        numReviews: { $sum: 1 },
        rating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Business.findByIdAndUpdate(businessId, {
      rating: Math.round(stats[0].rating * 10) / 10,
      numReviews: stats[0].numReviews,
    });
  } else {
    await Business.findByIdAndUpdate(businessId, {
      rating: 5.0,
      numReviews: 0,
    });
  }
};

// Call calculateAverageRating after save
reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.business);
});

// Call calculateAverageRating before deleteOne/remove
reviewSchema.post('deleteOne', { document: true, query: false }, async function () {
  await this.constructor.calculateAverageRating(this.business);
});

module.exports = mongoose.model('Review', reviewSchema);
