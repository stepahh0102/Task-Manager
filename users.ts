import { api } from './config';

export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  changePassword: (oldPassword: string, newPassword: string) =>
    api.post('/users/change-password', { oldPassword, newPassword }),
};