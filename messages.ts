import { api } from './config';

export const messagesAPI = {
  getDialogs: () => api.get('/messages/dialogs'),
  getConversation: (userId: number) => api.get(`/messages/conversation/${userId}`),
  send: (toUserId: number, message: string) =>
    api.post('/messages/send', { toUserId, message }),
  markAsRead: (fromUserId: number) => api.post(`/messages/mark-read/${fromUserId}`),
  getUsers: () => api.get('/messages/users'),
};