import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
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
  const inputRef = useRef(null);

  // Sync initial query prop changes
  useEffect(() => {
    if (initialQuery !== undefined) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  // Restore saved location from localStorage on mount if initialLocation is empty
  useEffect(() => {
    if (initialLocation) {
      setLocation(initialLocation);
    } else {
      try {
        const savedLoc = localStorage.getItem('nearnest-location');
        if (savedLoc) {
          const parsed = JSON.parse(savedLoc);
          const locText = parsed.displayName || parsed.city || parsed.postalCode || '';
          if (locText) {
            setLocation(locText);
          }
        }
      } catch (err) {
        console.error('Error reading saved location:', err);
      }
    }
  }, [initialLocation]);

  // Temporary status message dismissal
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  // Reverse geocode coordinates using backend with client fallback
  const reverseGeocodeCoords = async (latitude, longitude) => {
    let locData = null;
    let formattedText = '';

    // Option A & B: Backend endpoint
    try {
      const res = await api.get(`/location/reverse-geocode?lat=${latitude}&lng=${longitude}`);
      if (res.data?.success && res.data?.data) {
        locData = res.data.data;
        formattedText = locData.displayName || (locData.city ? `${locData.city}${locData.state ? `, ${locData.state}` : ''}` : '');
      }
    } catch (backendErr) {
      console.warn('Backend reverse geocoding unavailable, falling back to direct service:', backendErr.message);
    }

    // Option C: OpenStreetMap Nominatim fallback
    if (!formattedText) {
      try {
        const nomRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
          { headers: { Accept: 'application/json' } }
        );
        if (nomRes.ok) {
          const data = await nomRes.json();
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

          if (city && state) {
            formattedText = `${city}, ${state}`;
          } else if (city) {
            formattedText = city;
          } else if (state && postalCode) {
            formattedText = `${postalCode}, ${state}`;
          } else if (postalCode) {
            formattedText = postalCode;
          } else if (data.name) {
            formattedText = data.name;
          } else {
            formattedText = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          }

          locData = {
            city,
            state,
            postalCode,
            country,
            displayName: formattedText,
            latitude,
            longitude,
          };
        }
      } catch (nomErr) {
        console.warn('Nominatim fallback failed:', nomErr.message);
      }
    }

    if (!formattedText) {
      formattedText = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      locData = { displayName: formattedText, latitude, longitude };
    }

    return { formattedText, locData };
  };

  // Trigger browser geolocation
  const handleDetectLocation = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!navigator.geolocation) {
      setIsError(true);
      setStatusMessage('Geolocation is not supported by your browser. Please enter your city or ZIP.');
      return;
    }

    setIsDetecting(true);
    setStatusMessage('');
    setIsError(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const { formattedText, locData } = await reverseGeocodeCoords(latitude, longitude);

          setLocation(formattedText);
          setIsError(false);
          setStatusMessage('');

          // Save to localStorage
          try {
            localStorage.setItem(
              'nearnest-location',
              JSON.stringify(
                locData || {
                  city: formattedText,
                  displayName: formattedText,
                  latitude,
                  longitude,
                }
              )
            );
          } catch (storageErr) {
            console.error('LocalStorage write error:', storageErr);
          }
        } catch (err) {
          console.error('Location detection error:', err);
          setIsError(true);
          setStatusMessage('Unable to detect your location. Please enter your city or ZIP.');
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        setIsDetecting(false);
        setIsError(true);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setStatusMessage('Location permission denied. Please enter your city or ZIP manually.');
            break;
          case error.POSITION_UNAVAILABLE:
            setStatusMessage('Unable to detect your location. Please enter your city or ZIP.');
            break;
          case error.TIMEOUT:
            setStatusMessage('Location detection timed out. Please try again.');
            break;
          default:
            setStatusMessage('Unable to detect your location. Please enter your city or ZIP.');
            break;
        }
        if (inputRef.current) {
          inputRef.current.focus();
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
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
    if (onSearch) {
      onSearch({ query, location });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '100%' }}>
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
            aria-label="Search keywords"
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
            cursor: 'pointer',
            position: 'relative',
          }}
          onClick={(e) => {
            // If clicking the group container or icon when not detecting, focus or trigger
            if (!location && !isDetecting && e.target.tagName !== 'INPUT') {
              handleDetectLocation(e);
            }
          }}
        >
          {/* Location Trigger Pin Button */}
          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={isDetecting}
            aria-label="Use current location"
            title="Click to use current GPS location"
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
            value={isDetecting ? 'Detecting location...' : location}
            onChange={handleLocationChange}
            placeholder={isDetecting ? 'Detecting location...' : 'City or Zip'}
            aria-label="City or Zip"
            disabled={isDetecting}
            style={{
              background: 'transparent',
              border: 'none',
              color: isDetecting ? 'var(--text-muted)' : 'var(--text-main)',
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

      {/* Non-intrusive status / error message */}
      {statusMessage && (
        <div
          role="status"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.5rem',
            padding: '0.35rem 0.85rem',
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
        @keyframes subtlePulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.7; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .location-pin-icon:hover {
          transform: scale(1.15);
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
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
