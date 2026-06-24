import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

const variantStyles = {
  primary: { background: '#667eea', color: 'white' },
  secondary: { background: '#999', color: 'white' },
  danger: { background: '#f44336', color: 'white' },
  success: { background: '#4caf50', color: 'white' },
  warning: { background: '#ff9800', color: 'white' }
};

const sizeStyles = {
  small: { padding: '6px 12px', fontSize: '12px' },
  medium: { padding: '10px 20px', fontSize: '14px' },
  large: { padding: '12px 24px', fontSize: '16px' }
};

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  type = 'button',
  fullWidth = false,
  style = {}
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        border: 'none',
        borderRadius: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        width: fullWidth ? '100%' : 'auto',
        transition: 'transform 0.2s, opacity 0.2s',
        ...style
      }}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseLeave={(e) => !disabled && (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {children}
    </button>
  );
};