import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Heart, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: 'var(--bg-card)',
      borderTop: '1px solid var(--border-glass)',
      paddingTop: '3.5rem',
      paddingBottom: '2.5rem',
      marginTop: 'auto',
      width: '100%',
    }}>
      <div className="container">
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          
          {/* Col 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Store size={20} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                Near<span className="gradient-text">Nest</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Empowering local businesses with high-converting promotional tools, exclusive flash deals, and direct customer engagement.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge badge-primary" style={{ textTransform: 'none' }}>
                <Sparkles size={12} /> Hyperlocal Network
              </span>
            </div>
          </div>

          {/* Col 2: Discover */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
              Discover
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/offers" style={{ color: 'var(--text-muted)' }}>Trending Deals</Link>
              </li>
              <li>
                <Link to="/businesses" style={{ color: 'var(--text-muted)' }}>Local Business Directory</Link>
              </li>
              <li>
                <Link to="/offers?category=Dining%20%26%20Cafes" style={{ color: 'var(--text-muted)' }}>Restaurants & Cafes</Link>
              </li>
              <li>
                <Link to="/offers?category=Beauty%20%26%20Spa" style={{ color: 'var(--text-muted)' }}>Spa & Wellness</Link>
              </li>
              <li>
                <Link to="/offers?category=Fitness%20%26%20Sports" style={{ color: 'var(--text-muted)' }}>Gyms & Fitness</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Business Owners */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
              For Business Owners
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/register" style={{ color: 'var(--text-muted)' }}>Register Your Business</Link>
              </li>
              <li>
                <Link to="/login" style={{ color: 'var(--text-muted)' }}>Merchant Portal</Link>
              </li>
              <li>
                <Link to="/business/create-offer" style={{ color: 'var(--text-muted)' }}>Publish Promotions</Link>
              </li>
              <li>
                <Link to="/business/analytics" style={{ color: 'var(--text-muted)' }}>Growth Analytics</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter / Contact */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
              Stay Updated
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
              Get weekly curated deals from top-rated shops in your neighborhood.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input
                type="email"
                placeholder="Enter your email"
                className="form-input"
                style={{ fontSize: '0.85rem', padding: '0.6rem 0.85rem', flex: '1 1 160px', minWidth: 0 }}
              />
              <button className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>Join</button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-glass)',
          paddingTop: '1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'var(--text-subtle)',
        }}>
          <p>© {new Date().getFullYear()} NearNest Inc. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built with <Heart size={14} color="#f43f5e" fill="#f43f5e" /> for local community commerce
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
