import React, { useState } from 'react';
import { Search, MapPin, ArrowRight } from 'lucide-react';

const SearchBar = ({ onSearch, initialQuery = '', initialLocation = '', placeholder = 'Search restaurants, spas, gyms, discounts...' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ query, location });
    }
  };

  return (
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
      <div style={{ width: '1px', height: '32px', background: 'rgba(255, 255, 255, 0.1)', display: 'none' }} className="search-divider" />

      {/* Location input */}
      <div
        className="search-input-group"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flex: '1 1 150px',
          padding: '0.5rem 0.85rem',
          minWidth: 0,
        }}
      >
        <MapPin size={20} color="#f43f5e" style={{ flexShrink: 0 }} />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City or Zip"
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

      <style>{`
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
    </form>
  );
};

export default SearchBar;
