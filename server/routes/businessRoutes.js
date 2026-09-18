const express = require('express');
const router = express.Router();
const {
  getBusinesses,
  getBusinessById,
  getMyBusiness,
  createOrUpdateBusiness,
  adminGetAllBusinesses,
  updateBusinessStatus,
  deleteBusiness,
} = require('../controllers/businessController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Re-route into other resource routers
const reviewRouter = require('./reviewRoutes');
router.use('/:businessId/reviews', reviewRouter);

router.get('/', getBusinesses);
router.get('/my/profile', protect, authorize('business'), getMyBusiness);
router.post('/', protect, authorize('business'), createOrUpdateBusiness);
router.get('/admin/all', protect, authorize('admin'), adminGetAllBusinesses);
router.put('/:id/status', protect, authorize('admin'), updateBusinessStatus);
router.delete('/:id', protect, authorize('admin'), deleteBusiness);
router.get('/:id', getBusinessById);

module.exports = router;
