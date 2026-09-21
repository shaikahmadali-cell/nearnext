import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Spinner } from '../../components/Loading';
import { FileText, ArrowLeft, Download, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

const AdminReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await api.get('/analytics/admin');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching admin reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <Spinner text="Compiling platform reports..." />;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.88rem' }}>
            <ArrowLeft size={16} /> Back to Admin Console
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <FileText size={28} color="#f59e0b" /> Executive Platform Summary Report
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Generated on {new Date().toLocaleDateString()} • System Health & Merchant Growth Analysis
          </p>
        </div>

        <button onClick={handlePrint} className="btn btn-secondary btn-sm">
          <Download size={15} /> Export / Print Report
        </button>
      </div>

      {/* Report Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Metric Summary Grid */}
        <div className="grid-cols-3">
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
              Merchant Ecosystem
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#06b6d4', margin: '0.5rem 0' }}>
              {data?.totalBusinesses || 0}
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              {data?.approvedBusinesses} Approved & Listed ({(((data?.approvedBusinesses || 0) / (data?.totalBusinesses || 1)) * 100).toFixed(0)}% Approval Rate)
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
              Promotion Volume
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#10b981', margin: '0.5rem 0' }}>
              {data?.totalOffers || 0}
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              {data?.activeOffers} Currently Active Live Deals
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
              Audience Engagement
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0ea5e9', margin: '0.5rem 0' }}>
              {data?.totalViews || 0}
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              {data?.totalSaves} Bookmarks • {data?.totalEnquiries} Direct Leads
            </div>
          </div>
        </div>

        {/* Narrative Analysis */}
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem' }}>
            Platform Operational Highlights
          </h2>
          <div style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p>
              • <strong>Hyperlocal Growth:</strong> NearNest has successfully connected {data?.totalUsers || 0} registered community members with {data?.totalBusinesses || 0} registered storefronts across local dining, beauty, automotive, and fitness sectors.
            </p>
            <p>
              • <strong>Promotion Velocity:</strong> A total of {data?.totalOffers || 0} discount campaigns have been staged, driving {data?.totalViews || 0} total impressions and {data?.totalEnquiries || 0} high-intent customer inquiries directly to merchants.
            </p>
            <p>
              • <strong>Merchant Moderation:</strong> Verified status accounts operate with active moderation and zero reported abuse violations across the network.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminReports;
