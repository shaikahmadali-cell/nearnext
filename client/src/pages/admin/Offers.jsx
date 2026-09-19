import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import offerService from '../../services/offerService';
import { Spinner } from '../../components/Loading';
import { Tag, ArrowLeft, Trash2, ExternalLink, Eye, Heart, CheckCircle2, XCircle, Clock, Check, X } from 'lucide-react';

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'pending', 'approved', 'rejected'

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
      const res = await offerService.updateOfferStatus(id, { status });
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
    if (!window.confirm('Are you sure you want to permanently remove this promotion?')) return;
    try {
      await offerService.deleteOffer(id);
      setOffers((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  const pendingCount = offers.filter((o) => o.status === 'pending').length;
  const approvedCount = offers.filter((o) => o.status === 'approved' || o.status === 'active').length;
  const rejectedCount = offers.filter((o) => o.status === 'rejected').length;

  const filteredOffers = offers.filter((o) => {
    if (filterTab === 'pending') return o.status === 'pending';
    if (filterTab === 'approved') return o.status === 'approved' || o.status === 'active';
    if (filterTab === 'rejected') return o.status === 'rejected';
    return true;
  });

  if (loading) return <Spinner text="Loading promotion deals..." />;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.88rem' }}>
          <ArrowLeft size={16} /> Back to Admin Console
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Tag size={28} color="#10b981" /> Promotion Moderation Hub
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Review pending promotions submitted by merchants, grant approvals to publish live, or take down non-compliant listings.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilterTab('all')}
          className={`btn ${filterTab === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ padding: '0.45rem 1rem' }}
        >
          All Deals ({offers.length})
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
          Approved & Live ({approvedCount})
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
        {filteredOffers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <Tag size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>No promotions found in this tab</h3>
            <p style={{ fontSize: '0.88rem' }}>Switch tabs or create a new deal from a business account.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Promotion Title</th>
                <th>Business</th>
                <th>Discount</th>
                <th>Code</th>
                <th>Engagement</th>
                <th>Status</th>
                <th>Moderation & Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOffers.map((offer) => (
                <tr key={offer._id} style={{ background: offer.status === 'pending' ? 'rgba(245, 158, 11, 0.05)' : 'transparent' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={offer.bannerImage || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=100'}
                        alt={offer.title}
                        style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff' }}>{offer.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                          Expires: {new Date(offer.endDate).toLocaleDateString()}
                        </div>
                      </div>
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
                    {offer.status === 'pending' && (
                      <span className="badge badge-warning" style={{ fontSize: '0.78rem' }}>
                        ⏳ Pending Approval
                      </span>
                    )}
                    {(offer.status === 'approved' || offer.status === 'active') && (
                      <span className="badge badge-success" style={{ fontSize: '0.78rem' }}>
                        ✓ Approved & Live
                      </span>
                    )}
                    {offer.status === 'rejected' && (
                      <span className="badge badge-danger" style={{ fontSize: '0.78rem' }}>
                        ✕ Rejected
                      </span>
                    )}
                    {offer.status === 'expired' && (
                      <span className="badge badge-secondary" style={{ fontSize: '0.78rem' }}>
                        ⏰ Expired
                      </span>
                    )}
                    {offer.status === 'draft' && (
                      <span className="badge badge-secondary" style={{ fontSize: '0.78rem' }}>
                        Draft
                      </span>
                    )}
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {offer.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(offer._id, 'approved')}
                            className="btn btn-success btn-sm"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', background: '#10b981', color: '#fff' }}
                            title="Accept and publish deal"
                          >
                            <Check size={14} style={{ marginRight: '3px' }} /> Accept
                          </button>
                          <button
                            onClick={() => handleStatusChange(offer._id, 'rejected')}
                            className="btn btn-danger btn-sm"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                            title="Reject promotion"
                          >
                            <X size={14} style={{ marginRight: '3px' }} /> Reject
                          </button>
                        </>
                      )}

                      {(offer.status === 'approved' || offer.status === 'active') && (
                        <button
                          onClick={() => handleStatusChange(offer._id, 'pending')}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                          title="Set back to pending"
                        >
                          Revoke
                        </button>
                      )}

                      {offer.status === 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(offer._id, 'approved')}
                          className="btn btn-success btn-sm"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', background: '#10b981', color: '#fff' }}
                          title="Approve promotion"
                        >
                          Approve
                        </button>
                      )}

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
        )}
      </div>

    </div>
  );
};

export default AdminOffers;
