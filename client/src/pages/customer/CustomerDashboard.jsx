import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import offerService from '../../services/offerService';
import enquiryService from '../../services/enquiryService';
import OfferCard from '../../components/OfferCard';
import { Spinner } from '../../components/Loading';
import {
  Heart,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Clock,
  Compass,
  Tag,
  CheckCircle,
} from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [savedOffers, setSavedOffers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [savedRes, enquiriesRes] = await Promise.all([
          offerService.getSavedOffers(),
          enquiryService.getCustomerEnquiries(),
        ]);

        if (savedRes.success) setSavedOffers(savedRes.data);
        if (enquiriesRes.success) setEnquiries(enquiriesRes.data);
      } catch (err) {
        console.error('Error fetching customer dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Spinner text="Loading your customer portal..." />;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 6rem' }}>
      
      {/* Welcome Banner */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-primary">Customer Portal</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            Welcome back, {user?.name}! 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Manage your bookmarked neighborhood savings and track your merchant inquiries.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/offers" className="btn btn-primary">
            <Sparkles size={16} /> Explore New Deals
          </Link>
          <Link to="/businesses" className="btn btn-secondary">
            <Compass size={16} /> Directory
          </Link>
        </div>
      </div>

      {/* Quick Stat Cards */}
      <div className="grid-cols-3" style={{ marginBottom: '3rem' }}>
        <div className="stat-card">
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Saved Bookmarks</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>{savedOffers.length}</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>
            <Heart size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sent Enquiries</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>{enquiries.length}</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9' }}>
            <MessageSquare size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Merchant Replies</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>
              {enquiries.filter((e) => e.replies?.length > 0).length}
            </div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
        </div>
      </div>

      {/* Saved Offers Preview */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Saved Deals & Coupons</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Deals you bookmarked for later redemption</p>
          </div>
          <Link to="/customer/saved" style={{ color: '#0ea5e9', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            View All ({savedOffers.length}) <ArrowRight size={15} />
          </Link>
        </div>

        {savedOffers.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <Heart size={40} color="#f43f5e" style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>No saved promotions yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Click the heart icon on any deal to save it to your bookmarks for easy access.
            </p>
            <Link to="/offers" className="btn btn-secondary btn-sm">
              Browse Deals
            </Link>
          </div>
        ) : (
          <div className="grid-cols-3">
            {savedOffers.slice(0, 3).map((offer) => (
              <OfferCard key={offer._id} offer={offer} isBookmarked={true} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Enquiries Preview */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Recent Merchant Conversations</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Track questions sent to local store owners</p>
          </div>
          <Link to="/customer/enquiries" style={{ color: '#0ea5e9', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            View Inbox ({enquiries.length}) <ArrowRight size={15} />
          </Link>
        </div>

        {enquiries.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <MessageSquare size={40} color="#06b6d4" style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>No enquiries sent yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              You can message any business directly from their deal or store profile page.
            </p>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '1rem', overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Business</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Replies</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.slice(0, 4).map((enq) => (
                  <tr key={enq._id}>
                    <td style={{ fontWeight: 600, color: '#fff' }}>
                      {enq.business?.name || 'Local Store'}
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{enq.subject}</td>
                    <td>
                      <span className={`badge ${enq.status === 'resolved' ? 'badge-success' : enq.status === 'in_progress' ? 'badge-primary' : 'badge-warning'}`}>
                        {enq.status}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: enq.replies?.length > 0 ? '#10b981' : 'var(--text-subtle)' }}>
                        {enq.replies?.length || 0} response{enq.replies?.length === 1 ? '' : 's'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default CustomerDashboard;
