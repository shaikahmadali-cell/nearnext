const express = require('express');
const router = express.Router();
const {
  createEnquiry,
  getCustomerEnquiries,
  getBusinessEnquiries,
  replyEnquiry,
  updateEnquiryStatus,
} = require('../controllers/enquiryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, createEnquiry);
router.get('/customer', protect, getCustomerEnquiries);
router.get('/business', protect, authorize('business'), getBusinessEnquiries);
router.post('/:id/reply', protect, replyEnquiry);
router.put('/:id/status', protect, authorize('business', 'admin'), updateEnquiryStatus);

module.exports = router;
