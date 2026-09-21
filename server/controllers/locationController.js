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
            reject(new Error('Failed to parse response'));
          }
        } else {
          reject(new Error(`Service returned status ${res.statusCode}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.setTimeout(6000, () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
    req.end();
  });
};

// @desc    Detect user location by IP or reverse geocode coordinates
// @route   GET /api/location/reverse-geocode
// @access  Public
const reverseGeocode = async (req, res, next) => {
  try {
    const { lat, lng, latitude, longitude } = req.query;
    const finalLat = parseFloat(lat || latitude);
    const finalLng = parseFloat(lng || longitude);

    let city = '';
    let state = '';
    let postalCode = '';
    let country = '';
    let displayName = '';
    let resultLat = finalLat;
    let resultLng = finalLng;

    // 1. Try BigDataCloud reverse geocoding
    if (!isNaN(finalLat) && !isNaN(finalLng)) {
      try {
        const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${finalLat}&longitude=${finalLng}&localityLanguage=en`;
        const bdcData = await fetchJson(bdcUrl);
        if (bdcData) {
          city = bdcData.city || bdcData.locality || '';
          state = bdcData.principalSubdivision || '';
          country = bdcData.countryName || '';
          postalCode = bdcData.postcode || '';
          resultLat = bdcData.latitude || finalLat;
          resultLng = bdcData.longitude || finalLng;
        }
      } catch (bdcErr) {
        console.warn('BigDataCloud geocode failed, falling back to Nominatim:', bdcErr.message);
      }
    }

    // 2. Try Nominatim if city or postalCode not found
    if (!city || !postalCode) {
      try {
        const nominatimUrl = !isNaN(finalLat) && !isNaN(finalLng)
          ? `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${finalLat}&lon=${finalLng}`
          : `https://nominatim.openstreetmap.org/reverse?format=jsonv2`;
        
        if (!isNaN(finalLat) && !isNaN(finalLng)) {
          const nomData = await fetchJson(nominatimUrl);
          const addr = nomData.address || {};
          if (!city) {
            city =
              addr.city ||
              addr.town ||
              addr.village ||
              addr.municipality ||
              addr.suburb ||
              addr.county ||
              addr.state_district ||
              '';
          }
          if (!state) state = addr.state || addr.region || '';
          if (!postalCode) postalCode = addr.postcode || '';
          if (!country) country = addr.country || '';
        }
      } catch (nomErr) {
        console.warn('Nominatim geocode fallback failed:', nomErr.message);
      }
    }

    // 3. Fallback to IP geolocation if no coordinates provided or resolution was empty
    if (!city && !state) {
      try {
        const ipData = await fetchJson('https://api.bigdatacloud.net/data/reverse-geocode-client');
        if (ipData) {
          city = ipData.city || ipData.locality || '';
          state = ipData.principalSubdivision || '';
          country = ipData.countryName || '';
          postalCode = ipData.postcode || '';
          resultLat = ipData.latitude || resultLat;
          resultLng = ipData.longitude || resultLng;
        }
      } catch (ipErr) {
        console.warn('IP geocode fallback failed:', ipErr.message);
      }
    }

    // Format display name
    if (city && state) {
      displayName = `${city}, ${state}`;
    } else if (city) {
      displayName = city;
    } else if (state && postalCode) {
      displayName = `${postalCode}, ${state}`;
    } else if (postalCode) {
      displayName = postalCode;
    } else if (state) {
      displayName = state;
    } else if (!isNaN(resultLat) && !isNaN(resultLng)) {
      displayName = `${resultLat.toFixed(4)}, ${resultLng.toFixed(4)}`;
    } else {
      displayName = 'Current Location';
    }

    res.json({
      success: true,
      data: {
        city,
        state,
        postalCode,
        country,
        displayName,
        latitude: resultLat,
        longitude: resultLng,
      },
    });
  } catch (error) {
    console.error('Reverse geocode error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Unable to detect location at this time.',
      error: error.message,
    });
  }
};

// @desc    Detect user location by IP
// @route   GET /api/location/ip
// @access  Public
const detectIpLocation = async (req, res, next) => {
  try {
    const data = await fetchJson('https://api.bigdatacloud.net/data/reverse-geocode-client');
    const city = data.city || data.locality || '';
    const state = data.principalSubdivision || '';
    const country = data.countryName || '';
    const postalCode = data.postcode || '';
    const latitude = data.latitude;
    const longitude = data.longitude;

    let displayName = '';
    if (city && state) {
      displayName = `${city}, ${state}`;
    } else if (city) {
      displayName = city;
    } else if (state) {
      displayName = state;
    } else {
      displayName = 'Current Location';
    }

    res.json({
      success: true,
      data: {
        city,
        state,
        postalCode,
        country,
        displayName,
        latitude,
        longitude,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to detect IP location.',
      error: error.message,
    });
  }
};

module.exports = {
  reverseGeocode,
  detectIpLocation,
};
