import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import offerService from '../../services/offerService';
import { Tag, ArrowLeft, PlusCircle, AlertCircle } from 'lucide-react';

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

const CreateOffer = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Dining & Cafes',
    discountType: 'percentage',
    discountValue: '25% OFF',
    originalPrice: '',
    discountedPrice: '',
    promoCode: 'SUMMER25',
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    termsConditions: 'Valid on in-store and online redemption. Cannot be combined with other offers.',
    bannerImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
    status: 'active',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const res = await offerService.createOffer({
        ...formData,
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : 0,
        discountedPrice: formData.discountedPrice ? Number(formData.discountedPrice) : 0,
      });

      if (res.success) {
        navigate('/business/my-offers');
      }
    } catch (err) {
      setError(err.message || 'Failed to create offer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      
      {/* Header */}
      <div style={{ maxWidth: '800px', margin: '0 auto 2rem' }}>
        <Link to="/business/my-offers" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.88rem' }}>
          <ArrowLeft size={16} /> Back to My Offers
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <PlusCircle size={28} color="#10b981" /> Publish New Promotion
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Create a targeted deal or coupon code to drive neighborhood customer traffic.
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
            placeholder="e.g. 30% Off All Gourmet Dinners & Appetizers"
            className="form-input"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
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
              <option value="special">Special Bundle / Deal</option>
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
              placeholder="e.g. 30% OFF or $20 OFF"
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
              placeholder="e.g. SAVE30"
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Original Price (Optional $)</label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleChange}
              placeholder="50"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Discounted Price (Optional $)</label>
            <input
              type="number"
              name="discountedPrice"
              value={formData.discountedPrice}
              onChange={handleChange}
              placeholder="35"
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
            placeholder="Describe what items are included in this deal..."
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
            placeholder="e.g. Dine-in only. Valid Mon-Thu after 5pm."
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
            placeholder="https://images.unsplash.com/..."
            className="form-input"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: '1.5rem' }}
        >
          <PlusCircle size={18} />
          {loading ? 'Creating Promotion...' : 'Publish Promotion Live'}
        </button>
      </form>

    </div>
  );
};

export default CreateOffer;
