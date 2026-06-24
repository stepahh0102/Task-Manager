import { useState, useCallback } from 'react';
import { adminAPI } from '../api';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  lastLogin?: string;
}

export const useAdmin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getUsers() as unknown as User[];
      setUsers(data);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getTasks() as unknown as any[];
      setTasks(data);
    } catch (error) {
      console.error('Ошибка загрузки задач:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const changeUserRole = async (userId: number, newRole: string) => {
    try {
      await adminAPI.changeRole(userId, newRole);
      await loadUsers();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const deleteUser = async (userId: number, currentUserId: number) => {
    try {
      await adminAPI.deleteUser(userId, currentUserId);
      await loadUsers();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    users,
    tasks,
    loading,
    loadUsers,
    loadTasks,
    changeUserRole,
    deleteUser,
  };
};