import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import enquiryService from '../../services/enquiryService';
import { Spinner } from '../../components/Loading';
import { MessageSquare, ArrowLeft, Send, Store, Tag } from 'lucide-react';

const CustomerEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await enquiryService.getCustomerEnquiries();
      if (res.success) {
        setEnquiries(res.data);
        if (res.data.length > 0 && !selectedEnquiry) {
          setSelectedEnquiry(res.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedEnquiry) return;

    try {
      setSending(true);
      const res = await enquiryService.replyEnquiry(selectedEnquiry._id, replyMessage);
      if (res.success) {
        setSelectedEnquiry(res.data);
        setEnquiries((prev) =>
          prev.map((item) => (item._id === res.data._id ? res.data : item))
        );
        setReplyMessage('');
      }
    } catch (err) {
      alert(err.message || 'Error sending reply');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Spinner text="Loading your customer messages..." />;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/customer/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.88rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <MessageSquare size={28} color="#06b6d4" /> Merchant Inquiries & Messages
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Real-time conversation threads with local merchants.
        </p>
      </div>

      {enquiries.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)' }}>
          <MessageSquare size={48} color="#06b6d4" style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>No conversations yet</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
            When you send a message to a merchant about an offer, you will receive replies here.
          </p>
          <Link to="/offers" className="btn btn-secondary">
            Browse Deals & Inquire
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* List column */}
          <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '600px', overflowY: 'auto' }}>
            <div style={{ padding: '0.5rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Your Inquiries ({enquiries.length})
            </div>
            {enquiries.map((enq) => {
              const isSelected = selectedEnquiry?._id === enq._id;
              return (
                <div
                  key={enq._id}
                  onClick={() => setSelectedEnquiry(enq)}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(79, 70, 229, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                    border: isSelected ? '1px solid #4f46e5' : '1px solid var(--border-glass)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                      {enq.business?.name || 'Local Store'}
                    </div>
                    <span className={`badge ${enq.status === 'resolved' ? 'badge-success' : 'badge-primary'}`} style={{ fontSize: '0.65rem' }}>
                      {enq.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '0.5rem' }}>
                    {enq.subject}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                    <span>{enq.replies?.length || 0} replies</span>
                    <span>{new Date(enq.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Conversation Detail Column */}
          {selectedEnquiry && (
            <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', height: '600px' }}>
              
              {/* Header */}
              <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-glass)', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Store size={18} color="#06b6d4" />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedEnquiry.business?.name}</h3>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <strong>Subject:</strong> {selectedEnquiry.subject}
                </div>
                {selectedEnquiry.offer && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#818cf8', marginTop: '0.25rem' }}>
                    <Tag size={13} /> {selectedEnquiry.offer.title} ({selectedEnquiry.offer.discountValue})
                  </div>
                )}
              </div>

              {/* Message Feed */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem', marginBottom: '1rem' }}>
                
                {/* Initial customer message */}
                <div style={{ alignSelf: 'flex-start', maxWidth: '85%', background: 'rgba(255, 255, 255, 0.06)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '0.25rem' }}>
                    You • {new Date(selectedEnquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{selectedEnquiry.message}</p>
                </div>

                {/* Thread replies */}
                {selectedEnquiry.replies?.map((rep, idx) => {
                  const isBusiness = rep.senderRole === 'business';
                  return (
                    <div
                      key={idx}
                      style={{
                        alignSelf: isBusiness ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        background: isBusiness ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.25) 0%, rgba(124, 58, 237, 0.25) 100%)' : 'rgba(255, 255, 255, 0.06)',
                        border: isBusiness ? '1px solid rgba(79, 70, 229, 0.4)' : '1px solid var(--border-glass)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', color: isBusiness ? '#a5b4fc' : 'var(--text-subtle)', marginBottom: '0.25rem', fontWeight: 600 }}>
                        {isBusiness ? `Merchant (${selectedEnquiry.business?.name})` : 'You'} • {new Date(rep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{rep.message}</p>
                    </div>
                  );
                })}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-glass)' }}>
                <input
                  type="text"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply message..."
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <button
                  type="submit"
                  disabled={sending || !replyMessage.trim()}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '0 1.25rem' }}
                >
                  <Send size={16} /> Send
                </button>
              </form>

            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default CustomerEnquiries;
