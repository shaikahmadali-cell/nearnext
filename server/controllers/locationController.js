const https = require('https');

// Helper to fetch JSON from URL
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
    req.setTimeout(8000, () => {
      req.destroy();
      reject(new Error('Reverse geocoding timed out'));
    });
    req.end();
  });
};

// @desc    Reverse geocode coordinates to City, State, ZIP
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
        message: 'Invalid coordinates provided. Latitude must be between -90 and 90, Longitude between -180 and 180.',
      });
    }

    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${finalLat}&lon=${finalLng}`;
    const data = await fetchJson(nominatimUrl);

    const addr = data.address || {};
    const city =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.suburb ||
      addr.municipality ||
      addr.county ||
      addr.state_district ||
      '';
    const state = addr.state || addr.region || '';
    const postalCode = addr.postcode || '';
    const country = addr.country || '';

    let displayName = '';
    if (city && state) {
      displayName = `${city}, ${state}`;
    } else if (city) {
      displayName = city;
    } else if (state && postalCode) {
      displayName = `${postalCode}, ${state}`;
    } else if (postalCode) {
      displayName = postalCode;
    } else if (data.name) {
      displayName = data.name;
    } else {
      displayName = `${finalLat.toFixed(4)}, ${finalLng.toFixed(4)}`;
    }

    res.json({
      success: true,
      data: {
        city,
        state,
        postalCode,
        country,
        displayName,
        latitude: finalLat,
        longitude: finalLng,
        rawAddress: addr,
      },
    });
  } catch (error) {
    console.error('Reverse geocode error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Unable to reverse geocode location at this time.',
      error: error.message,
    });
  }
};

module.exports = {
  reverseGeocode,
};
