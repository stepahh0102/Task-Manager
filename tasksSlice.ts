import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../types';

interface TasksState {
  tasks: {
    pending: Task[];
    in_progress: Task[];
    completed: Task[];
    archived: Task[];
  };
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: {
    pending: [],
    in_progress: [],
    completed: [],
    archived: [],
  },
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<any>) => {
      state.tasks = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      const task = action.payload;
      state.tasks[task.status].push(task);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const updatedTask = action.payload;
      for (const status of Object.keys(state.tasks) as Array<keyof typeof state.tasks>) {
        const index = state.tasks[status].findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          state.tasks[status].splice(index, 1);
          break;
        }
      }
      state.tasks[updatedTask.status].push(updatedTask);
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      const taskId = action.payload;
      for (const status of Object.keys(state.tasks) as Array<keyof typeof state.tasks>) {
        state.tasks[status] = state.tasks[status].filter(t => t.id !== taskId);
      }
    },
  },
});

export const { setTasks, setLoading, setError, addTask, updateTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;