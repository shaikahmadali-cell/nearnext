import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import enquiryService from '../../services/enquiryService';
import { Spinner } from '../../components/Loading';
import { MessageSquare, ArrowLeft, Send, CheckCircle2, User, Phone, Mail, Tag } from 'lucide-react';

const BusinessEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await enquiryService.getBusinessEnquiries();
      if (res.success) {
        setEnquiries(res.data);
        if (res.data.length > 0 && !selectedEnquiry) {
          setSelectedEnquiry(res.data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching merchant enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedEnquiry) return;

    try {
      setSending(true);
      const res = await enquiryService.replyEnquiry(selectedEnquiry._id, replyText);
      if (res.success) {
        setSelectedEnquiry(res.data);
        setEnquiries((prev) =>
          prev.map((item) => (item._id === res.data._id ? res.data : item))
        );
        setReplyText('');
      }
    } catch (err) {
      alert(err.message || 'Error sending reply');
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedEnquiry) return;
    try {
      const res = await enquiryService.updateEnquiryStatus(selectedEnquiry._id, newStatus);
      if (res.success) {
        setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }));
        setEnquiries((prev) =>
          prev.map((item) => (item._id === selectedEnquiry._id ? { ...item, status: newStatus } : item))
        );
      }
    } catch (err) {
      alert(err.message || 'Error updating status');
    }
  };

  if (loading) return <Spinner text="Loading customer leads & messages..." />;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/business/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.88rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <MessageSquare size={28} color="#10b981" /> Customer Lead Inbox ({enquiries.length})
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Respond to customer questions, booking enquiries, and deal consultations.
        </p>
      </div>

      {enquiries.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)' }}>
          <MessageSquare size={48} color="#10b981" style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>No customer leads yet</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto' }}>
            When users reach out from your profile or promotion pages, inquiries will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* List Column */}
          <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '640px', overflowY: 'auto' }}>
            <div style={{ padding: '0.5rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Incoming Customer Messages
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
                    background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    border: isSelected ? '1px solid #10b981' : '1px solid var(--border-glass)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                      {enq.name || 'Customer'}
                    </div>
                    <span className={`badge ${enq.status === 'resolved' ? 'badge-success' : enq.status === 'in_progress' ? 'badge-primary' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                      {enq.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '0.4rem' }}>
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
            <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', height: '640px' }}>
              
              {/* Header */}
              <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-glass)', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedEnquiry.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Mail size={13} /> {selectedEnquiry.email}</span>
                      {selectedEnquiry.phone && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Phone size={13} /> {selectedEnquiry.phone}</span>
                      )}
                    </div>
                  </div>

                  {/* Status update dropdown */}
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="form-select"
                    style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                {selectedEnquiry.offer && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: '#818cf8', marginTop: '0.5rem', background: 'rgba(79, 70, 229, 0.1)', padding: '0.3rem 0.65rem', borderRadius: 'var(--radius-sm)' }}>
                    <Tag size={13} /> Inquiry regarding offer: <strong>{selectedEnquiry.offer.title}</strong>
                  </div>
                )}
              </div>

              {/* Message Feed */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem', marginBottom: '1rem' }}>
                
                {/* Original Customer Message */}
                <div style={{ alignSelf: 'flex-start', maxWidth: '85%', background: 'rgba(255, 255, 255, 0.06)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginBottom: '0.25rem', fontWeight: 600 }}>
                    Customer Inquiry • {new Date(selectedEnquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{selectedEnquiry.message}</p>
                </div>

                {/* Reply Threads */}
                {selectedEnquiry.replies?.map((rep, idx) => {
                  const isBusiness = rep.senderRole === 'business';
                  return (
                    <div
                      key={idx}
                      style={{
                        alignSelf: isBusiness ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        background: isBusiness ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.25) 100%)' : 'rgba(255, 255, 255, 0.06)',
                        border: isBusiness ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-glass)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', color: isBusiness ? '#6ee7b7' : 'var(--text-subtle)', marginBottom: '0.25rem', fontWeight: 600 }}>
                        {isBusiness ? 'Your Response' : 'Customer'} • {new Date(rep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response to customer..."
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <button
                  type="submit"
                  disabled={sending || !replyText.trim()}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '0 1.25rem' }}
                >
                  <Send size={16} /> Reply
                </button>
              </form>

            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default BusinessEnquiries;
