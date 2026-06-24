import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setTasks, setLoading, setError, addTask } from '../store/tasksSlice';
import { tasksAPI } from '../api';
import { Task } from '../types';

export const useTasks = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const [filter, setFilter] = useState({ search: '', priority: 'all', status: 'pending' });

  const loadTasks = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const data = await tasksAPI.getAll();
      dispatch(setTasks(data));
    } catch (err: any) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const createTask = async (taskData: Partial<Task>) => {
    try {
      const task = await tasksAPI.create(taskData) as unknown as Task;
      dispatch(addTask(task));
      await loadTasks();
      return { success: true, task };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateTask = async (id: number, taskData: Partial<Task>) => {
    try {
      await tasksAPI.update(id, taskData);
      await loadTasks();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const removeTask = async (id: number) => {
    try {
      await tasksAPI.delete(id);
      await loadTasks();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const completeTask = async (id: number) => {
    try {
      await tasksAPI.complete(id);
      await loadTasks();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const getFilteredTasks = useCallback(() => {
    let filtered = [...(tasks[filter.status as keyof typeof tasks] || [])];

    if (filter.search) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(filter.search.toLowerCase())
      );
    }
    if (filter.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === Number(filter.priority));
    }

    return filtered;
  }, [tasks, filter]);

  return {
    tasks,
    loading,
    error,
    filter,
    setFilter,
    loadTasks,
    createTask,
    updateTask,
    removeTask,
    completeTask,
    getFilteredTasks,
  };
};