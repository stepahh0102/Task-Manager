export const priorityColors: Record<number, string> = {
  1: '#4caf50',
  2: '#ff9800',
  3: '#f44336',
};

export const priorityText: Record<number, string> = {
  1: 'Низкий',
  2: 'Средний',
  3: 'Высокий',
};

export const getPriorityColor = (priority: number): string => {
  return priorityColors[priority] || '#666';
};

export const getPriorityText = (priority: number): string => {
  return priorityText[priority] || 'Неизвестно';
};
