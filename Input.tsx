import React from 'react';

interface InputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'date' | 'textarea' | 'select';
  placeholder?: string;
  error?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
}

export const Input: React.FC<InputProps> = ({
  name,
  value,
  onChange,
  label,
  type = 'text',
  placeholder,
  error,
  required,
  options,
  rows = 4
}) => {
  const commonStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: `1px solid ${error ? '#f44336' : '#ddd'}`,
    fontSize: '14px',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const
  };

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            style={commonStyle}
          />
        );
      case 'select':
        return (
          <select name={name} value={value} onChange={onChange} style={commonStyle}>
            {options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={commonStyle}
          />
        );
    }
  };

  return (
    <div style={{ marginBottom: '15px' }}>
      {label && (
        <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: 500 }}>
          {label} {required && <span style={{ color: '#f44336' }}>*</span>}
        </label>
      )}
      {renderInput()}
      {error && <div style={{ color: '#f44336', fontSize: '12px', marginTop: '5px' }}>{error}</div>}
    </div>
  );
};