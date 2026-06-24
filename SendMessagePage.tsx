import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, messagesAPI } from '../api';
import { Button, Input, Card, Loader } from '../components/Common';

interface User {
    id: number;
    username: string;
    email: string;
}

export const SendMessagePage: React.FC = () => {
const { userId } = useParams();
const navigate = useNavigate();
const [user, setUser] = useState<User | null>(null);
const [message, setMessage] = useState('');
const [sending, setSending] = useState(false);
const [loading, setLoading] = useState(true);

const loadUser = useCallback(async () => {
    try {
        const users = await api.get('/admin/users') as User[];
        const found = users.find((u: User) => u.id === parseInt(userId!));
        setUser(found || null);
    } catch (error) {
        console.error('Ошибка загрузки пользователя:', error);
    } finally {
        setLoading(false);
    }
}, [userId]);

useEffect(() => {
    if (userId) {
        loadUser();
    }
}, [userId, loadUser]);

const handleSend = async () => {
    if (!message.trim() || !user) return;

    setSending(true);
    try {
        await messagesAPI.send(user.id, message);
        alert('Сообщение отправлено!');
        navigate('/messages');
    } catch (error) {
        alert('Ошибка отправки');
    } finally {
        setSending(false);
    }
};

if (loading) {
    return <Loader text="Загрузка..." />;
}

if (!user) {
    return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Пользователь не найден</h2>
        <Button onClick={() => navigate('/admin')}>Вернуться в админку</Button>
    </div>
    );
}

return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <Card title="Новое сообщение">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            color: 'white',
            margin: '0 auto 15px'
        }}>
            {user.username?.charAt(0).toUpperCase()}
            </div>
            <h2 style={{ margin: 0 }}>{user.username}</h2>
            <p style={{ color: '#666', marginTop: '5px' }}>{user.email}</p>
        </div>

        <Input
            name="message"
            label="Сообщение"
            type="textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Введите ваше сообщение..."
            rows={6}
        />

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <Button onClick={() => navigate('/admin')} variant="secondary" fullWidth>
            Отмена
        </Button>
        <Button onClick={handleSend} variant="primary" fullWidth disabled={sending || !message.trim()}>
            {sending ? 'Отправка...' : 'Отправить сообщение'}
        </Button>
        </div>
    </Card>
    </div>
    );
};