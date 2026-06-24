import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../api';
import { LogsPage } from './LogsPage';
import { Card, Button, DataTable, Loader } from '../components/Common';
import { formatDateTime } from '../utils';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const usersData = await adminAPI.getUsers() as unknown as any[];
      const tasksData = await adminAPI.getTasks() as unknown as any[];
      setUsers(usersData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (userId: number, newRole: string) => {
    try {
      await adminAPI.changeRole(userId, newRole);
      setMessage(`Роль изменена на ${newRole}`);
      loadData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Ошибка изменения роли');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser.id === userId) {
      setMessage('Нельзя удалить самого себя');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (!window.confirm('Удалить пользователя?')) return;

    try {
      await adminAPI.deleteUser(userId, currentUser.id);
      setMessage('Пользователь удалён');
      loadData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Ошибка удаления');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const userColumns = [
    { key: 'id', header: 'ID' },
    { key: 'username', header: 'Имя' },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Роль',
      render: (value: string) => (
        <span style={{
          padding: '4px 12px',
          borderRadius: '20px',
          background: value === 'admin' ? '#ff9800' : '#4caf50',
          color: 'white',
          fontSize: '12px'
        }}>
          {value === 'admin' ? 'Админ' : 'Пользователь'}
        </span>
      )
    },
    {
      key: 'lastLogin',
      header: 'Последний вход',
      render: (value: string) => formatDateTime(value)
    },
    {
      key: 'actions',
      header: 'Действия',
      render: (_: any, row: any) => (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate(`/send-message/${row.id}`)}
            style={{ padding: '6px 12px', background: '#2196f3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
          >
            💬 Написать
          </button>
          {row.role !== 'admin' && (
            <button onClick={() => handleChangeRole(row.id, 'admin')} style={{ padding: '6px 12px', background: '#ff9800', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
              Сделать админом
            </button>
          )}
          {row.role !== 'user' && (
            <button onClick={() => handleChangeRole(row.id, 'user')} style={{ padding: '6px 12px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
              Сделать пользователем
            </button>
          )}
          <button onClick={() => handleDeleteUser(row.id)} style={{ padding: '6px 12px', background: '#f44336', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
            Удалить
          </button>
        </div>
      )
    }
  ];

  const taskColumns = [
    { key: 'id', header: 'ID' },
    { key: 'title', header: 'Название' },
    { key: 'status', header: 'Статус' },
    { key: 'user', header: 'Пользователь', render: (value: any) => value?.username || '-' }
  ];

  if (loading) {
    return <Loader text="Загрузка админ панели..." />;
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '28px', color: '#fff', marginBottom: '24px' }}>Админ панель</h1>

      {message && (
        <div style={{ padding: '12px', borderRadius: '8px', marginBottom: '20px', background: '#e8f5e9', color: '#2e7d32' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <Button variant={activeTab === 'users' ? 'primary' : 'secondary'} onClick={() => setActiveTab('users')}>
          Пользователи ({users.length})
        </Button>
        <Button variant={activeTab === 'tasks' ? 'primary' : 'secondary'} onClick={() => setActiveTab('tasks')}>
          Задачи ({tasks.length})
        </Button>
        <Button variant={activeTab === 'logs' ? 'primary' : 'secondary'} onClick={() => setActiveTab('logs')}>
          Логи
        </Button>
      </div>

      {activeTab === 'users' && (
        <Card title="Пользователи">
          <DataTable columns={userColumns} data={users} />
        </Card>
      )}

      {activeTab === 'tasks' && (
        <Card title="Все задачи">
          <DataTable columns={taskColumns} data={tasks.slice(0, 20)} />
          {tasks.length > 20 && (
            <div style={{ textAlign: 'center', padding: '15px', color: '#666' }}>
              Показаны первые 20 задач из {tasks.length}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'logs' && <LogsPage />}
    </div>
  );
};

export default AdminPage;