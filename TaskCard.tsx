import React from 'react';
import { tasksAPI } from '../../api';
import { Task } from '../../types';
import { getPriorityColor, getPriorityText, getStatusText } from '../../utils';

interface TaskCardProps {
  task: Task;
  onTaskUpdate: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskUpdate }) => {
  const handleComplete = async () => {
    if (task.status === 'completed') return;
    await tasksAPI.complete(task.id);
    onTaskUpdate();
  };

  const handleDelete = async () => {
    if (window.confirm('Удалить задачу?')) {
      await tasksAPI.delete(task.id);
      onTaskUpdate();
    }
  };

  const handleToggleFavorite = async () => {
    await tasksAPI.update(task.id, { isFavorite: !task.isFavorite });
    onTaskUpdate();
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px',
      background: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={task.status === 'completed'}
            onChange={handleComplete}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
          <h3 style={{ margin: 0, textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
            {task.title}
          </h3>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleToggleFavorite} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>
            {task.isFavorite ? '⭐' : '☆'}
          </button>
          <button onClick={handleDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f44336', fontSize: '18px' }}>
            🗑️
          </button>
        </div>
      </div>

      {task.description && (
        <p style={{ margin: '8px 0', color: '#666', fontSize: '14px', marginLeft: '28px' }}>
          {task.description}
        </p>
      )}

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', marginLeft: '28px' }}>
        <span style={{ background: getPriorityColor(task.priority), color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>
          {getPriorityText(task.priority)}
        </span>
        <span style={{ background: '#e0e0e0', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', color: '#333' }}>
          {getStatusText(task.status)}
        </span>
        {task.dueDate && (
          <span style={{ background: '#fff3e0', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', color: '#333' }}>
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;