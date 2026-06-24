export const APP_NAME = 'Task Manager';
export const APP_VERSION = '1.0.0';

export const TABS = {
  tasks: [
    { id: 'pending', label: 'Не решённые', color: '#f44336' },
    { id: 'in_progress', label: 'В работе', color: '#2196f3' },
    { id: 'completed', label: 'Выполненные', color: '#4caf50' },
    { id: 'archived', label: 'Архив', color: '#9e9e9e' },
  ],
  admin: [
    { id: 'users', label: 'Пользователи' },
    { id: 'tasks', label: 'Задачи' },
    { id: 'logs', label: 'Логи' },
  ],
};

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024,
  ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
};