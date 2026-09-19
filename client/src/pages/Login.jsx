import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Shield, Building2, AlertCircle, ArrowRight, Check, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const user = await login(email, password);

      // Validate account permission for selected role
      if (selectedRole === 'admin') {
        if (user.role !== 'admin') {
          setError('This account does not have Admin privileges. Please select Business or use an Admin account.');
          return;
        }
        navigate('/admin/dashboard');
      } else if (selectedRole === 'business') {
        if (user.role !== 'business') {
          setError('This account does not have Business privileges. Please select Admin or use a Business account.');
          return;
        }
        navigate('/business/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 180px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div
        className="glass-panel animate-fade-in login-card"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
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
            <Lock size={22} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sign in to access your discounts, promotions, and dashboard
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
          {/* Role Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '0.6rem' }}>
              Login as
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.75rem'
            }}>
              {/* Admin Option */}
              <button
                type="button"
                onClick={() => { setSelectedRole('admin'); setError(''); }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0.9rem',
                  borderRadius: 'var(--radius-md)',
                  background: selectedRole === 'admin'
                    ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.22) 0%, rgba(99, 102, 241, 0.12) 100%)'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: selectedRole === 'admin'
                    ? '1.5px solid #6366f1'
                    : '1px solid var(--border-glass)',
                  boxShadow: selectedRole === 'admin'
                    ? '0 0 20px rgba(99, 102, 241, 0.25)'
                    : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all var(--transition-base)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '0.35rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: selectedRole === 'admin' ? '#a5b4fc' : 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.95rem'
                  }}>
                    <Shield size={18} color={selectedRole === 'admin' ? '#818cf8' : 'var(--text-muted)'} />
                    Admin
                  </div>
                  {selectedRole === 'admin' && (
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: '#6366f1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Check size={12} color="#fff" strokeWidth={3} />
                    </div>
                  )}
                </div>
                <p style={{
                  fontSize: '0.75rem',
                  color: selectedRole === 'admin' ? '#c7d2fe' : 'var(--text-subtle)',
                  lineHeight: 1.35,
                  margin: 0
                }}>
                  Manage platform, users, businesses and offers
                </p>
              </button>

              {/* Business Option */}
              <button
                type="button"
                onClick={() => { setSelectedRole('business'); setError(''); }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0.9rem',
                  borderRadius: 'var(--radius-md)',
                  background: selectedRole === 'business'
                    ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.22) 0%, rgba(99, 102, 241, 0.12) 100%)'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: selectedRole === 'business'
                    ? '1.5px solid #6366f1'
                    : '1px solid var(--border-glass)',
                  boxShadow: selectedRole === 'business'
                    ? '0 0 20px rgba(99, 102, 241, 0.25)'
                    : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all var(--transition-base)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '0.35rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: selectedRole === 'business' ? '#a5b4fc' : 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.95rem'
                  }}>
                    <Building2 size={18} color={selectedRole === 'business' ? '#818cf8' : 'var(--text-muted)'} />
                    Business
                  </div>
                  {selectedRole === 'business' && (
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: '#6366f1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Check size={12} color="#fff" strokeWidth={3} />
                    </div>
                  )}
                </div>
                <p style={{
                  fontSize: '0.75rem',
                  color: selectedRole === 'business' ? '#c7d2fe' : 'var(--text-subtle)',
                  lineHeight: 1.35,
                  margin: 0
                }}>
                  Manage your business, offers and promotions
                </p>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="name@example.com"
              className="form-input"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••••••"
                className="form-input"
                autoComplete="current-password"
                style={{ paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  transition: 'color var(--transition-fast)',
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}
          >
            {loading ? 'Signing In...' : 'Sign In'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#818cf8', fontWeight: 600 }}>
            Sign up free
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .login-card {
            padding: 1.5rem 1.15rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
