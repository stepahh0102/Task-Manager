import { api } from './config';

export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getTasks: () => api.get('/admin/tasks'),
  deleteUser: (userId: number, currentUserId: number) => 
    api.delete(`/admin/users/${userId}`, { data: { currentUserId } }),
  changeRole: (userId: number, role: string) => 
    api.put(`/admin/users/${userId}/role`, { role }),
};