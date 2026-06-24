import React from 'react';
import { TaskCard } from './TaskCard';
import { Task } from '../../types';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: () => void;
  title: string;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskUpdate, title }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
        Нет задач в категории "{title}"
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ marginBottom: '16px', color: '#333' }}>{title} ({tasks.length})</h3>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} onTaskUpdate={onTaskUpdate} />
      ))}
    </div>
  );
};

export default TaskList;