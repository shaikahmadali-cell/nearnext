import React from 'react';
import { Filter as FilterIcon, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Dining & Cafes',
  'Health & Wellness',
  'Beauty & Spa',
  'Retail & Shopping',
  'Automotive & Repairs',
  'Fitness & Sports',
  'Entertainment & Events',
];

const Filter = ({ selectedCategory, onSelectCategory, selectedSort, onSelectSort, discountType, onSelectDiscountType }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
      
      {/* Category Pills Slider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        scrollbarWidth: 'none',
      }}>
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
                  : 'rgba(255, 255, 255, 0.05)',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                border: isActive ? '1px solid transparent' : '1px solid var(--border-glass)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)',
                boxShadow: isActive ? '0 4px 12px rgba(79, 70, 229, 0.35)' : 'none',
              }}
            >
              {cat === 'All' && <Sparkles size={13} style={{ display: 'inline', marginRight: '4px' }} />}
              {cat}
            </button>
          );
        })}
      </div>

      {/* Secondary Sort & Discount Type filters */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}>
        {/* Discount Type */}
        {onSelectDiscountType && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Discount:</span>
            <select
              value={discountType || 'All'}
              onChange={(e) => onSelectDiscountType(e.target.value)}
              className="form-select"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', width: 'auto' }}
            >
              <option value="All">All Types</option>
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat ($ Off)</option>
              <option value="bogo">Buy 1 Get 1 (BOGO)</option>
              <option value="special">Special Deals</option>
            </select>
          </div>
        )}

        {/* Sort */}
        {onSelectSort && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sort by:</span>
            <select
              value={selectedSort || 'newest'}
              onChange={(e) => onSelectSort(e.target.value)}
              className="form-select"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', width: 'auto' }}
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="expiring">Ending Soon</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter;
