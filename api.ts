export const API_BASE_URL = 'http://localhost:3000/api';
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  TASKS: {
    BASE: '/tasks',
    USERS: '/tasks/users',
    COMPLETE: (id: number) => `/tasks/${id}/complete`,
    SEND_EMAIL: (id: number) => `/tasks/${id}/send-email`,
  },
  ADMIN: {
    USERS: '/admin/users',
    TASKS: '/admin/tasks',
    USER_ROLE: (id: number) => `/admin/users/${id}/role`,
  },
  MESSAGES: {
    DIALOGS: '/messages/dialogs',
    CONVERSATION: (id: number) => `/messages/conversation/${id}`,
    SEND: '/messages/send',
    MARK_READ: (id: number) => `/messages/mark-read/${id}`,
    USERS: '/messages/users',
  },
  UPLOAD: {
    AVATAR: '/upload/avatar',
  },
};