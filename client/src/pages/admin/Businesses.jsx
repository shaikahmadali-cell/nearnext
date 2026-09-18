import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import businessService from '../../services/businessService';
import { Spinner } from '../../components/Loading';
import { Store, ArrowLeft, CheckCircle2, XCircle, Trash2, ExternalLink } from 'lucide-react';

const AdminBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <Spinner text="Loading business directory..." />;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.88rem' }}>
          <ArrowLeft size={16} /> Back to Admin Console
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Store size={28} color="#06b6d4" /> Merchant & Directory Moderation ({businesses.length})
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Approve registrations, toggle verified merchant status, and moderate profiles.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Category</th>
              <th>Owner</th>
              <th>Location</th>
              <th>Verification</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((b) => (
              <tr key={b._id}>
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
                  <select
                    value={b.status}
                    onChange={(e) => handleStatusChange(b._id, e.target.value)}
                    className="form-select"
                    style={{ width: 'auto', padding: '0.3rem 0.65rem', fontSize: '0.85rem' }}
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>

                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
      </div>

    </div>
  );
};

export default AdminBusinesses;
