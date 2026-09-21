const express = require('express');
const router = express.Router();
const {
  getPublicStats,
  getBusinessAnalytics,
  getAdminAnalytics,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public platform statistics for homepage
router.get('/public-stats', getPublicStats);
router.get('/stats', getPublicStats);

// Protected analytics
router.get('/business', protect, authorize('business'), getBusinessAnalytics);
router.get('/admin', protect, authorize('admin'), getAdminAnalytics);

module.exports = router;
