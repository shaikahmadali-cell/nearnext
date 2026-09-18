const Review = require('../models/Review');
const Business = require('../models/Business');

// @desc    Get all reviews for a business
// @route   GET /api/businesses/:businessId/reviews or GET /api/reviews?businessId=xyz
// @access  Public
const getBusinessReviews = async (req, res, next) => {
  try {
    const businessId = req.params.businessId || req.query.businessId;

    if (!businessId) {
      return res.status(400).json({ success: false, message: 'Please specify a business ID' });
    }

    const reviews = await Review.find({ business: businessId })
      .populate('user', 'name avatar role')
      .sort('-createdAt');

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a review for a business
// @route   POST /api/businesses/:businessId/reviews
// @access  Private (Customer, Business, Admin)
const createReview = async (req, res, next) => {
  try {
    const businessId = req.params.businessId || req.body.businessId;
    const { rating, comment } = req.body;

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    // Check if user already reviewed this business
    const existingReview = await Review.findOne({
      business: businessId,
      user: req.user.id,
    });

    if (existingReview) {
      existingReview.rating = Number(rating);
      existingReview.comment = comment;
      await existingReview.save();

      const populatedReview = await Review.findById(existingReview._id).populate('user', 'name avatar role');

      return res.json({
        success: true,
        message: 'Your review has been updated successfully',
        data: populatedReview,
      });
    }

    const review = await Review.create({
      user: req.user.id,
      business: businessId,
      rating: Number(rating),
      comment,
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'name avatar role');

    res.status(201).json({
      success: true,
      message: 'Review posted successfully',
      data: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Review owner or Admin)
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    const businessId = review.business;
    await review.deleteOne();
    await Review.calculateAverageRating(businessId);

    res.json({
      success: true,
      message: 'Review removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBusinessReviews,
  createReview,
  deleteReview,
};
