import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  message: string;
  actionText?: string;
  actionLink?: string;
  icon?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionText,
  actionLink,
  icon = '📋'
}) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '60px 20px',
      background: 'rgba(255,255,255,0.95)',
      borderRadius: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>{icon}</div>
      <h2 style={{ color: '#333', marginBottom: '10px' }}>{title}</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>{message}</p>
      {actionText && actionLink && (
        <Link to={actionLink} style={{
          padding: '10px 24px',
          background: '#667eea',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          display: 'inline-block'
        }}>
          {actionText}
        </Link>
      )}
    </div>
  );
};