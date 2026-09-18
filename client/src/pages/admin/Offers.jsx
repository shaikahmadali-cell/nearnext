import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import offerService from '../../services/offerService';
import { Spinner } from '../../components/Loading';
import { Tag, ArrowLeft, Trash2, ExternalLink, Eye, Heart } from 'lucide-react';

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await offerService.adminGetAllOffers();
      if (res.success) {
        setOffers(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await offerService.updateOffer(id, { status });
      if (res.success) {
        setOffers((prev) =>
          prev.map((o) => (o._id === id ? { ...o, status } : o))
        );
      }
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this promotion?')) return;
    try {
      await offerService.deleteOffer(id);
      setOffers((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  if (loading) return <Spinner text="Loading promotion deals..." />;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.88rem' }}>
          <ArrowLeft size={16} /> Back to Admin Console
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Tag size={28} color="#10b981" /> Promotion Moderation Hub ({offers.length})
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Moderate public discount campaigns, adjust validity status, or take down non-compliant listings.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Promotion Title</th>
              <th>Business</th>
              <th>Discount</th>
              <th>Code</th>
              <th>Engagement</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer._id}>
                <td>
                  <div style={{ fontWeight: 700, color: '#fff' }}>{offer.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                    Expires: {new Date(offer.endDate).toLocaleDateString()}
                  </div>
                </td>

                <td style={{ color: 'var(--text-muted)' }}>
                  {offer.business?.name || 'Unknown Business'}
                </td>

                <td>
                  <span className="badge badge-primary">{offer.discountValue}</span>
                </td>

                <td style={{ fontWeight: 800, color: '#818cf8' }}>
                  {offer.promoCode}
                </td>

                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#06b6d4' }}>
                      <Eye size={13} /> {offer.viewsCount || 0}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f43f5e' }}>
                      <Heart size={13} /> {offer.savesCount || 0}
                    </span>
                  </div>
                </td>

                <td>
                  <select
                    value={offer.status}
                    onChange={(e) => handleStatusChange(offer._id, e.target.value)}
                    className="form-select"
                    style={{ width: 'auto', padding: '0.3rem 0.65rem', fontSize: '0.85rem' }}
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="expired">Expired</option>
                  </select>
                </td>

                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Link
                      to={`/offers/${offer._id}`}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.35rem 0.6rem' }}
                      title="View Deal"
                    >
                      <ExternalLink size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(offer._id)}
                      className="btn btn-danger btn-sm"
                      style={{ padding: '0.35rem 0.6rem' }}
                      title="Delete Offer"
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

export default AdminOffers;
