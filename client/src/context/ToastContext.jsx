import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur),
    info: (msg, dur) => addToast(msg, 'info', dur),
    warning: (msg, dur) => addToast(msg, 'warning', dur),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Floating Toast Notification Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          pointerEvents: 'none',
          maxWidth: '420px',
          width: 'calc(100vw - 48px)',
        }}
      >
        {toasts.map((item) => {
          let bg = '#1e1b4b';
          let border = '#6366f1';
          let Icon = Info;
          let iconColor = '#818cf8';

          if (item.type === 'success') {
            bg = '#064e3b';
            border = '#10b981';
            Icon = CheckCircle2;
            iconColor = '#34d399';
          } else if (item.type === 'error') {
            bg = '#7f1d1d';
            border = '#ef4444';
            Icon = AlertCircle;
            iconColor = '#f87171';
          } else if (item.type === 'warning') {
            bg = '#78350f';
            border = '#f59e0b';
            Icon = AlertTriangle;
            iconColor = '#fbbf24';
          }

          return (
            <div
              key={item.id}
              style={{
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                padding: '14px 18px',
                borderRadius: '12px',
                background: bg,
                border: `1px solid ${border}`,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
                color: '#ffffff',
                fontSize: '0.92rem',
                fontWeight: 500,
                backdropFilter: 'blur(10px)',
                animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={20} color={iconColor} style={{ flexShrink: 0 }} />
                <span>{item.message}</span>
              </div>
              <button
                onClick={() => removeToast(item.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                }}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
