const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getBusinessReviews,
  createReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getBusinessReviews)
  .post(protect, createReview);

router
  .route('/:id')
  .delete(protect, deleteReview);

module.exports = router;
