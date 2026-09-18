import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Store, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'customer',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);

    try {
      const user = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
      });

      if (user.role === 'business') {
        navigate('/business/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 180px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
          }}>
            <UserPlus size={22} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Create an Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Join LocalPulse to claim deals or promote your business
          </p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            color: '#f87171',
            fontSize: '0.88rem',
            marginBottom: '1.5rem',
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Account Role Selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>I want to:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'customer' })}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: formData.role === 'customer' ? 'rgba(79, 70, 229, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: formData.role === 'customer' ? '2px solid #4f46e5' : '1px solid var(--border-glass)',
                  color: formData.role === 'customer' ? '#fff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <User size={22} color={formData.role === 'customer' ? '#818cf8' : 'currentColor'} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Find & Save Deals</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>For Customers</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'business' })}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: formData.role === 'business' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: formData.role === 'business' ? '2px solid #06b6d4' : '1px solid var(--border-glass)',
                  color: formData.role === 'business' ? '#fff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <Store size={22} color={formData.role === 'business' ? '#38bdf8' : 'currentColor'} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Promote My Business</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>For Store Owners</span>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{formData.role === 'business' ? 'Owner / Manager Full Name' : 'Full Name'}</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number (Optional)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}
          >
            {loading ? 'Creating Account...' : `Register as ${formData.role === 'business' ? 'Business' : 'Customer'}`}
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#818cf8', fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
