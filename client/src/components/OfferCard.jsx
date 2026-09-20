import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, Tag, Copy, Check, Eye, MapPin, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import offerService from '../services/offerService';

const OfferCard = ({ offer, onBookmarkToggle, isBookmarked = false }) => {
  const { isAuthenticated } = useAuth();
  const [saved, setSaved] = useState(isBookmarked);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please log in to save and bookmark offers!');
      return;
    }
    try {
      setSaving(true);
      const res = await offerService.toggleSaveOffer(offer._id);
      setSaved(res.saved);
      if (onBookmarkToggle) onBookmarkToggle(offer._id, res.saved);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyCode = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(offer.promoCode || 'DEAL2026');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format expiration days left
  const daysLeft = Math.ceil((new Date(offer.endDate) - new Date()) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft <= 0;

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base)',
        position: 'relative',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.4)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-glass)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Card Header & Banner Image */}
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
        <img
          src={offer.bannerImage || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600'}
          alt={offer.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(11, 15, 25, 0.95) 0%, transparent 60%)',
        }} />

        {/* Discount Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'linear-gradient(135deg, #ef4444 0%, #f43f5e 100%)',
          color: 'white',
          padding: '0.35rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          fontWeight: 800,
          fontSize: '0.8rem',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
          letterSpacing: '0.5px',
        }}>
          {offer.discountValue}
        </div>

        {/* Bookmark Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          aria-label="Save Offer"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(11, 15, 25, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform var(--transition-fast)',
          }}
        >
          <Heart
            size={18}
            color={saved ? '#f43f5e' : '#fff'}
            fill={saved ? '#f43f5e' : 'none'}
          />
        </button>

        {/* Category Pill */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          background: 'rgba(0, 0, 0, 0.6)',
          padding: '0.2rem 0.6rem',
          borderRadius: 'var(--radius-full)',
          backdropFilter: 'blur(4px)',
        }}>
          <Tag size={12} color="#0ea5e9" />
          {offer.category}
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        {/* Business Tag */}
        {offer.business && (
          <Link
            to={`/businesses/${offer.business._id || offer.business}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              marginBottom: '0.5rem',
              textDecoration: 'none',
            }}
          >
            <Store size={14} color="#0ea5e9" />
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
              {offer.business.name || 'Local Business'}
            </span>
            {offer.business.city && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                • {offer.business.city}
              </span>
            )}
          </Link>
        )}

        {/* Title */}
        <h3 style={{
          fontSize: '1.05rem',
          fontWeight: 700,
          marginBottom: '0.6rem',
          lineHeight: 1.35,
          color: 'var(--text-main)',
        }}>
          <Link to={`/offers/${offer._id}`} style={{ color: 'inherit' }}>
            {offer.title}
          </Link>
        </h3>

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
          {offer.description}
        </p>

        {/* Promo Code & Copy Action */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px dashed var(--border-glass-bright)',
          borderRadius: 'var(--radius-md)',
          padding: '0.4rem 0.75rem',
          marginBottom: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600 }}>CODE:</span>
            <span style={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '1px', color: '#0ea5e9' }}>
              {offer.promoCode || 'DEAL2026'}
            </span>
          </div>
          <button
            onClick={handleCopyCode}
            style={{
              background: 'none',
              border: 'none',
              color: copied ? '#10b981' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            {copied ? (
              <>
                <Check size={14} /> Copied
              </>
            ) : (
              <>
                <Copy size={14} /> Copy
              </>
            )}
          </button>
        </div>

        {/* Footer info: Expiration & CTA */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: '0.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: isExpired ? '#f87171' : 'var(--text-muted)' }}>
            <Clock size={13} />
            {isExpired ? 'Expired' : `${daysLeft} days left`}
          </div>

          <Link to={`/offers/${offer._id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}>
            View Deal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
