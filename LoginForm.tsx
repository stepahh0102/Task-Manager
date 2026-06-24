import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(username, password);
    if (!result.success) {
      setError(result.error || 'Ошибка входа');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        width: '350px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Вход в Task Manager</h2>

        {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '12px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <Link to="/register" style={{ color: '#667eea', textDecoration: 'none' }}>Нет аккаунта? Зарегистрироваться</Link>
        </div>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Link to="/forgot-password" style={{ color: '#999', textDecoration: 'none', fontSize: '14px' }}>Забыли пароль?</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;