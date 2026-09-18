import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import offerService from '../../services/offerService';
import OfferCard from '../../components/OfferCard';
import { Spinner } from '../../components/Loading';
import { Heart, ArrowLeft } from 'lucide-react';

const SavedOffers = () => {
  const [savedOffers, setSavedOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      setLoading(true);
      const res = await offerService.getSavedOffers();
      if (res.success) {
        setSavedOffers(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleBookmarkToggle = (offerId, isSaved) => {
    if (!isSaved) {
      setSavedOffers((prev) => prev.filter((o) => o._id !== offerId));
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/customer/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.88rem' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Heart size={28} color="#f43f5e" fill="#f43f5e" /> My Saved Deals & Coupons
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage bookmarked deals and show coupon codes when visiting stores.
          </p>
        </div>

        <Link to="/offers" className="btn btn-primary btn-sm">
          Explore More Deals
        </Link>
      </div>

      {loading ? (
        <Spinner text="Loading your bookmarks..." />
      ) : savedOffers.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)' }}>
          <Heart size={48} color="#f43f5e" style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Saved Deals Found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
            Browse local offers and click the heart icon to save coupons for redemption.
          </p>
          <Link to="/offers" className="btn btn-secondary">
            Browse All Deals
          </Link>
        </div>
      ) : (
        <div className="grid-cols-3">
          {savedOffers.map((offer) => (
            <OfferCard
              key={offer._id}
              offer={offer}
              isBookmarked={true}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default SavedOffers;
