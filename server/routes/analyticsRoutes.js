const express = require('express');
const router = express.Router();
const {
  getBusinessAnalytics,
  getAdminAnalytics,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/business', protect, authorize('business'), getBusinessAnalytics);
router.get('/admin', protect, authorize('admin'), getAdminAnalytics);

module.exports = router;
