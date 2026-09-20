import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import businessService from '../../services/businessService';
import { Spinner } from '../../components/Loading';
import { Store, ArrowLeft, CheckCircle2, AlertCircle, Save } from 'lucide-react';

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

const MyBusiness = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Dining & Cafes',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    logo: '',
    coverImage: '',
    openingHours: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [businessStatus, setBusinessStatus] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await businessService.getMyBusiness();
        if (res.success && res.data) {
          setBusinessStatus(res.data.status);
          setFormData({
            name: res.data.name || '',
            category: res.data.category || 'Dining & Cafes',
            description: res.data.description || '',
            address: res.data.address || '',
            city: res.data.city || '',
            state: res.data.state || '',
            zipCode: res.data.zipCode || '',
            phone: res.data.phone || '',
            email: res.data.email || '',
            website: res.data.website || '',
            logo: res.data.logo || '',
            coverImage: res.data.coverImage || '',
            openingHours: res.data.openingHours || '',
          });
        }
      } catch (err) {
        console.error('Error loading business profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage({ text: '', type: '' });
      const res = await businessService.createOrUpdateBusiness(formData);
      if (res.success) {
        setMessage({ text: 'Business profile saved successfully!', type: 'success' });
      }
    } catch (err) {
      setMessage({ text: err.message || 'Failed to save business details', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner text="Loading business details..." />;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      
      {/* Header */}
      <div style={{ maxWidth: '800px', margin: '0 auto 2rem' }}>
        <Link to="/business/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.88rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
              <Store size={28} color="#0ea5e9" /> Manage Business Profile
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Update store location, category, contact info, operating hours, and media.
            </p>
          </div>
          {businessStatus && (
            <div>
              {businessStatus === 'pending' && (
                <span className="badge badge-warning" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
                  ⏳ Pending Admin Approval (Requesting)
                </span>
              )}
              {businessStatus === 'approved' && (
                <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
                  ✓ Approved & Live
                </span>
              )}
              {businessStatus === 'rejected' && (
                <span className="badge badge-danger" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
                  ✕ Rejected by Admin
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {businessStatus === 'pending' && (
        <div style={{
          maxWidth: '800px',
          margin: '0 auto 1.5rem',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: '#fbbf24',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <div>
            <strong>Under Admin Review:</strong> Your business profile has been submitted to the admin for verification. It will appear on the public directory once accepted.
          </div>
        </div>
      )}

      {message.text && (
        <div style={{
          maxWidth: '800px',
          margin: '0 auto 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          color: message.type === 'success' ? '#34d399' : '#f87171',
        }}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Business / Shop Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Bella Italia Trattoria"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Primary Industry Category *</label>
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
        </div>

        <div className="form-group">
          <label className="form-label">Business Bio & Story *</label>
          <textarea
            name="description"
            required
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell customers what makes your service, food, or shop unique..."
            className="form-textarea"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Physical Street Address *</label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. 452 Elm Street"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">City *</label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Austin"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">State / Zip</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="TX 78701"
              className="form-input"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Store Phone Number *</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (512) 555-0199"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Store Email *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="info@bellaitalia.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Website (Optional)</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://bellaitalia.com"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Opening & Operating Hours</label>
          <input
            type="text"
            name="openingHours"
            value={formData.openingHours}
            onChange={handleChange}
            placeholder="e.g. Mon - Sat: 9:00 AM - 8:00 PM | Sun: Closed"
            className="form-input"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Logo Image URL</label>
            <input
              type="url"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cover Header Image URL</label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="form-input"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: '1.5rem' }}
        >
          <Save size={18} />
          {saving ? 'Saving Profile...' : 'Save Business Information'}
        </button>
      </form>

    </div>
  );
};

export default MyBusiness;
