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
import ThemeToggle from './ui/theme-toggle';

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

  const handleNavMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg-nav, rgba(11, 15, 25, 0.85))',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-glass)',
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
        <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="desktop-links">
          <Link
            to="/offers"
            onMouseMove={handleNavMouseMove}
            className={`nav-premium-btn ${location.pathname === '/offers' ? 'active' : ''}`}
          >
            <span className="nav-spotlight" />
            <span className="nav-btn-icon">
              <Tag size={17} />
            </span>
            <span className="nav-btn-label">Explore Deals</span>
          </Link>

          <Link
            to="/businesses"
            onMouseMove={handleNavMouseMove}
            className={`nav-premium-btn ${location.pathname === '/businesses' ? 'active' : ''}`}
          >
            <span className="nav-spotlight" />
            <span className="nav-btn-icon">
              <Compass size={17} />
            </span>
            <span className="nav-btn-label">Local Businesses</span>
          </Link>
        </div>

        {/* Right side CTA / Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div className="desktop-theme-toggle" style={{ display: 'none' }}>
            <ThemeToggle />
          </div>

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

                  <div style={{ height: '1px', background: 'var(--border-glass)', margin: '0.25rem 0' }} />

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

          {/* Theme Switcher in Mobile Menu */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-glass)',
          }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)' }}>Theme Mode</span>
            <ThemeToggle />
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-links { display: flex !important; }
          .desktop-theme-toggle { display: block !important; }
          .mobile-toggle { display: none !important; }
        }
        .hover-light:hover {
          background: var(--bg-card-hover, rgba(255, 255, 255, 0.05));
        }

        /* Modern Premium Navbar Buttons */
        .nav-premium-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.45rem 0.9rem;
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-main);
          border-radius: var(--radius-md);
          text-decoration: none;
          overflow: hidden;
          background: transparent;
          border: 1px solid transparent;
          transition: color 300ms cubic-bezier(0.16, 1, 0.3, 1),
                      background 300ms cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 300ms cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 300ms cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          user-select: none;
        }

        .nav-premium-btn .nav-btn-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: inherit;
          transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), color 300ms cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1;
        }

        .nav-premium-btn .nav-btn-label {
          position: relative;
          z-index: 1;
          transition: color 300ms cubic-bezier(0.16, 1, 0.3, 1), text-shadow 300ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Mouse Spotlight Glow */
        .nav-premium-btn .nav-spotlight {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          opacity: 0;
          background: radial-gradient(85px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(129, 140, 248, 0.22), rgba(6, 182, 212, 0.08) 50%, transparent 80%);
          transition: opacity 300ms ease-out;
          z-index: 0;
        }

        /* Hover States */
        .nav-premium-btn:hover {
          color: #ffffff;
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 20px rgba(79, 70, 229, 0.22), 0 0 12px rgba(6, 182, 212, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
        }

        .nav-premium-btn:hover .nav-spotlight {
          opacity: 1;
        }

        .nav-premium-btn:hover .nav-btn-icon {
          transform: scale(1.1) translateY(-1.5px);
          color: #a5b4fc;
        }

        .nav-premium-btn:hover .nav-btn-label {
          color: #f8fafc;
          text-shadow: 0 0 12px rgba(165, 180, 252, 0.45);
        }

        /* Bottom Border / Underline animation */
        .nav-premium-btn::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #4f46e5 0%, #06b6d4 100%);
          border-radius: 9999px;
          transform: translateX(-50%);
          transition: width 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease-out;
          box-shadow: 0 0 8px rgba(79, 70, 229, 0.6);
          z-index: 2;
        }

        .nav-premium-btn:hover::after {
          width: 75%;
        }

        /* Active Link State */
        .nav-premium-btn.active {
          color: #e0e7ff;
          background: rgba(79, 70, 229, 0.12);
          border-color: rgba(99, 102, 241, 0.25);
        }

        .nav-premium-btn.active::after {
          width: 75%;
        }

        .nav-premium-btn.active .nav-btn-icon {
          color: #818cf8;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
