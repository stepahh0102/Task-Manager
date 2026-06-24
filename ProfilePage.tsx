import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { api } from '../api';
import { setCredentials } from '../store/authSlice';
import { Card, Button, Input, Loader } from '../components/Common';
import { AvatarUpload } from '../components/Profile/AvatarUpload';

export const ProfilePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    phone: '',
    location: ''
  });
  const [stats, setStats] = useState({ totalTasks: 0, completedTasks: 0, completionRate: 0 });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: (user as any).bio || '',
        phone: (user as any).phone || '',
        location: (user as any).location || ''
      });
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const tasksData = await api.get('/tasks') as any;
      const allTasks = [
        ...(tasksData.pending || []),
        ...(tasksData.in_progress || []),
        ...(tasksData.completed || []),
        ...(tasksData.archived || [])
      ];
      const totalTasks = allTasks.length;
      const completedTasks = (tasksData.completed || []).length;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      setStats({ totalTasks, completedTasks, completionRate });
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put('/users/profile', formData);
      if (user) {
        const updatedUser = { ...user, ...formData };
        dispatch(setCredentials({ user: updatedUser, token: localStorage.getItem('token')! }));
        setMessage({ type: 'success', text: 'Профиль обновлён' });
        setIsEditing(false);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Ошибка обновления' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    const oldPassword = prompt('Введите текущий пароль:');
    if (!oldPassword) return;

    const newPassword = prompt('Введите новый пароль (мин. 3 символа):');
    if (!newPassword || newPassword.length < 3) {
      alert('Пароль должен быть минимум 3 символа');
      return;
    }

    const confirmPassword = prompt('Подтвердите новый пароль:');
    if (newPassword !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    setLoading(true);
    try {
      await api.post('/users/change-password', { oldPassword, newPassword });
      alert('Пароль успешно изменён!');
    } catch (error: any) {
      alert('Ошибка: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Loader text="Загрузка профиля..." />;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '28px', color: '#fff', marginBottom: '30px', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
        Мой профиль
      </h1>

      {message && (
        <div style={{
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          background: message.type === 'success' ? '#e8f5e9' : '#ffebee',
          color: message.type === 'success' ? '#2e7d32' : '#c62828'
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '280px' }}>
          <Card>
            <AvatarUpload
              currentAvatar={user.avatar}
              username={user.username}
              userId={user.id}
            />
          </Card>

          <Card title="Статистика" style={{ marginTop: '20px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span>Всего задач:</span>
                <strong style={{ color: '#667eea' }}>{stats.totalTasks}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span>Выполнено:</span>
                <strong style={{ color: '#4caf50' }}>{stats.completedTasks}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span>Прогресс:</span>
                <strong style={{ color: '#667eea' }}>{stats.completionRate}%</strong>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: '#e0e0e0',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${stats.completionRate}%`,
                  height: '100%',
                  background: '#4caf50',
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>
          </Card>
        </div>

        <div style={{ flex: '2', minWidth: '300px' }}>
          <Card
            title="Информация"
            actions={
              !isEditing && (
                <Button onClick={() => setIsEditing(true)} size="small">
                  Редактировать
                </Button>
              )
            }
          >
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <Input
                  name="username"
                  label="Имя пользователя"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
                <Input
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Input
                  name="bio"
                  label="О себе"
                  type="textarea"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                />
                <Input
                  name="phone"
                  label="Телефон"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Input
                  name="location"
                  label="Город"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <Button type="submit" variant="success" fullWidth disabled={loading}>
                    {loading ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="secondary" fullWidth>
                    Отмена
                  </Button>
                </div>
              </form>
            ) : (
              <div>
                <div style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                  <div style={{ color: '#999', fontSize: '12px' }}>Имя пользователя</div>
                  <div>{user.username}</div>
                </div>
                <div style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                  <div style={{ color: '#999', fontSize: '12px' }}>Email</div>
                  <div>{user.email}</div>
                </div>
                {(user as any).bio && (
                  <div style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                    <div style={{ color: '#999', fontSize: '12px' }}>О себе</div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{(user as any).bio}</div>
                  </div>
                )}
                {(user as any).phone && (
                  <div style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                    <div style={{ color: '#999', fontSize: '12px' }}>Телефон</div>
                    <div>{(user as any).phone}</div>
                  </div>
                )}
                {(user as any).location && (
                  <div style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                    <div style={{ color: '#999', fontSize: '12px' }}>Город</div>
                    <div>{(user as any).location}</div>
                  </div>
                )}
                <div style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                  <div style={{ color: '#999', fontSize: '12px' }}>Роль</div>
                  <div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      background: user.role === 'admin' ? '#ff9800' : '#4caf50',
                      color: 'white',
                      fontSize: '12px'
                    }}>
                      {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                    </span>
                  </div>
                </div>
                <div style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                  <div style={{ color: '#999', fontSize: '12px' }}>Дата регистрации</div>
                  <div>{new Date(user.createdAt).toLocaleDateString('ru-RU')}</div>
                </div>
                {user.lastLogin && (
                  <div style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                    <div style={{ color: '#999', fontSize: '12px' }}>Последний вход</div>
                    <div>{new Date(user.lastLogin).toLocaleString('ru-RU')}</div>
                  </div>
                )}
              </div>
            )}

            <Button onClick={handleChangePassword} variant="warning" fullWidth style={{ marginTop: '20px' }}>
              Сменить пароль
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;