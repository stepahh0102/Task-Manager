import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { api } from '../api';
import { Card, Loader, EmptyState } from '../components/Common';
import { StatsCard } from '../components/Dashboard/StatsCard';
import { RecentTaskItem } from '../components/Dashboard/RecentTaskItem';
import { QuickActions } from '../components/Dashboard/QuickActions';

export const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, urgent: 0 });
  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.get('/tasks') as any;
      const allTasks = [
        ...(data.pending || []),
        ...(data.in_progress || []),
        ...(data.completed || []),
        ...(data.archived || [])
      ];

      const pending = data.pending || [];
      const inProgress = data.in_progress || [];
      const completed = data.completed || [];

      setStats({
        total: allTasks.length,
        completed: completed.length,
        inProgress: pending.length + inProgress.length,
        urgent: pending.filter((t: any) => t.priority === 3).length
      });

      setRecentTasks(allTasks.slice(0, 5));
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    { path: '/tasks', icon: '', title: 'Мои задачи', color: '#667eea', desc: 'Управляй своими задачами' },
    { path: '/tasks/new', icon: '', title: 'Создать задачу', color: '#4caf50', desc: 'Добавить новую задачу' },
    { path: '/messages', icon: '', title: 'Сообщения', color: '#ff9800', desc: 'Чат с коллегами' },
    ...(user?.role === 'admin' ? [{ path: '/admin', icon: '', title: 'Админ панель', color: '#f44336', desc: 'Управление системой' }] : [])
  ];

  if (loading) {
    return <Loader text="Загрузка дашборда..." />;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', color: '#fff', marginBottom: '8px', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
          Добро пожаловать, {user?.username}!
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.9)' }}>Вот что происходит с вашими задачами сегодня</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <StatsCard icon="" title="Всего задач" value={stats.total} color="#667eea" />
        <StatsCard icon="" title="Выполнено" value={stats.completed} color="#4caf50" />
        <StatsCard icon="" title="В работе" value={stats.inProgress} color="#ff9800" />
        <StatsCard icon="" title="Срочных" value={stats.urgent} color="#f44336" />
      </div>

      <Card title="Последние задачи" style={{ marginBottom: '32px' }}>
        {recentTasks.length === 0 ? (
          <EmptyState
            title="Нет задач"
            message="Создайте свою первую задачу"
            actionText="Создать задачу"
            actionLink="/tasks/new"
          />
        ) : (
          recentTasks.map(task => <RecentTaskItem key={task.id} task={task} />)
        )}
        {recentTasks.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <a href="/tasks" style={{ color: '#667eea', textDecoration: 'none' }}>Все задачи →</a>
          </div>
        )}
      </Card>

      <QuickActions actions={actions} />
    </div>
  );
};

export default Dashboard;