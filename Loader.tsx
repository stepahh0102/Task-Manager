import React from 'react';

interface LoaderProps {
  size?: number;
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 40, text = 'Загрузка...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '50px',
      color: '#fff'
    }}>
      <div style={{
        width: size,
        height: size,
        border: `4px solid rgba(255,255,255,0.3)`,
        borderTop: `4px solid #fff`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      {text && <p style={{ marginTop: '15px', opacity: 0.8 }}>{text}</p>}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};