import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import businessService from '../../services/businessService';
import { Spinner } from '../../components/Loading';
import {
  Store,
  Tag,
  PlusCircle,
  Eye,
  Heart,
  MessageSquare,
  TrendingUp,
  BarChart2,
  ArrowRight,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Layers,
} from 'lucide-react';

const BusinessDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        setLoading(true);
        const [bizRes, analyticsRes] = await Promise.all([
          businessService.getMyBusiness(),
          api.get('/analytics/business'),
        ]);

        if (bizRes.success) setBusiness(bizRes.data);
        if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);
      } catch (err) {
        console.error('Business dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);

  if (loading) return <Spinner text="Loading your merchant hub..." />;

  const hasBusiness = !!business;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 6rem' }}>
      
      {/* Setup Profile Alert if not done */}
      {!hasBusiness && (
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
            marginBottom: '2rem',
            border: '2px dashed #f59e0b',
            background: 'rgba(245, 158, 11, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <AlertCircle size={32} color="#f59e0b" />
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Complete Your Business Profile</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                You must setup your business address, category, and hours before publishing promotions.
              </p>
            </div>
          </div>
          <Link to="/business/profile" className="btn btn-primary">
            Setup Profile Now <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2.5rem',
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(56, 189, 248, 0.08) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge badge-primary">Merchant Hub</span>
            {business && (
              <>
                {business.status === 'pending' && (
                  <span className="badge badge-warning">⏳ Pending Admin Approval (Requesting)</span>
                )}
                {business.status === 'approved' && (
                  <span className="badge badge-success">✓ Approved & Live</span>
                )}
                {business.status === 'rejected' && (
                  <span className="badge badge-danger">✕ Rejected by Admin</span>
                )}
              </>
            )}
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            {business ? business.name : `Welcome, ${user?.name}`}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {business ? `${business.category} • ${business.city}` : 'Grow your local customer base with active promotions'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/business/create-offer" className="btn btn-primary">
            <PlusCircle size={16} /> Create Promotion
          </Link>
          <Link to="/business/profile" className="btn btn-secondary">
            <Store size={16} /> Edit Store Info
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid-cols-4" style={{ marginBottom: '3rem' }}>
        <div className="stat-card">
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Offers</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>{analytics?.activeOffers || 0}</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9' }}>
            <Tag size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Views</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>{analytics?.totalViews || 0}</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            <Eye size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Bookmarks</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>{analytics?.totalSaves || 0}</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>
            <Heart size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Customer Leads</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>{analytics?.totalEnquiries || 0}</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <MessageSquare size={24} />
          </div>
        </div>
      </div>

      {/* Quick Access Menu Cards */}
      <div className="grid-cols-3" style={{ marginBottom: '3.5rem' }}>
        <Link
          to="/business/create-offer"
          className="glass-panel"
          style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            transition: 'transform var(--transition-base), border-color var(--transition-base)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.5)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-glass)')}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(14, 165, 233, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
            <PlusCircle size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.35rem' }}>Publish New Promotion</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Launch discounts, coupons, BOGO deals, or flash sale campaigns.
            </p>
          </div>
          <div style={{ color: '#0ea5e9', fontWeight: 600, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: 'auto' }}>
            Create Campaign <ArrowRight size={14} />
          </div>
        </Link>

        <Link
          to="/business/my-offers"
          className="glass-panel"
          style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            transition: 'transform var(--transition-base), border-color var(--transition-base)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.5)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-glass)')}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4' }}>
            <Layers size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.35rem' }}>Manage Active Offers</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Edit dates, update discount rates, or deactivate existing promotions.
            </p>
          </div>
          <div style={{ color: '#06b6d4', fontWeight: 600, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: 'auto' }}>
            View Offers <ArrowRight size={14} />
          </div>
        </Link>

        <Link
          to="/business/enquiries"
          className="glass-panel"
          style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            transition: 'transform var(--transition-base), border-color var(--transition-base)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-glass)')}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
            <MessageSquare size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.35rem' }}>Customer Inquiries</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Answer customer booking requests and questions to close sales.
            </p>
          </div>
          <div style={{ color: '#10b981', fontWeight: 600, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: 'auto' }}>
            Open Lead Inbox <ArrowRight size={14} />
          </div>
        </Link>
      </div>

      {/* Top Performing Offers Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Top Performing Offers</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Deals generating highest engagement</p>
          </div>
          <Link to="/business/analytics" style={{ color: '#0ea5e9', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Detailed Analytics <BarChart2 size={16} />
          </Link>
        </div>

        {analytics?.topOffers && analytics.topOffers.length > 0 ? (
          <div className="glass-panel" style={{ padding: '1rem', overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Promotion Title</th>
                  <th>Discount</th>
                  <th>Promo Code</th>
                  <th>Views</th>
                  <th>Bookmarks</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topOffers.map((o) => (
                  <tr key={o._id}>
                    <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{o.title}</td>
                    <td>
                      <span className="badge badge-primary">{o.discountValue}</span>
                    </td>
                    <td style={{ color: '#0ea5e9', fontWeight: 800 }}>{o.promoCode}</td>
                    <td>{o.viewsCount || 0}</td>
                    <td>{o.savesCount || 0}</td>
                    <td>
                      <span className={`badge ${o.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)' }}>No performance metrics yet. Create an offer to start tracking leads.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default BusinessDashboard;
