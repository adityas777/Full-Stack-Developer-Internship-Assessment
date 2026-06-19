import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', isDanger = false }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div 
        className="modal-content glass-card" 
        onClick={(e) => e.stopPropagation()}
        style={{
          borderTop: isDanger ? '4px solid var(--accent-red)' : '4px solid var(--accent-purple)',
        }}
      >
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <div style={{
            background: isDanger ? 'rgba(244, 63, 94, 0.1)' : 'rgba(139, 92, 246, 0.1)',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <AlertTriangle size={24} color={isDanger ? 'var(--accent-red)' : 'var(--accent-purple)'} />
          </div>

          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
              {title}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
              {message}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button 
            className="btn btn-secondary" 
            onClick={onCancel}
            style={{ padding: '10px 20px' }}
          >
            {cancelText}
          </button>
          <button 
            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`} 
            onClick={onConfirm}
            style={{ padding: '10px 20px' }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
