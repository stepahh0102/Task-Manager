import { useState, useCallback } from 'react';
import { messagesAPI } from '../api';

interface User {
  id: number;
  username: string;
  email: string;
}

interface Message {
  id: number;
  fromUserId: number;
  toUserId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  fromUser: User;
  toUser: User;
}

interface Dialog {
  user: User;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export const useMessages = () => {
  const [dialogs, setDialogs] = useState<Dialog[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const loadDialogs = useCallback(async () => {
    try {
      const data = await messagesAPI.getDialogs() as unknown as Dialog[];
      setDialogs(data);
    } catch (error) {
      console.error('Ошибка загрузки диалогов:', error);
    }
  }, []);

  const loadConversation = useCallback(async (userId: number) => {
    setLoading(true);
    try {
      const data = await messagesAPI.getConversation(userId) as unknown as Message[];
      setMessages(data);
      await messagesAPI.markAsRead(userId);
      await loadDialogs();
    } catch (error) {
      console.error('Ошибка загрузки сообщений:', error);
    } finally {
      setLoading(false);
    }
  }, [loadDialogs]);

  const sendMessage = async (toUserId: number, message: string) => {
    try {
      await messagesAPI.send(toUserId, message);
      await loadConversation(toUserId);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    dialogs,
    messages,
    loading,
    loadDialogs,
    loadConversation,
    sendMessage,
  };
};