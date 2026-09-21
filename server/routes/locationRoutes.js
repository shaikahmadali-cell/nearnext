const express = require('express');
const router = express.Router();
const { reverseGeocode } = require('../controllers/locationController');

// @route   GET /api/location/reverse-geocode
// @desc    Reverse geocode real latitude and longitude to city/state/postcode
// @access  Public
router.get('/reverse-geocode', reverseGeocode);

module.exports = router;
