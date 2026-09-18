import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Phone, CheckCircle2, Tag, ArrowRight } from 'lucide-react';

const BusinessCard = ({ business }) => {
  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base)',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.4)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-glass)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Cover Image */}
      <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
        <img
          src={business.coverImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600'}
          alt={business.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(19, 27, 46, 0.9) 0%, transparent 60%)',
        }} />

        {/* Category Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'rgba(11, 15, 25, 0.8)',
          backdropFilter: 'blur(6px)',
          color: '#38bdf8',
          padding: '0.25rem 0.65rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.75rem',
          fontWeight: 700,
          border: '1px solid rgba(56, 189, 248, 0.3)',
        }}>
          {business.category}
        </div>

        {/* Logo Avatar Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '-15px',
          right: '16px',
          width: '54px',
          height: '54px',
          borderRadius: '12px',
          border: '3px solid #131b2e',
          overflow: 'hidden',
          background: '#fff',
          boxShadow: 'var(--shadow-md)',
        }}>
          <img
            src={business.logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100'}
            alt={business.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.5rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        {/* Name & Verification */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            <Link to={`/businesses/${business._id}`} style={{ color: 'inherit' }}>
              {business.name}
            </Link>
          </h3>
          {business.isVerified && (
            <CheckCircle2 size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
          )}
        </div>

        {/* Rating & Reviews */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontWeight: 700 }}>
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            {business.rating ? business.rating.toFixed(1) : '4.8'}
          </div>
          <span style={{ color: 'var(--text-subtle)' }}>•</span>
          <span style={{ color: 'var(--text-muted)' }}>{business.numReviews || 12} reviews</span>
        </div>

        {/* Description */}
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          lineHeight: 1.5,
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1,
        }}>
          {business.description}
        </p>

        {/* Address & City */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
          <MapPin size={14} color="#f43f5e" style={{ flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {business.address}, {business.city}
          </span>
        </div>

        {/* Footer Link */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          marginTop: 'auto',
        }}>
          <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Tag size={13} /> Active Deals
          </span>
          <Link
            to={`/businesses/${business._id}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#818cf8',
            }}
          >
            Visit Profile <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
