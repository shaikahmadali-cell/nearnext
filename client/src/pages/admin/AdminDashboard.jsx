import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Spinner } from '../../components/Loading';
import {
  ShieldAlert,
  Users,
  Store,
  Tag,
  MessageSquare,
  Eye,
  Heart,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
} from 'lucide-react';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/analytics/admin');
        if (res.data.success) {
          setAnalytics(res.data.data);
        }
      } catch (err) {
        console.error('Error loading admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) return <Spinner text="Loading Admin Control Console..." />;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 6rem' }}>
      
      {/* Header */}
      <div
        className="glass-panel"
        style={{
          padding: '2.5rem',
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(79, 70, 229, 0.2) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>Super Administrator</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            System Administration Console
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Platform health, merchant verifications, active promotion moderation, and user governance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/businesses" className="btn btn-primary">
            <Store size={16} /> Manage Businesses
          </Link>
          <Link to="/admin/users" className="btn btn-secondary">
            <Users size={16} /> Manage Users
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid-cols-4" style={{ marginBottom: '3rem' }}>
        <div className="stat-card">
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Accounts</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>{analytics?.totalUsers || 0}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
              {analytics?.customerCount} customers • {analytics?.businessUserCount} merchants
            </div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(79, 70, 229, 0.15)', color: '#818cf8' }}>
            <Users size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Businesses</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>{analytics?.totalBusinesses || 0}</div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.2rem' }}>
              {analytics?.approvedBusinesses} approved
            </div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
            <Store size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Promotions</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>{analytics?.activeOffers || 0}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
              {analytics?.totalOffers} total created
            </div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Tag size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Enquiries</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>{analytics?.totalEnquiries || 0}</div>
            <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '0.2rem' }}>
              {analytics?.totalViews || 0} deal views
            </div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <MessageSquare size={24} />
          </div>
        </div>
      </div>

      {/* Admin Modules Hub */}
      <div className="grid-cols-4" style={{ marginBottom: '3.5rem' }}>
        <Link
          to="/admin/users"
          className="glass-panel"
          style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          <Users size={28} color="#818cf8" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>User Management</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Review registered customers, assign business roles, and manage permissions.
          </p>
          <div style={{ color: '#818cf8', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: 'auto' }}>
            Open Users <ArrowRight size={14} />
          </div>
        </Link>

        <Link
          to="/admin/businesses"
          className="glass-panel"
          style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          <Store size={28} color="#06b6d4" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Business Directory</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Verify local merchant registrations, review addresses, and grant badges.
          </p>
          <div style={{ color: '#06b6d4', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: 'auto' }}>
            Open Directory <ArrowRight size={14} />
          </div>
        </Link>

        <Link
          to="/admin/offers"
          className="glass-panel"
          style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          <Tag size={28} color="#10b981" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Offer Moderation</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Moderate deals, remove spam promotions, and edit invalid discount terms.
          </p>
          <div style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: 'auto' }}>
            Open Deals <ArrowRight size={14} />
          </div>
        </Link>

        <Link
          to="/admin/reports"
          className="glass-panel"
          style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          <FileText size={28} color="#f59e0b" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Platform Reports</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Category distribution, city metrics, and comprehensive health digests.
          </p>
          <div style={{ color: '#f59e0b', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: 'auto' }}>
            Open Reports <ArrowRight size={14} />
          </div>
        </Link>
      </div>

      {/* Category Breakdown Table */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          Industry Category Distribution
        </h2>
        {analytics?.categoriesAggregate && analytics.categoriesAggregate.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Registered Merchants</th>
                  <th>Share of Platform</th>
                </tr>
              </thead>
              <tbody>
                {analytics.categoriesAggregate.map((cat, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700, color: '#fff' }}>{cat._id || 'Uncategorized'}</td>
                    <td>{cat.count} businesses</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '120px', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${(cat.count / (analytics.totalBusinesses || 1)) * 100}%`, height: '100%', background: '#818cf8' }} />
                        </div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {(((cat.count / (analytics.totalBusinesses || 1)) * 100) || 0).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>No category data yet.</p>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;
