import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  CheckCircle2,
  Clock,
  Tag,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  Share2,
  Navigation,
  Trash2,
  Send,
} from 'lucide-react';
import businessService from '../services/businessService';
import enquiryService from '../services/enquiryService';
import reviewService from '../services/reviewService';
import OfferCard from '../components/OfferCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Spinner } from '../components/Loading';

const BusinessDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Enquiry form state
  const [enquirySubject, setEnquirySubject] = useState('');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  useEffect(() => {
    fetchBusiness();
    fetchReviews();
  }, [id]);

  const fetchBusiness = async () => {
    try {
      setLoading(true);
      const res = await businessService.getBusinessById(id);
      if (res.success) {
        setBusiness(res.data);
      }
    } catch (err) {
      console.error('Error fetching business:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const res = await reviewService.getReviewsForBusiness(id);
      if (res.success) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleSendEnquiry = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.warning('Please sign in to send an inquiry!');
      return;
    }

    try {
      setSubmittingEnquiry(true);
      await enquiryService.createEnquiry({
        businessId: business._id,
        name: user.name,
        email: user.email,
        phone: enquiryPhone || user.phone,
        subject: enquirySubject || 'General Business Inquiry',
        message: enquiryMessage,
      });

      setEnquirySuccess(true);
      setEnquiryMessage('');
      setEnquirySubject('');
      toast.success('Inquiry submitted to the business manager!');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to submit inquiry');
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.warning('Please sign in to post a review!');
      return;
    }

    if (!reviewComment.trim()) {
      toast.error('Please write a comment for your review');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await reviewService.createReview(business._id, {
        rating: reviewRating,
        comment: reviewComment,
      });

      toast.success(res.message || 'Thank you for your review!');
      setReviewComment('');
      fetchReviews();
      fetchBusiness();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewService.deleteReview(reviewId);
      toast.success('Review removed');
      fetchReviews();
      fetchBusiness();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete review');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Business link copied to clipboard!');
    }
  };

  const getDirectionsUrl = () => {
    if (!business) return '#';
    const query = encodeURIComponent(`${business.name}, ${business.address}, ${business.city}, ${business.state}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  if (loading) return <Spinner text="Loading business details..." />;
  if (!business) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2>Business not found</h2>
        <Link to="/businesses" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Directory
        </Link>
      </div>
    );
  }

  // Calculate review score distributions
  const totalReviewsCount = reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => Math.round(r.rating) === stars).length;
    const percentage = totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0;
    return { stars, count, percentage };
  });

  return (
    <div style={{ paddingBottom: '6rem' }}>
      
      {/* Cover Header Banner */}
      <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
        <img
          src={business.coverImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400'}
          alt={business.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(11, 15, 25, 0.95) 0%, rgba(11, 15, 25, 0.4) 100%)',
        }} />
      </div>

      <div className="container" style={{ marginTop: '-80px', position: 'relative', zIndex: 10 }}>
        
        {/* Business Header Card */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <img
                src={business.logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200'}
                alt={business.name}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: 'var(--radius-lg)',
                  objectFit: 'cover',
                  border: '3px solid #131b2e',
                  boxShadow: 'var(--shadow-md)',
                }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-primary">{business.category}</span>
                  {business.isVerified && (
                    <span className="badge badge-success">
                      <CheckCircle2 size={12} /> Verified Merchant
                    </span>
                  )}
                </div>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                  {business.name}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontWeight: 700 }}>
                    <Star size={16} fill="#f59e0b" /> {business.rating ? business.rating.toFixed(1) : '5.0'}
                  </div>
                  <span>•</span>
                  <span>{business.numReviews || reviews.length} customer reviews</span>
                  <span>•</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={15} color="#f43f5e" /> {business.city}, {business.state}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a href={getDirectionsUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                <Navigation size={15} /> Directions
              </a>
              <a href={`tel:${business.phone}`} className="btn btn-secondary btn-sm">
                <Phone size={15} /> Call Now
              </a>
              {business.website && (
                <a href={business.website} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                  <Globe size={15} /> Website
                </a>
              )}
              <button onClick={handleShare} className="btn btn-secondary btn-sm" title="Share link">
                <Share2 size={15} /> Share
              </button>
            </div>

          </div>
        </div>

        {/* Content Layout */}
        <div className="business-details-grid">
          
          {/* Left Column: Active Promotions, Bio & Reviews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Active Promotions Section */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Tag size={20} color="#818cf8" />
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>
                  Active Deals & Promotions ({business.offers?.length || 0})
                </h2>
              </div>

              {business.offers && business.offers.length > 0 ? (
                <div className="grid-cols-2">
                  {business.offers.map((offer) => (
                    <OfferCard key={offer._id} offer={{ ...offer, business }} />
                  ))}
                </div>
              ) : (
                <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No active promotion campaigns right now. Check back soon!</p>
                </div>
              )}
            </div>

            {/* About & Bio */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem' }}>
                About the Business
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {business.description}
              </p>
            </div>

            {/* Reviews & Ratings Section */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Star size={20} color="#f59e0b" fill="#f59e0b" /> Customer Reviews & Ratings
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                    Real feedback from local verified patrons
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>
                    {business.rating ? business.rating.toFixed(1) : '5.0'}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={12} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{reviews.length} reviews</span>
                  </div>
                </div>
              </div>

              {/* Rating Distribution Bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
                {ratingDistribution.map((item) => (
                  <div key={item.stars} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem' }}>
                    <span style={{ width: '45px', color: 'var(--text-muted)' }}>{item.stars} stars</span>
                    <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.percentage}%`, height: '100%', background: '#f59e0b', borderRadius: '4px' }} />
                    </div>
                    <span style={{ width: '30px', textAlign: 'right', color: 'var(--text-muted)' }}>{item.count}</span>
                  </div>
                ))}
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleAddReview} style={{ marginBottom: '2.5rem', padding: '1.5rem', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  Write a Review
                </h3>
                
                {/* Star rating selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Your Rating:</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={22}
                        style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
                        color="#f59e0b"
                        fill={(hoverRating || reviewRating) >= star ? '#f59e0b' : 'none'}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setReviewRating(star)}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f59e0b' }}>
                    {hoverRating || reviewRating} / 5 Stars
                  </span>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <textarea
                    rows="3"
                    className="form-textarea"
                    placeholder="Share details of your own experience at this place..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" disabled={submittingReview} className="btn btn-primary btn-sm">
                  <Send size={15} /> {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </form>

              {/* Reviews List */}
              {reviewsLoading ? (
                <Spinner text="Loading reviews..." />
              ) : reviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {reviews.map((rev) => (
                    <div
                      key={rev._id}
                      style={{
                        padding: '1.25rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={rev.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                            alt={rev.user?.name || 'User'}
                            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                              {rev.user?.name || 'Verified Customer'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={14}
                                fill={rev.rating >= s ? '#f59e0b' : 'none'}
                                color="#f59e0b"
                              />
                            ))}
                          </div>
                          {(user?._id === rev.user?._id || user?.role === 'admin') && (
                            <button
                              onClick={() => handleDeleteReview(rev._id)}
                              style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                              title="Delete review"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </div>

                      <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No customer reviews yet. Be the first to share your experience!
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Opening Hours, Location, Contact Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Info Box */}
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                Contact & Operating Hours
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <MapPin size={18} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Location</div>
                    <div>{business.address}</div>
                    <div>{business.city}, {business.state} {business.zipCode}</div>
                    <a
                      href={getDirectionsUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#6366f1', fontSize: '0.82rem', marginTop: '0.35rem', fontWeight: 600 }}
                    >
                      <Navigation size={13} /> Open in Google Maps
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Clock size={18} color="#06b6d4" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Working Hours</div>
                    <div>{business.openingHours || 'Mon - Sat: 9:00 AM - 8:00 PM'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Phone size={18} color="#10b981" style={{ flexShrink: 0 }} />
                  <div>{business.phone}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Mail size={18} color="#818cf8" style={{ flexShrink: 0 }} />
                  <div>{business.email}</div>
                </div>
              </div>
            </div>

            {/* Direct Contact / Enquiry Form */}
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MessageSquare size={18} color="#818cf8" /> Send Direct Inquiry
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Questions about services, pricing, or bookings? Send a note directly to the store manager.
              </p>

              {enquirySuccess ? (
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1.25rem', borderRadius: 'var(--radius-md)', color: '#34d399', textAlign: 'center' }}>
                  <CheckCircle2 size={32} style={{ margin: '0 auto 0.5rem' }} />
                  <div style={{ fontWeight: 700 }}>Inquiry Submitted!</div>
                  <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>The manager will get back to you via email or phone.</div>
                </div>
              ) : (
                <form onSubmit={handleSendEnquiry}>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      value={enquirySubject}
                      onChange={(e) => setEnquirySubject(e.target.value)}
                      placeholder="e.g. Booking availability"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Phone</label>
                    <input
                      type="tel"
                      value={enquiryPhone}
                      onChange={(e) => setEnquiryPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea
                      required
                      rows="3"
                      value={enquiryMessage}
                      onChange={(e) => setEnquiryMessage(e.target.value)}
                      placeholder="How can this business help you?"
                      className="form-textarea"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingEnquiry}
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '0.5rem' }}
                  >
                    {submittingEnquiry ? 'Sending...' : 'Submit Inquiry'}
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>

      <style>{`
        .business-details-grid {
          display: grid;
          grid-template-columns: 1.25fr 0.75fr;
          gap: 2.5rem;
          align-items: start;
        }
        @media (max-width: 960px) {
          .business-details-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default BusinessDetails;
