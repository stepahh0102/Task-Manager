export const statusColors: Record<string, string> = {
  pending: '#f44336',
  in_progress: '#2196f3',
  completed: '#4caf50',
  archived: '#9e9e9e',
};

export const statusText: Record<string, string> = {
  pending: 'Не решена',
  in_progress: 'В работе',
  completed: 'Выполнена',
  archived: 'Архив',
};

export const getStatusColor = (status: string): string => {
  return statusColors[status] || '#666';
};

export const getStatusText = (status: string): string => {
  return statusText[status] || status;
};