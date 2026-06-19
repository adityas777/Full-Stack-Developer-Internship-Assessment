import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({ toast, removeToast }) {
  const { id, type, message } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, 4500);

    return () => clearTimeout(timer);
  }, [id, removeToast]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} color="var(--accent-green)" />;
      case 'error':
        return <AlertCircle size={20} color="var(--accent-red)" />;
      default:
        return <Info size={20} color="var(--accent-purple)" />;
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '12px' }}>
        {getIcon()}
        <span style={{ fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.4 }}>
          {message}
        </span>
      </div>
      <button
        onClick={() => removeToast(id)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
      >
        <X size={16} />
      </button>
    </div>
  );
}
