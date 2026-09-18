import React from 'react';

export const Spinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeMap = {
    small: '24px',
    medium: '40px',
    large: '60px',
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem',
      gap: '1rem',
      width: '100%',
    }}>
      <div
        style={{
          width: sizeMap[size] || '40px',
          height: sizeMap[size] || '40px',
          border: '3px solid rgba(79, 70, 229, 0.2)',
          borderTop: '3px solid #4f46e5',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {text && <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>{text}</span>}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div
      className="glass-panel"
      style={{
        height: '320px',
        overflow: 'hidden',
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div style={{ height: '160px', background: 'rgba(255, 255, 255, 0.05)', animation: 'pulse 1.5s infinite' }} />
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ width: '40%', height: '14px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px' }} />
        <div style={{ width: '80%', height: '20px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px' }} />
        <div style={{ width: '100%', height: '14px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px' }} />
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.2; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default Spinner;
