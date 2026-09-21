const express = require('express');
const router = express.Router();
const { reverseGeocode, detectIpLocation } = require('../controllers/locationController');

// @route   GET /api/location/reverse-geocode
// @desc    Reverse geocode latitude and longitude to city/state/postalCode
// @access  Public
router.get('/reverse-geocode', reverseGeocode);

// @route   GET /api/location/ip
// @desc    Detect user location by IP
// @access  Public
router.get('/ip', detectIpLocation);

module.exports = router;
