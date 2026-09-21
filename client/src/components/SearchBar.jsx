import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ArrowRight, Loader2, AlertCircle, Navigation } from 'lucide-react';
import api from '../utils/api';

const SearchBar = ({
  onSearch,
  initialQuery = '',
  initialLocation = '',
  placeholder = 'Search restaurants, spas, gyms, discounts...',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [isDetecting, setIsDetecting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Sync initial query prop changes
  useEffect(() => {
    if (initialQuery !== undefined) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  // Restore saved location from localStorage on mount (DO NOT request GPS on load)
  useEffect(() => {
    if (initialLocation) {
      setLocation(initialLocation);
    } else {
      try {
        const savedLoc = localStorage.getItem('nearnest-location');
        if (savedLoc) {
          const parsed = JSON.parse(savedLoc);
          const locText = parsed.displayName || parsed.city || parsed.postcode || parsed.postalCode || '';
          if (locText) {
            setLocation(locText);
          }
        }
      } catch (err) {
        console.error('Error reading saved location:', err);
      }
    }
  }, [initialLocation]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Temporary status message dismissal
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  // Reverse geocode REAL coordinates via Nominatim and Backend
  const reverseGeocodeRealCoords = async (latitude, longitude) => {
    console.log("Reverse geocoding location...");
    let data = null;
    let city = '';
    let state = '';
    let postcode = '';
    let country = '';
    let formattedText = '';

    // 1. Try direct OpenStreetMap Nominatim request with real coordinates
    try {
      const nomRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
        { headers: { Accept: 'application/json' } }
      );
      if (nomRes.ok) {
        data = await nomRes.json();
        console.log("Detected address:", data);
        const address = data.address || {};
        city =
          address.city ||
          address.town ||
          address.village ||
          address.municipality ||
          address.county ||
          address.state_district ||
          address.suburb ||
          '';
        state = address.state || address.region || '';
        postcode = address.postcode || address.postal_code || '';
        country = address.country || '';
      }
    } catch (nomErr) {
      console.warn('Nominatim direct request failed:', nomErr.message);
    }

    // 2. Fallback to backend reverse geocode if Nominatim direct call failed
    if (!city && !state) {
      try {
        const res = await api.get(`/location/reverse-geocode?lat=${latitude}&lng=${longitude}`);
        if (res.data?.success && res.data?.data) {
          const locData = res.data.data;
          city = locData.city || '';
          state = locData.state || '';
          postcode = locData.postcode || '';
          country = locData.country || '';
          formattedText = locData.displayName || '';
        }
      } catch (backendErr) {
        console.warn('Backend reverse-geocode failed:', backendErr.message);
      }
    }

    // Format display string
    if (!formattedText) {
      if (city && state) {
        formattedText = `${city}, ${state}`;
      } else if (city) {
        formattedText = city;
      } else if (state && postcode) {
        formattedText = `${postcode}, ${state}`;
      } else if (postcode) {
        formattedText = postcode;
      } else if (state) {
        formattedText = state;
      } else {
        formattedText = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      }
    }

    const locPayload = {
      city,
      state,
      postcode,
      country,
      latitude,
      longitude,
      displayName: formattedText,
    };

    return { formattedText, locPayload };
  };

  // Trigger real browser GPS location
  const handleUseCurrentLocation = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();

    setShowDropdown(false);

    if (!navigator.geolocation) {
      setIsError(true);
      setStatusMessage('Geolocation is not supported by your browser. Please enter your city/ZIP manually.');
      return;
    }

    // Check permissions API if supported
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
        if (permissionStatus.state === 'denied') {
          setIsError(true);
          setStatusMessage('Location permission is blocked. Please enable location permission in your browser settings or enter your city/ZIP manually.');
          return;
        }
      } catch (permErr) {
        // Proceed to getCurrentPosition
      }
    }

    setIsDetecting(true);
    setStatusMessage('');
    setIsError(false);

    console.log("Requesting browser location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log("GPS latitude:", latitude);
        console.log("GPS longitude:", longitude);

        try {
          const { formattedText, locPayload } = await reverseGeocodeRealCoords(latitude, longitude);

          setLocation(formattedText);
          setIsError(false);
          setStatusMessage('');

          // Save selected location to localStorage
          try {
            localStorage.setItem(
              'nearnest-location',
              JSON.stringify({
                city: locPayload.city || formattedText,
                state: locPayload.state || '',
                postcode: locPayload.postcode || '',
                latitude,
                longitude,
                displayName: formattedText,
              })
            );
          } catch (storageErr) {
            console.error('LocalStorage save error:', storageErr);
          }
        } catch (err) {
          console.error('Reverse geocoding error:', err);
          setIsError(true);
          setStatusMessage('Your location could not be determined. Please try again.');
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        setIsDetecting(false);
        setIsError(true);
        console.warn('Geolocation error code:', error.code, error.message);

        if (error.code === 1) {
          setStatusMessage('Location permission denied. Please allow location access to find your current location.');
        } else if (error.code === 2) {
          setStatusMessage('Your location could not be determined. Please try again.');
        } else if (error.code === 3) {
          setStatusMessage('Location request timed out. Please try again.');
        } else {
          setStatusMessage('Your location could not be determined. Please try again.');
        }

        if (inputRef.current) {
          inputRef.current.focus();
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleLocationChange = (e) => {
    const val = e.target.value;
    setLocation(val);
    setStatusMessage('');
    setIsError(false);

    // Save manual entry to localStorage
    try {
      localStorage.setItem(
        'nearnest-location',
        JSON.stringify({
          city: val,
          displayName: val,
        })
      );
    } catch (err) {
      console.error('LocalStorage error:', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowDropdown(false);
    if (onSearch) {
      onSearch({ query, location });
    }
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%', maxWidth: '100%' }}>
      <form
        onSubmit={handleSubmit}
        className="search-bar-form"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          background: 'rgba(19, 27, 46, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 'var(--radius-lg)',
          padding: '0.5rem',
          boxShadow: 'var(--shadow-lg)',
          gap: '0.5rem',
          width: '100%',
          maxWidth: '100%',
        }}
      >
        {/* Keyword input */}
        <div
          className="search-input-group"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flex: '2 1 200px',
            padding: '0.5rem 0.85rem',
            minWidth: 0,
          }}
        >
          <Search size={20} color="#0ea5e9" style={{ flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            aria-label="Search restaurants, spas, gyms, discounts..."
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              fontSize: '0.95rem',
              width: '100%',
              outline: 'none',
              minWidth: 0,
            }}
          />
        </div>

        {/* Divider */}
        <div
          style={{ width: '1px', height: '32px', background: 'rgba(255, 255, 255, 0.1)', display: 'none' }}
          className="search-divider"
        />

        {/* Location input group */}
        <div
          className="search-input-group location-input-group"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flex: '1 1 180px',
            padding: '0.5rem 0.85rem',
            minWidth: 0,
            position: 'relative',
          }}
        >
          {/* Location Trigger Pin Button */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isDetecting}
            aria-label="Use current location"
            title="Click to detect current GPS location"
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isDetecting ? 'wait' : 'pointer',
              outline: 'none',
              color: '#0ea5e9',
              flexShrink: 0,
              transition: 'transform var(--transition-fast)',
            }}
          >
            {isDetecting ? (
              <Loader2 size={20} color="#0ea5e9" className="location-spinner" style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <MapPin size={20} color="#0ea5e9" className="location-pin-icon" />
            )}
          </button>

          <input
            ref={inputRef}
            type="text"
            value={isDetecting ? 'Detecting your location...' : location}
            onChange={handleLocationChange}
            onFocus={() => {
              if (!isDetecting) setShowDropdown(true);
            }}
            onClick={() => {
              if (!isDetecting) setShowDropdown(true);
            }}
            placeholder={isDetecting ? 'Detecting your location...' : 'City or Zip'}
            aria-label="City or Zip"
            disabled={isDetecting}
            style={{
              background: 'transparent',
              border: 'none',
              color: isDetecting ? '#38bdf8' : 'var(--text-main)',
              fontSize: '0.95rem',
              width: '100%',
              outline: 'none',
              minWidth: 0,
              fontStyle: isDetecting ? 'italic' : 'normal',
            }}
          />
        </div>

        {/* Search Action Button */}
        <button
          type="submit"
          className="btn btn-primary search-submit-btn"
          style={{
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1.6rem',
            fontSize: '0.95rem',
            marginLeft: 'auto',
          }}
        >
          <span>Search Deals</span>
          <ArrowRight size={16} />
        </button>
      </form>

      {/* "Use Current Location" Dropdown Action */}
      {showDropdown && !isDetecting && (
        <div
          className="location-dropdown-panel"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            width: '100%',
            maxWidth: '340px',
            background: 'rgba(19, 27, 46, 0.96)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(14, 165, 233, 0.3)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
            padding: '0.4rem',
            zIndex: 100,
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.75rem 1rem',
              background: 'rgba(14, 165, 233, 0.08)',
              border: '1px solid rgba(14, 165, 233, 0.2)',
              borderRadius: 'var(--radius-sm)',
              color: '#38bdf8',
              fontSize: '0.92rem',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background var(--transition-fast), border-color var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(14, 165, 233, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(14, 165, 233, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.2)';
            }}
          >
            <Navigation size={18} color="#0ea5e9" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ color: '#ffffff', fontWeight: 600 }}>Use Current Location</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 400, marginTop: '2px' }}>
                Detect exact neighborhood via GPS
              </div>
            </div>
          </button>
        </div>
      )}

      {/* User-friendly status / error message */}
      {statusMessage && (
        <div
          role="status"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.5rem',
            padding: '0.4rem 0.9rem',
            borderRadius: 'var(--radius-sm)',
            background: isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(14, 165, 233, 0.15)',
            border: `1px solid ${isError ? 'rgba(239, 68, 68, 0.3)' : 'rgba(14, 165, 233, 0.3)'}`,
            color: isError ? '#fca5a5' : '#38bdf8',
            fontSize: '0.85rem',
            textAlign: 'left',
            animation: 'fadeIn 0.2s ease-in',
          }}
        >
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          <span>{statusMessage}</span>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .location-pin-icon:hover {
          transform: scale(1.18);
        }
        @media (min-width: 640px) {
          .search-divider { display: block !important; }
        }
        @media (max-width: 639px) {
          .search-submit-btn {
            width: 100% !important;
            margin-left: 0 !important;
            margin-top: 0.25rem !important;
          }
          .search-input-group {
            flex: 1 1 100% !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          }
          .location-dropdown-panel {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
