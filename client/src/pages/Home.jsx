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
    { name: 'Dining & Cafes', count: '45+ Deals', icon: '🍕', color: '#f97316' },
    { name: 'Beauty & Spa', count: '28+ Deals', icon: '✨', color: '#ec4899' },
    { name: 'Fitness & Sports', count: '19+ Deals', icon: '⚡', color: '#10b981' },
    { name: 'Retail & Shopping', count: '52+ Deals', icon: '🛍️', color: '#8b5cf6' },
    { name: 'Automotive & Repairs', count: '14+ Deals', icon: '🚗', color: '#06b6d4' },
    { name: 'Entertainment & Events', count: '23+ Deals', icon: '🎉', color: '#eab308' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '5rem' }}>
      
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '5rem 0 3rem',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 20%, rgba(79, 70, 229, 0.15) 0%, rgba(11, 15, 25, 0) 70%)',
      }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
          
          {/* Tagline Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(79, 70, 229, 0.15)',
            border: '1px solid rgba(79, 70, 229, 0.3)',
            borderRadius: 'var(--radius-full)',
            padding: '0.4rem 1rem',
            marginBottom: '1.5rem',
            color: '#a5b4fc',
            fontSize: '0.88rem',
            fontWeight: 600,
          }}>
            <Sparkles size={16} color="#818cf8" />
            <span>Discover Top Neighborhood Deals & Save Up To 70%</span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-1px',
            marginBottom: '1.25rem',
          }}>
            Support Local. Save Big. <br />
            <span className="gradient-text">Promote Your Favorite Spots.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-muted)',
            maxWidth: '680px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6,
          }}>
            Connect with vetted local restaurants, boutiques, salons, and services offering verified coupon codes and direct booking enquiries.
          </p>

          {/* Dual Search Bar */}
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Micro Stats Counter */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2.5rem',
            marginTop: '3.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          }}>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>500+</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Local Businesses</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>$120K+</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Customer Savings</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#818cf8' }}>1,400+</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Verified Promotions</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b' }}>4.9 ★</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Average Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Browse Categories</span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Explore Local Industry Sectors</h2>
          </div>
          <Link to="/offers" style={{ color: '#818cf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.95rem' }}>
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
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
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
                fontSize: '2rem',
                width: '54px',
                height: '54px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {c.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
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
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f43f5e', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Flame size={16} /> Hot Discounts Right Now
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.35rem' }}>
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
      <section style={{ background: 'rgba(19, 27, 46, 0.4)', padding: '4rem 0', borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Verified Partners</span>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Top Rated Local Businesses</h2>
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
            padding: '3.5rem 2.5rem',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)',
            border: '1px solid rgba(79, 70, 229, 0.35)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
          }}
        >
          <div>
            <span className="badge badge-warning" style={{ marginBottom: '1rem' }}>Are You a Business Owner?</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
              Promote Your Business & Reach Thousands of Nearby Customers
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Create instant flash discounts, manage customer enquiries in one inbox, and track real-time footfall conversions with precision analytics.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg">
                <Store size={18} /> Register Your Business
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Merchant Sign In
              </Link>
            </div>
          </div>

          {/* Feature list box */}
          <div style={{ background: 'rgba(11, 15, 25, 0.6)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: '#fff' }}>
              Why Local Businesses Choose NearNest:
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-muted)' }}>
                <CheckCircle size={18} color="#10b981" /> No setup fees or hidden middleman cuts
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-muted)' }}>
                <CheckCircle size={18} color="#10b981" /> Instant coupon redemption & click analytics
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-muted)' }}>
                <CheckCircle size={18} color="#10b981" /> Direct customer lead messaging portal
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-muted)' }}>
                <CheckCircle size={18} color="#10b981" /> Hyper-targeted neighborhood search rankings
              </li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
