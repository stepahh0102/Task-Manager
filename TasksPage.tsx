import React, { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { TaskCard } from '../components/Tasks/TaskCard';
import { Loader, EmptyState } from '../components/Common';
import { TABS } from '../constants';

type TabId = 'pending' | 'in_progress' | 'completed' | 'archived';

export const TasksPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<number | 'all'>('all');
  const { tasks, loading, loadTasks } = useTasks();

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const getFilteredTasks = () => {
    let filtered = [...(tasks[activeTab] || [])];
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }
    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  const tabs = TABS.tasks;

  if (loading) {
    return <Loader text="Загрузка задач..." />;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '28px', color: '#fff', marginBottom: '24px', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
        Мои задачи
      </h1>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: '12px 15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', background: '#fff', minWidth: '200px' }}
        />
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          style={{ padding: '12px 15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', minWidth: '150px', background: '#fff' }}
        >
          <option value="all">Все приоритеты</option>
          <option value={1}>Низкий</option>
          <option value={2}>Средний</option>
          <option value={3}>Высокий</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabId)}
            style={{
              padding: '10px 20px',
              background: activeTab === tab.id ? tab.color : 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              color: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.8)',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal'
            }}
          >
            {tab.label} ({tasks[tab.id as keyof typeof tasks]?.length || 0})
          </button>
        ))}
      </div>

      {searchTerm && <div style={{ marginBottom: '16px', color: 'rgba(255,255,255,0.8)' }}>Найдено задач: {filteredTasks.length}</div>}

      {filteredTasks.length === 0 ? (
        <EmptyState
          title={searchTerm ? 'Ничего не найдено' : 'Нет задач'}
          message={searchTerm ? 'Попробуйте изменить поисковый запрос' : 'Создайте свою первую задачу'}
          actionText="Создать задачу"
          actionLink="/tasks/new"
          icon={searchTerm ? '' : ''}
        />
      ) : (
        filteredTasks.map((task: any) => (
          <TaskCard key={task.id} task={task} onTaskUpdate={loadTasks} />
        ))
      )}
    </div>
  );
};

export default TasksPage;