import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import offerService from '../../services/offerService';
import { Spinner } from '../../components/Loading';
import { Tag, ArrowLeft, Save, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  'Dining & Cafes',
  'Health & Wellness',
  'Beauty & Spa',
  'Retail & Shopping',
  'Automotive & Repairs',
  'Home & Local Services',
  'Fitness & Sports',
  'Entertainment & Events',
  'Education & Tutoring',
  'Other',
];

const EditOffer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    discountType: 'percentage',
    discountValue: '',
    originalPrice: '',
    discountedPrice: '',
    promoCode: '',
    endDate: '',
    termsConditions: '',
    bannerImage: '',
    status: 'active',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setLoading(true);
        const res = await offerService.getOfferById(id);
        if (res.success && res.data) {
          const offer = res.data;
          setFormData({
            title: offer.title || '',
            description: offer.description || '',
            category: offer.category || 'Dining & Cafes',
            discountType: offer.discountType || 'percentage',
            discountValue: offer.discountValue || '',
            originalPrice: offer.originalPrice || '',
            discountedPrice: offer.discountedPrice || '',
            promoCode: offer.promoCode || '',
            endDate: offer.endDate ? new Date(offer.endDate).toISOString().split('T')[0] : '',
            termsConditions: offer.termsConditions || '',
            bannerImage: offer.bannerImage || '',
            status: offer.status || 'active',
          });
        }
      } catch (err) {
        setError(err.message || 'Error loading offer');
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSaving(true);
      const res = await offerService.updateOffer(id, {
        ...formData,
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : 0,
        discountedPrice: formData.discountedPrice ? Number(formData.discountedPrice) : 0,
      });

      if (res.success) {
        navigate('/business/my-offers');
      }
    } catch (err) {
      setError(err.message || 'Failed to update offer');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner text="Loading offer details..." />;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      
      {/* Header */}
      <div style={{ maxWidth: '800px', margin: '0 auto 2rem' }}>
        <Link to="/business/my-offers" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.88rem' }}>
          <ArrowLeft size={16} /> Back to My Offers
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Tag size={28} color="#818cf8" /> Edit Promotion
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Update offer validity, discount value, promo code, or media.
        </p>
      </div>

      {error && (
        <div style={{
          maxWidth: '800px',
          margin: '0 auto 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem' }}>
        
        <div className="form-group">
          <label className="form-label">Promotion Title *</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Discount Type *</label>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              className="form-select"
            >
              <option value="percentage">Percentage Off (%)</option>
              <option value="flat">Flat Dollar Off ($)</option>
              <option value="bogo">Buy 1 Get 1 (BOGO)</option>
              <option value="special">Special Deal</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Discount Badge Text *</label>
            <input
              type="text"
              name="discountValue"
              required
              value={formData.discountValue}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Coupon Promo Code *</label>
            <input
              type="text"
              name="promoCode"
              required
              value={formData.promoCode}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Expiration Date *</label>
            <input
              type="date"
              name="endDate"
              required
              value={formData.endDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Full Offer Description *</label>
          <textarea
            name="description"
            required
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Terms & Redemption Conditions</label>
          <input
            type="text"
            name="termsConditions"
            value={formData.termsConditions}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Banner Image URL</label>
          <input
            type="url"
            name="bannerImage"
            value={formData.bannerImage}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: '1.5rem' }}
        >
          <Save size={18} />
          {saving ? 'Updating...' : 'Save Changes'}
        </button>
      </form>

    </div>
  );
};

export default EditOffer;
