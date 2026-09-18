import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Store,
  Tag,
  Search,
  User,
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  Heart,
  MessageSquare,
  PlusCircle,
  Menu,
  X,
  Compass,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'business') return '/business/dashboard';
    return '/customer/dashboard';
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(79, 70, 229, 0.4)',
          }}>
            <Store size={22} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              Near<span className="gradient-text">Nest</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '-3px', letterSpacing: '0.5px' }}>
              DISCOVER & SAVE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: '2rem' }} className="desktop-links">
          <Link
            to="/offers"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: location.pathname === '/offers' ? '#818cf8' : 'var(--text-main)',
              transition: 'color var(--transition-fast)',
            }}
          >
            <Tag size={17} />
            Explore Deals
          </Link>

          <Link
            to="/businesses"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: location.pathname === '/businesses' ? '#818cf8' : 'var(--text-main)',
              transition: 'color var(--transition-fast)',
            }}
          >
            <Compass size={17} />
            Local Businesses
          </Link>
        </div>

        {/* Right side CTA / Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.35rem 0.85rem 0.35rem 0.4rem',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                }}
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={user.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name}
                </span>
                <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                  {user.role}
                </span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '120%',
                    width: '230px',
                    padding: '0.5rem',
                    boxShadow: 'var(--shadow-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    zIndex: 100,
                  }}
                >
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                      color: 'var(--text-main)',
                    }}
                    className="hover-light"
                  >
                    <LayoutDashboard size={16} color="#818cf8" />
                    Dashboard
                  </Link>

                  {user.role === 'customer' && (
                    <>
                      <Link
                        to="/customer/saved"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.65rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.9rem',
                          color: 'var(--text-main)',
                        }}
                      >
                        <Heart size={16} color="#f43f5e" />
                        Saved Deals
                      </Link>
                      <Link
                        to="/customer/enquiries"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.65rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.9rem',
                          color: 'var(--text-main)',
                        }}
                      >
                        <MessageSquare size={16} color="#06b6d4" />
                        My Enquiries
                      </Link>
                    </>
                  )}

                  {user.role === 'business' && (
                    <>
                      <Link
                        to="/business/create-offer"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.65rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.9rem',
                          color: 'var(--text-main)',
                        }}
                      >
                        <PlusCircle size={16} color="#10b981" />
                        Post New Offer
                      </Link>
                      <Link
                        to="/business/my-offers"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.65rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.9rem',
                          color: 'var(--text-main)',
                        }}
                      >
                        <Tag size={16} color="#818cf8" />
                        My Offers
                      </Link>
                    </>
                  )}

                  {user.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem',
                        color: 'var(--text-main)',
                      }}
                    >
                      <ShieldAlert size={16} color="#f59e0b" />
                      Admin Console
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                      color: 'var(--text-main)',
                    }}
                    className="hover-light"
                  >
                    <User size={16} color="#38bdf8" />
                    Account Settings
                  </Link>

                  <hr style={{ borderColor: 'var(--border-glass)', margin: '0.4rem 0' }} />

                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                      color: '#f87171',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                    }}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Join Free
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer',
              padding: '0.5rem',
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-glass)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Link
            to="/offers"
            onClick={() => setMobileMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 600 }}
          >
            <Tag size={18} color="#818cf8" /> Explore Deals
          </Link>
          <Link
            to="/businesses"
            onClick={() => setMobileMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 600 }}
          >
            <Compass size={18} color="#06b6d4" /> Local Businesses
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 600 }}
              >
                <LayoutDashboard size={18} color="#10b981" /> Dashboard ({user?.role})
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 600 }}
              >
                <User size={18} color="#38bdf8" /> Account Settings
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#f87171',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <LogOut size={18} /> Sign Out
              </button>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-links { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        .hover-light:hover {
          background: rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
