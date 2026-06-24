import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export const authAPI = {
  login: (data: { username: string; password: string }) => api.post('/auth/login', data),
  register: (data: { username: string; email: string; password: string }) => api.post('/auth/register', data),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, newPassword: string) => api.post('/auth/reset-password', { token, newPassword }),
};

export const tasksAPI = {
  getAll: () => api.get('/tasks'),
  create: (data: any) => api.post('/tasks', data),
  update: (id: number, data: any) => api.put(`/tasks/${id}`, data),
  delete: (id: number) => api.delete(`/tasks/${id}`),
  complete: (id: number) => api.patch(`/tasks/${id}/complete`),
  sendEmail: (id: number, email: string) => api.post(`/tasks/${id}/send-email`, { email }),
  getUsers: () => api.get('/tasks/users'),
};

export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getTasks: () => api.get('/admin/tasks'),
  deleteUser: (userId: number, currentUserId: number) => api.delete(`/admin/users/${userId}`, { data: { currentUserId } }),
  changeRole: (userId: number, role: string) => api.put(`/admin/users/${userId}/role`, { role }),
};

export const messagesAPI = {
  getDialogs: () => api.get('/messages/dialogs'),
  getConversation: (userId: number) => api.get(`/messages/conversation/${userId}`),
  send: (toUserId: number, message: string) => api.post('/messages/send', { toUserId, message }),
  markAsRead: (fromUserId: number) => api.post(`/messages/mark-read/${fromUserId}`),
  getUsers: () => api.get('/messages/users'),
};