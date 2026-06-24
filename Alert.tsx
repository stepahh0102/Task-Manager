import React, { useEffect } from 'react';

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
  duration?: number;
}

export const Alert: React.FC<AlertProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const colors = {
    success: { bg: '#e8f5e9', text: '#2e7d32', border: '#4caf50' },
    error: { bg: '#ffebee', text: '#c62828', border: '#f44336' },
    info: { bg: '#e3f2fd', text: '#1565c0', border: '#2196f3' },
    warning: { bg: '#fff3e0', text: '#ef6c00', border: '#ff9800' }
  };

  const color = colors[type];

  return (
    <div style={{
      padding: '12px 16px',
      borderRadius: '8px',
      background: color.bg,
      color: color.text,
      borderLeft: `4px solid ${color.border}`,
      marginBottom: '16px'
    }}>
      {message}
      {onClose && (
        <button
          onClick={onClose}
          style={{
            float: 'right',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            color: color.text
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};