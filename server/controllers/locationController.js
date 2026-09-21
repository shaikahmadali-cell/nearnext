const https = require('https');

// Helper to fetch JSON from URL with proper headers
const fetchJson = (url) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'NearNest-App/1.0 (contact@nearnest.local)',
        'Accept': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Failed to parse geocoding response'));
          }
        } else {
          reject(new Error(`Geocoding service returned status ${res.statusCode}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Reverse geocoding timed out'));
    });
    req.end();
  });
};

// @desc    Reverse geocode real GPS coordinates to City, State, ZIP
// @route   GET /api/location/reverse-geocode
// @access  Public
const reverseGeocode = async (req, res, next) => {
  try {
    const { lat, lng, latitude, longitude } = req.query;
    const finalLat = parseFloat(lat || latitude);
    const finalLng = parseFloat(lng || longitude);

    if (isNaN(finalLat) || isNaN(finalLng) || finalLat < -90 || finalLat > 90 || finalLng < -180 || finalLng > 180) {
      return res.status(400).json({
        success: false,
        message: 'Valid GPS coordinates required. Latitude (-90 to 90), Longitude (-180 to 180).',
      });
    }

    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${finalLat}&lon=${finalLng}`;
    const data = await fetchJson(nominatimUrl);

    const address = data.address || {};
    const city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.county ||
      address.state_district ||
      address.suburb ||
      '';
    const state = address.state || address.region || '';
    const postcode = address.postcode || address.postal_code || '';
    const country = address.country || '';

    let displayName = '';
    if (city && state) {
      displayName = `${city}, ${state}`;
    } else if (city) {
      displayName = city;
    } else if (state && postcode) {
      displayName = `${postcode}, ${state}`;
    } else if (postcode) {
      displayName = postcode;
    } else if (state) {
      displayName = state;
    } else {
      displayName = `${finalLat.toFixed(4)}, ${finalLng.toFixed(4)}`;
    }

    res.json({
      success: true,
      data: {
        city,
        state,
        postcode,
        country,
        displayName,
        latitude: finalLat,
        longitude: finalLng,
        rawAddress: address,
      },
    });
  } catch (error) {
    console.error('Reverse geocode error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Unable to reverse geocode GPS location.',
      error: error.message,
    });
  }
};

module.exports = {
  reverseGeocode,
};
