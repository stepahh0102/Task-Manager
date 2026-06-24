import { api } from './config';

export const tasksAPI = {
  getAll: () => api.get('/tasks'),
  create: (data: any) => api.post('/tasks', data),
  update: (id: number, data: any) => api.put(`/tasks/${id}`, data),
  delete: (id: number) => api.delete(`/tasks/${id}`),
  complete: (id: number) => api.patch(`/tasks/${id}/complete`),
  sendEmail: (id: number, email: string) =>
    api.post(`/tasks/${id}/send-email`, { email }),
  getUsers: () => api.get('/tasks/users'),
};