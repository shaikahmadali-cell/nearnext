import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import businessService from '../../services/businessService';
import { Spinner } from '../../components/Loading';
import { Store, ArrowLeft, CheckCircle2, XCircle, Trash2, ExternalLink, ShieldCheck, Clock, Check, X } from 'lucide-react';

const AdminBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'pending', 'approved', 'rejected'

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const res = await businessService.adminGetAllBusinesses();
      if (res.success) {
        setBusinesses(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await businessService.updateBusinessStatus(id, { status });
      if (res.success) {
        setBusinesses((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status } : b))
        );
      }
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  const handleVerifyToggle = async (id, currentVerified) => {
    try {
      const res = await businessService.updateBusinessStatus(id, { isVerified: !currentVerified });
      if (res.success) {
        setBusinesses((prev) =>
          prev.map((b) => (b._id === id ? { ...b, isVerified: !currentVerified } : b))
        );
      }
    } catch (err) {
      alert(err.message || 'Verification update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this business and all its promotions?')) return;
    try {
      await businessService.deleteBusiness(id);
      setBusinesses((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  const pendingCount = businesses.filter((b) => b.status === 'pending').length;
  const approvedCount = businesses.filter((b) => b.status === 'approved').length;
  const rejectedCount = businesses.filter((b) => b.status === 'rejected').length;

  const filteredBusinesses = businesses.filter((b) => {
    if (filterTab === 'pending') return b.status === 'pending';
    if (filterTab === 'approved') return b.status === 'approved';
    if (filterTab === 'rejected') return b.status === 'rejected';
    return true;
  });

  if (loading) return <Spinner text="Loading business directory..." />;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.88rem' }}>
          <ArrowLeft size={16} /> Back to Admin Console
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Store size={28} color="#06b6d4" /> Business Moderation & Approval
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Review pending business registrations, accept or reject merchant requests, and moderate active listings.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilterTab('all')}
          className={`btn ${filterTab === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ padding: '0.45rem 1rem' }}
        >
          All Businesses ({businesses.length})
        </button>
        <button
          onClick={() => setFilterTab('pending')}
          className={`btn ${filterTab === 'pending' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{
            padding: '0.45rem 1rem',
            background: filterTab === 'pending' ? '#f59e0b' : 'rgba(245, 158, 11, 0.15)',
            borderColor: '#f59e0b',
            color: filterTab === 'pending' ? '#000' : '#fbbf24',
            fontWeight: 700,
          }}
        >
          <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
          Pending Requests ({pendingCount})
        </button>
        <button
          onClick={() => setFilterTab('approved')}
          className={`btn ${filterTab === 'approved' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ padding: '0.45rem 1rem' }}
        >
          <CheckCircle2 size={14} style={{ display: 'inline', marginRight: '4px' }} />
          Approved ({approvedCount})
        </button>
        <button
          onClick={() => setFilterTab('rejected')}
          className={`btn ${filterTab === 'rejected' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ padding: '0.45rem 1rem' }}
        >
          <XCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
          Rejected ({rejectedCount})
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1rem', overflowX: 'auto' }}>
        {filteredBusinesses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <Store size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>No businesses found in this tab</h3>
            <p style={{ fontSize: '0.88rem' }}>Switch tabs or create a new business profile from a merchant account.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Category</th>
                <th>Owner Details</th>
                <th>Location</th>
                <th>Verification</th>
                <th>Status</th>
                <th>Moderation & Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBusinesses.map((b) => (
                <tr key={b._id} style={{ background: b.status === 'pending' ? 'rgba(245, 158, 11, 0.05)' : 'transparent' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={b.logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100'}
                        alt={b.name}
                        style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff' }}>{b.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>{b.phone}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="badge badge-secondary" style={{ textTransform: 'none' }}>
                      {b.category}
                    </span>
                  </td>

                  <td>
                    <div style={{ fontSize: '0.85rem' }}>
                      <div>{b.owner?.name || 'Unknown'}</div>
                      <div style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>{b.owner?.email}</div>
                    </div>
                  </td>

                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {b.city}, {b.state}
                  </td>

                  <td>
                    <button
                      onClick={() => handleVerifyToggle(b._id, b.isVerified)}
                      className={`btn ${b.isVerified ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      {b.isVerified ? 'Verified ✓' : 'Unverified'}
                    </button>
                  </td>

                  <td>
                    {b.status === 'pending' && (
                      <span className="badge badge-warning" style={{ fontSize: '0.78rem' }}>
                        ⏳ Pending Approval
                      </span>
                    )}
                    {b.status === 'approved' && (
                      <span className="badge badge-success" style={{ fontSize: '0.78rem' }}>
                        ✓ Approved
                      </span>
                    )}
                    {b.status === 'rejected' && (
                      <span className="badge badge-danger" style={{ fontSize: '0.78rem' }}>
                        ✕ Rejected
                      </span>
                    )}
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {b.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(b._id, 'approved')}
                            className="btn btn-success btn-sm"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', background: '#10b981', color: '#fff' }}
                            title="Accept and publish business"
                          >
                            <Check size={14} style={{ marginRight: '3px' }} /> Accept
                          </button>
                          <button
                            onClick={() => handleStatusChange(b._id, 'rejected')}
                            className="btn btn-danger btn-sm"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                            title="Reject request"
                          >
                            <X size={14} style={{ marginRight: '3px' }} /> Reject
                          </button>
                        </>
                      )}

                      {b.status === 'approved' && (
                        <button
                          onClick={() => handleStatusChange(b._id, 'pending')}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                          title="Set back to pending"
                        >
                          Revoke
                        </button>
                      )}

                      {b.status === 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(b._id, 'approved')}
                          className="btn btn-success btn-sm"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', background: '#10b981', color: '#fff' }}
                          title="Approve business"
                        >
                          Approve
                        </button>
                      )}

                      <Link
                        to={`/businesses/${b._id}`}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.35rem 0.6rem' }}
                        title="View Public Profile"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.35rem 0.6rem' }}
                        title="Delete Business"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default AdminBusinesses;
