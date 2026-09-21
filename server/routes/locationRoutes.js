const express = require('express');
const router = express.Router();
const { reverseGeocode } = require('../controllers/locationController');

// @route   GET /api/location/reverse-geocode
// @desc    Reverse geocode latitude and longitude to city/state/postalCode
// @access  Public
router.get('/reverse-geocode', reverseGeocode);

module.exports = router;
