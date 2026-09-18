import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Spinner } from '../../components/Loading';
import {
  BarChart2,
  ArrowLeft,
  Eye,
  Heart,
  MessageSquare,
  TrendingUp,
  Tag,
  Percent,
} from 'lucide-react';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/analytics/business');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Analytics load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <Spinner text="Calculating promotion metrics..." />;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <Link to="/business/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.88rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <BarChart2 size={28} color="#818cf8" /> Promotion & Campaign Analytics
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Real-time customer impressions, bookmark conversions, and lead inquiry velocity.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid-cols-4" style={{ marginBottom: '2.5rem' }}>
        <div className="stat-card">
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Views</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginTop: '0.25rem' }}>
              {data?.totalViews || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>Deal page impressions</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(79, 70, 229, 0.15)', color: '#818cf8' }}>
            <Eye size={26} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Saves</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginTop: '0.25rem' }}>
              {data?.totalSaves || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#f43f5e', marginTop: '0.25rem' }}>Customer wallet bookmarks</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>
            <Heart size={26} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Customer Leads</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginTop: '0.25rem' }}>
              {data?.totalEnquiries || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#06b6d4', marginTop: '0.25rem' }}>Direct inquiries received</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
            <MessageSquare size={26} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Lead Rate</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginTop: '0.25rem' }}>
              {data?.conversionRate || '0%'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '0.25rem' }}>Leads per view ratio</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Percent size={26} />
          </div>
        </div>
      </div>

      {/* Two Column Layout for Breakdown & Top Deals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        
        {/* Lead Status Breakdown */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>
            Customer Lead Status Breakdown
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ color: '#fbbf24', fontWeight: 600 }}>Pending Review</span>
                <span style={{ fontWeight: 700 }}>{data?.enquiryStatusBreakdown?.pending || 0}</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${data?.totalEnquiries ? ((data.enquiryStatusBreakdown?.pending || 0) / data.totalEnquiries) * 100 : 0}%`, height: '100%', background: '#fbbf24' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ color: '#818cf8', fontWeight: 600 }}>In Progress / Discussing</span>
                <span style={{ fontWeight: 700 }}>{data?.enquiryStatusBreakdown?.in_progress || 0}</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${data?.totalEnquiries ? ((data.enquiryStatusBreakdown?.in_progress || 0) / data.totalEnquiries) * 100 : 0}%`, height: '100%', background: '#818cf8' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ color: '#34d399', fontWeight: 600 }}>Resolved & Booked</span>
                <span style={{ fontWeight: 700 }}>{data?.enquiryStatusBreakdown?.resolved || 0}</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${data?.totalEnquiries ? ((data.enquiryStatusBreakdown?.resolved || 0) / data.totalEnquiries) * 100 : 0}%`, height: '100%', background: '#34d399' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Top Engagement Promotions */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>
            Top Performing Campaigns
          </h2>

          {data?.topOffers && data.topOffers.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {data.topOffers.map((o) => (
                <div
                  key={o._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-glass)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{o.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600 }}>Code: {o.promoCode}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399' }}>{o.discountValue}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                      {o.viewsCount} views • {o.savesCount} saves
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No campaigns active yet.</p>
          )}
        </div>

      </div>

    </div>
  );
};

export default Analytics;
