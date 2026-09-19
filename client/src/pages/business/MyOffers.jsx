import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import offerService from '../../services/offerService';
import { Spinner } from '../../components/Loading';
import { Tag, PlusCircle, Edit3, Trash2, Eye, Heart, ArrowLeft, Clock } from 'lucide-react';

const MyOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOffers = async () => {
    try {
      setLoading(true);
      const res = await offerService.getMyOffers();
      if (res.success) {
        setOffers(res.data);
      }
    } catch (err) {
      console.error('Error fetching my offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOffers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this offer?')) return;

    try {
      await offerService.deleteOffer(id);
      setOffers((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete offer');
    }
  };

  if (loading) return <Spinner text="Loading your promotions..." />;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/business/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.88rem' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Tag size={28} color="#818cf8" /> Manage Your Promotions ({offers.length})
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Track performance, update details, or launch new discount campaigns.
          </p>
        </div>

        <Link to="/business/create-offer" className="btn btn-primary">
          <PlusCircle size={16} /> Post New Promotion
        </Link>
      </div>

      {offers.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)' }}>
          <Tag size={48} color="#818cf8" style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>No offers published yet</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
            Publish your first discount or flash deal to start attracting nearby customers.
          </p>
          <Link to="/business/create-offer" className="btn btn-primary">
            Create First Offer
          </Link>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '1rem', overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Deal Info</th>
                <th>Category</th>
                <th>Discount</th>
                <th>Code</th>
                <th>Expires</th>
                <th>Engagement</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => {
                const daysLeft = Math.ceil((new Date(offer.endDate) - new Date()) / (1000 * 60 * 60 * 24));
                const isExpired = daysLeft <= 0;

                return (
                  <tr key={offer._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img
                          src={offer.bannerImage || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=100'}
                          alt={offer.title}
                          style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{offer.title}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                            Created on {new Date(offer.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-secondary" style={{ textTransform: 'none' }}>
                        {offer.category}
                      </span>
                    </td>

                    <td>
                      <span className="badge badge-primary">{offer.discountValue}</span>
                    </td>

                    <td>
                      <span style={{ fontWeight: 800, color: '#818cf8', letterSpacing: '0.5px' }}>{offer.promoCode}</span>
                    </td>

                    <td style={{ fontSize: '0.85rem', color: isExpired ? '#f87171' : 'var(--text-muted)' }}>
                      {new Date(offer.endDate).toLocaleDateString()} ({isExpired ? 'Expired' : `${daysLeft}d left`})
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#06b6d4' }}>
                          <Eye size={14} /> {offer.viewsCount || 0}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f43f5e' }}>
                          <Heart size={14} /> {offer.savesCount || 0}
                        </span>
                      </div>
                    </td>

                    <td>
                      {offer.status === 'pending' && (
                        <span className="badge badge-warning">
                          ⏳ Pending Approval
                        </span>
                      )}
                      {(offer.status === 'approved' || offer.status === 'active') && (
                        <span className="badge badge-success">
                          ✓ Live & Approved
                        </span>
                      )}
                      {offer.status === 'rejected' && (
                        <span className="badge badge-danger">
                          ✕ Rejected by Admin
                        </span>
                      )}
                      {offer.status === 'expired' && (
                        <span className="badge badge-secondary">
                          ⏰ Expired
                        </span>
                      )}
                      {offer.status === 'draft' && (
                        <span className="badge badge-secondary">
                          Draft
                        </span>
                      )}
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Link
                          to={`/business/edit-offer/${offer._id}`}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.6rem' }}
                          title="Edit Offer"
                        >
                          <Edit3 size={14} />
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default MyOffers;
