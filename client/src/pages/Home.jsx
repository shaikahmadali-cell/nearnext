import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import OfferCard from '../components/OfferCard';
import BusinessCard from '../components/BusinessCard';
import { Spinner } from '../components/Loading';
import offerService from '../services/offerService';
import businessService from '../services/businessService';
import {
  Sparkles,
  TrendingUp,
  Store,
  ShieldCheck,
  Tag,
  ArrowRight,
  Flame,
  Percent,
  CheckCircle,
  Users,
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [featuredOffers, setFeaturedOffers] = useState([]);
  const [topBusinesses, setTopBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [offersRes, businessRes] = await Promise.all([
          offerService.getOffers({ sort: 'popular' }),
          businessService.getBusinesses({ sort: 'rating' }),
        ]);

        if (offersRes.success) setFeaturedOffers(offersRes.data.slice(0, 6));
        if (businessRes.success) setTopBusinesses(businessRes.data.slice(0, 4));
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = ({ query, location }) => {
    navigate(`/offers?search=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`);
  };

  const categories = [
    { name: 'Dining & Cafes', count: '45+ Deals', icon: '🍕', color: '#0ea5e9' },
    { name: 'Beauty & Spa', count: '28+ Deals', icon: '✨', color: '#38bdf8' },
    { name: 'Fitness & Sports', count: '19+ Deals', icon: '⚡', color: '#0284c7' },
    { name: 'Retail & Shopping', count: '52+ Deals', icon: '🛍️', color: '#0ea5e9' },
    { name: 'Automotive & Repairs', count: '14+ Deals', icon: '🚗', color: '#38bdf8' },
    { name: 'Entertainment & Events', count: '23+ Deals', icon: '🎉', color: '#0284c7' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', paddingBottom: '5rem', width: '100%' }}>
      
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '3.5rem 0 2.5rem',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 20%, rgba(14, 165, 233, 0.12) 0%, transparent 70%)',
        width: '100%',
      }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
          
          {/* Tagline Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(14, 165, 233, 0.12)',
            border: '1px solid rgba(14, 165, 233, 0.3)',
            borderRadius: 'var(--radius-full)',
            padding: '0.4rem 1rem',
            marginBottom: '1.25rem',
            color: '#0ea5e9',
            fontSize: '0.85rem',
            fontWeight: 600,
            maxWidth: '100%',
            whiteSpace: 'normal',
          }}>
            <Sparkles size={16} color="#0ea5e9" style={{ flexShrink: 0 }} />
            <span>Discover Top Neighborhood Deals & Save Up To 70%</span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.18,
            letterSpacing: '-0.8px',
            marginBottom: '1.25rem',
          }}>
            Support Local. Save Big. <br />
            <span className="gradient-text">Promote Your Favorite Spots.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(0.95rem, 1.8vw, 1.2rem)',
            color: 'var(--text-muted)',
            maxWidth: '680px',
            margin: '0 auto 2rem',
            lineHeight: 1.6,
            padding: '0 0.5rem',
          }}>
            Connect with vetted local restaurants, boutiques, salons, and services offering verified coupon codes and direct booking enquiries.
          </p>

          {/* Dual Search Bar */}
          <div style={{ maxWidth: '820px', margin: '0 auto', width: '100%' }}>
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Micro Stats Counter */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.75rem 2.5rem',
            marginTop: '3rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-glass)',
          }}>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>500+</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Local Businesses</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0ea5e9' }}>$120K+</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Customer Savings</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8' }}>1,400+</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Verified Promotions</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0284c7' }}>4.9 ★</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Average Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Browse Categories</span>
            <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.85rem)', fontWeight: 800 }}>Explore Local Industry Sectors</h2>
          </div>
          <Link to="/offers" style={{ color: '#0ea5e9', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.95rem' }}>
            All Deals <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid-cols-3">
          {categories.map((c, i) => (
            <Link
              key={i}
              to={`/offers?category=${encodeURIComponent(c.name)}`}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'transform var(--transition-base), border-color var(--transition-base)',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-glass)';
              }}
            >
              <div style={{
                fontSize: '1.8rem',
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {c.icon}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c.name}
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{c.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Offers Grid */}
      <section className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f43f5e', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Flame size={16} /> Hot Discounts Right Now
            </div>
            <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.85rem)', fontWeight: 800, marginTop: '0.35rem' }}>
              Trending Exclusive Promotions
            </h2>
          </div>
          <Link to="/offers" className="btn btn-secondary btn-sm">
            View All Offers
          </Link>
        </div>

        {loading ? (
          <Spinner text="Loading hot deals..." />
        ) : (
          <div className="grid-cols-3">
            {featuredOffers.map((offer) => (
              <OfferCard key={offer._id} offer={offer} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Businesses Section */}
      <section style={{ background: 'var(--bg-secondary)', padding: '3.5rem 0', borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)', width: '100%' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Verified Partners</span>
              <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.85rem)', fontWeight: 800 }}>Top Rated Local Businesses</h2>
            </div>
            <Link to="/businesses" className="btn btn-secondary btn-sm">
              Explore All Businesses
            </Link>
          </div>

          <div className="grid-cols-4">
            {topBusinesses.map((b) => (
              <BusinessCard key={b._id} business={b} />
            ))}
          </div>
        </div>
      </section>

      {/* Merchant Promotion CTA Banner */}
      <section className="container">
        <div
          className="glass-panel"
          style={{
            padding: '2.5rem 2rem',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(56, 189, 248, 0.08) 100%)',
            border: '1px solid rgba(14, 165, 233, 0.3)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            alignItems: 'center',
          }}
        >
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Are You a Business Owner?</span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
              Promote Your Business & Reach Thousands of Nearby Customers
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Create instant flash discounts, manage customer enquiries in one inbox, and track real-time footfall conversions with precision analytics.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg">
                <Store size={18} /> Register Your Business
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Merchant Sign In
              </Link>
            </div>
          </div>

          {/* Feature list box */}
          <div style={{ background: 'var(--bg-card)', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
              Why Local Businesses Choose NearNest:
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.92rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-muted)' }}>
                <CheckCircle size={18} color="#0ea5e9" style={{ flexShrink: 0 }} /> No setup fees or hidden middleman cuts
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-muted)' }}>
                <CheckCircle size={18} color="#0ea5e9" style={{ flexShrink: 0 }} /> Instant coupon redemption & click analytics
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-muted)' }}>
                <CheckCircle size={18} color="#0ea5e9" style={{ flexShrink: 0 }} /> Direct customer lead messaging portal
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-muted)' }}>
                <CheckCircle size={18} color="#0ea5e9" style={{ flexShrink: 0 }} /> Hyper-targeted neighborhood search rankings
              </li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
