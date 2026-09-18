const express = require('express');
const router = express.Router();
const {
  getOffers,
  getOfferById,
  getMyOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  toggleSaveOffer,
  getSavedOffers,
  adminGetAllOffers,
} = require('../controllers/offerController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getOffers);
router.get('/my/all', protect, authorize('business'), getMyOffers);
router.post('/', protect, authorize('business'), createOffer);
router.get('/customer/saved', protect, getSavedOffers);
router.post('/:id/save', protect, toggleSaveOffer);
router.get('/admin/all', protect, authorize('admin'), adminGetAllOffers);
router.get('/:id', getOfferById);
router.put('/:id', protect, authorize('business', 'admin'), updateOffer);
router.delete('/:id', protect, authorize('business', 'admin'), deleteOffer);

module.exports = router;
