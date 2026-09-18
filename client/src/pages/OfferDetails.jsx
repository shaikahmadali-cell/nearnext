import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  Tag,
  Copy,
  Check,
  Heart,
  Store,
  MapPin,
  Phone,
  Globe,
  Share2,
  Calendar,
  ShieldCheck,
  MessageSquare,
  ArrowLeft,
  Sparkles,
  Ticket,
  Printer,
  X,
  QrCode,
} from 'lucide-react';
import offerService from '../services/offerService';
import enquiryService from '../services/enquiryService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Spinner } from '../components/Loading';

const OfferDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Voucher Modal state
  const [voucherOpen, setVoucherOpen] = useState(false);

  // Enquiry Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [enquirySubject, setEnquirySubject] = useState('');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [sendingEnquiry, setSendingEnquiry] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setLoading(true);
        const res = await offerService.getOfferById(id);
        if (res.success) {
          setOffer(res.data);
          if (user?.savedOffers && user.savedOffers.includes(res.data._id)) {
            setSaved(true);
          }
        }
      } catch (err) {
        console.error('Error fetching offer details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id, user]);

  const handleCopyCode = () => {
    const code = offer?.promoCode || 'DEAL2026';
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success(`Promo code "${code}" copied to clipboard!`);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      toast.warning('Please sign in to bookmark offers!');
      return;
    }
    try {
      const res = await offerService.toggleSaveOffer(offer._id);
      setSaved(res.saved);
      if (res.saved) {
        toast.success('Offer saved to your dashboard collection!');
      } else {
        toast.info('Offer removed from bookmarks');
      }
    } catch (err) {
      toast.error('Failed to update bookmark');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: offer.title,
        text: `Check out this deal from ${offer.business?.name || 'Locora'}: ${offer.discountValue}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Deal link copied to clipboard!');
    }
  };

  const handleSendEnquiry = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.warning('Please sign in to send an inquiry!');
      return;
    }

    try {
      setSendingEnquiry(true);
      await enquiryService.createEnquiry({
        businessId: offer.business._id || offer.business,
        offerId: offer._id,
        name: user.name,
        email: user.email,
        phone: enquiryPhone || user.phone,
        subject: enquirySubject || `Inquiry regarding: ${offer.title}`,
        message: enquiryMessage,
      });

      setEnquirySuccess(true);
      toast.success('Inquiry sent to merchant successfully!');
      setTimeout(() => {
        setEnquirySuccess(false);
        setModalOpen(false);
        setEnquiryMessage('');
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to send inquiry');
    } finally {
      setSendingEnquiry(false);
    }
  };

  const handlePrintVoucher = () => {
    window.print();
  };

  if (loading) return <Spinner text="Loading offer details..." />;
  if (!offer) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2>Offer not found</h2>
        <Link to="/offers" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Browse other offers
        </Link>
      </div>
    );
  }

  const daysLeft = Math.ceil((new Date(offer.endDate) - new Date()) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft <= 0;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      
      {/* Back button and action header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <Link to="/offers" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to all offers
        </Link>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleShare} className="btn btn-secondary btn-sm">
            <Share2 size={15} /> Share Deal
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}>
        
        {/* Left Column: Image & Details */}
        <div>
          {/* Main Banner */}
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--border-glass)',
            boxShadow: 'var(--shadow-lg)',
            marginBottom: '2rem',
          }}>
            <img
              src={offer.bannerImage || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1000'}
              alt={offer.title}
              style={{ width: '100%', height: '360px', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              background: 'linear-gradient(135deg, #ef4444 0%, #f43f5e 100%)',
              color: 'white',
              padding: '0.5rem 1.2rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              fontSize: '1.1rem',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
            }}>
              {offer.discountValue}
            </div>

            <div style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              display: 'flex',
              gap: '0.5rem',
            }}>
              <button
                onClick={handleSaveToggle}
                className="btn btn-secondary btn-icon"
                title={saved ? 'Saved' : 'Save Offer'}
                style={{ background: 'rgba(11, 15, 25, 0.8)', backdropFilter: 'blur(8px)' }}
              >
                <Heart size={20} color={saved ? '#f43f5e' : '#fff'} fill={saved ? '#f43f5e' : 'none'} />
              </button>
            </div>
          </div>

          {/* Description & Terms */}
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem' }}>About this Deal</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1rem', marginBottom: '2rem' }}>
              {offer.description}
            </p>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={18} color="#10b981" /> Terms & Conditions
            </h3>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
            }}>
              {offer.termsConditions || 'Standard merchant rules apply. Valid while supplies last. Present promo code or voucher at checkout.'}
            </div>
          </div>
        </div>

        {/* Right Column: Promo Code Box, Pricing, Digital Voucher & Business Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Coupon Action Card */}
          <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(79, 70, 229, 0.35)', position: 'relative' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-primary">{offer.category}</span>
              <span className={`badge ${isExpired ? 'badge-danger' : 'badge-warning'}`}>
                <Clock size={12} /> {isExpired ? 'Expired' : `${daysLeft} Days Remaining`}
              </span>
            </div>

            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '1rem' }}>
              {offer.title}
            </h1>

            {/* Pricing if available */}
            {offer.originalPrice > 0 && (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>
                  ${offer.discountedPrice || offer.originalPrice}
                </span>
                <span style={{ fontSize: '1.25rem', textDecoration: 'line-through', color: 'var(--text-subtle)' }}>
                  ${offer.originalPrice}
                </span>
                <span className="badge badge-success">
                  Save ${(offer.originalPrice - (offer.discountedPrice || 0)).toFixed(2)}
                </span>
              </div>
            )}

            {/* Promo Code Copy Box */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
              border: '2px dashed #6366f1',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              textAlign: 'center',
              marginBottom: '1.25rem',
            }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.5rem' }}>
                PROMOTIONAL COUPON CODE
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '2px', color: '#fff', marginBottom: '1rem' }}>
                {offer.promoCode || 'DEAL2026'}
              </div>
              <button
                onClick={handleCopyCode}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                {copied ? (
                  <>
                    <Check size={18} /> Coupon Code Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} /> Copy Promo Code
                  </>
                )}
              </button>
            </div>

            {/* Digital Voucher Modal trigger */}
            <button
              onClick={() => setVoucherOpen(true)}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '0.85rem', display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}
            >
              <Ticket size={18} color="#f59e0b" />
              Generate Digital Pass / Voucher
            </button>

            {/* Enquiry Button */}
            <button
              onClick={() => setModalOpen(true)}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '0.85rem', display: 'flex', gap: '0.5rem' }}
            >
              <MessageSquare size={18} color="#06b6d4" />
              Ask Business a Question / Book Deal
            </button>
          </div>

          {/* Business Info Card */}
          {offer.business && (
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <img
                  src={offer.business.logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120'}
                  alt={offer.business.name}
                  style={{ width: '56px', height: '56px', borderRadius: '14px', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                    <Link to={`/businesses/${offer.business._id}`} style={{ color: 'inherit' }}>
                      {offer.business.name}
                    </Link>
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {offer.business.category} • {offer.business.rating ? offer.business.rating.toFixed(1) : '5.0'} ★
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {offer.business.address && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <MapPin size={16} color="#f43f5e" style={{ flexShrink: 0 }} />
                    <span>{offer.business.address}, {offer.business.city}, {offer.business.state}</span>
                  </div>
                )}
                {offer.business.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Phone size={16} color="#10b981" style={{ flexShrink: 0 }} />
                    <span>{offer.business.phone}</span>
                  </div>
                )}
                {offer.business.website && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Globe size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
                    <a href={offer.business.website} target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8' }}>
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

              <Link
                to={`/businesses/${offer.business._id}`}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', marginTop: '1.25rem' }}
              >
                View Merchant Profile & All Deals
              </Link>
            </div>
          )}

        </div>
      </div>

      {/* Digital Voucher Modal */}
      {voucherOpen && (
        <div className="modal-backdrop" onClick={() => setVoucherOpen(false)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', padding: '0', overflow: 'hidden', background: '#0d1322' }}>
            
            {/* Voucher Header Banner */}
            <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)', padding: '1.75rem 2rem', color: '#fff', position: 'relative' }}>
              <button
                onClick={() => setVoucherOpen(false)}
                style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.2)', border: 'none', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px', opacity: 0.9 }}>
                NEARNEST OFFICIAL DIGITAL PASS
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginTop: '0.35rem' }}>
                {offer.discountValue}
              </h2>
              <div style={{ fontSize: '0.95rem', opacity: 0.95 }}>
                {offer.title}
              </div>
            </div>

            {/* Voucher Body */}
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.25rem', borderBottom: '1px dashed rgba(255,255,255,0.15)', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Merchant</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{offer.business?.name || 'Local Merchant'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Valid Until</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#f59e0b' }}>
                    {new Date(offer.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Promo Code Display & Simulated Barcode */}
              <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Show this code to merchant
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '3px', color: '#38bdf8', marginBottom: '0.75rem' }}>
                  {offer.promoCode || 'DEAL2026'}
                </div>
                
                {/* Visual Barcode Graphic */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', height: '40px', opacity: 0.8, marginBottom: '0.5rem' }}>
                  {[4, 2, 6, 1, 3, 5, 2, 7, 2, 4, 6, 1, 3, 2, 5, 4, 2, 6, 1, 3, 5, 2].map((w, i) => (
                    <div key={i} style={{ width: `${w}px`, background: '#fff', height: '100%' }} />
                  ))}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', letterSpacing: '1px' }}>
                  NN-{(offer._id || '987654').substring(0, 10).toUpperCase()}
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                * Present this voucher on your smartphone or printed paper to store staff prior to payment.
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button onClick={handlePrintVoucher} className="btn btn-secondary btn-sm">
                  <Printer size={15} /> Print Pass
                </button>
                <button onClick={handleCopyCode} className="btn btn-primary btn-sm">
                  <Copy size={15} /> Copy Code
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Direct Enquiry Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Message {offer.business?.name || 'Business'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Ask questions about "{offer.title}" or request reservations.
            </p>

            {enquirySuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <Check size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Enquiry Sent!</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  The merchant will receive your message and respond shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendEnquiry}>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    value={enquirySubject}
                    onChange={(e) => setEnquirySubject(e.target.value)}
                    placeholder={`Inquiry about ${offer.title}`}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone (Optional)</label>
                  <input
                    type="tel"
                    value={enquiryPhone}
                    onChange={(e) => setEnquiryPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message / Inquiry Details *</label>
                  <textarea
                    required
                    rows="4"
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    placeholder="E.g. Can we reserve for a party of 4 this weekend with this deal?"
                    className="form-textarea"
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingEnquiry}
                    className="btn btn-primary"
                  >
                    {sendingEnquiry ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default OfferDetails;
