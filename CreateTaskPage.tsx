import React from 'react';
import { useNavigate } from 'react-router-dom';
import { tasksAPI } from '../api';
import { useForm } from '../hooks';

interface TaskFormValues {
  title: string;
  description: string;
  priority: 1 | 2 | 3;
  dueDate: string;
}

export const CreateTaskPage: React.FC = () => {
  const navigate = useNavigate();

  const validate = (values: TaskFormValues) => {
    const errors: Record<string, string> = {};
    if (!values.title.trim()) {
      errors.title = 'Название задачи обязательно';
    }
    if (values.title.length > 255) {
      errors.title = 'Название не должно превышать 255 символов';
    }
    return errors;
  };

  const handleSubmit = async (values: TaskFormValues) => {
    try {
      await tasksAPI.create({
        ...values,
        dueDate: values.dueDate || null,
        status: 'pending'
      });
      alert('Задача успешно создана!');
      navigate('/tasks');
    } catch (error) {
      alert('Ошибка создания задачи');
    }
  };

  const { values, errors, isSubmitting, handleChange, handleSubmit: onSubmit } = useForm<TaskFormValues>({
    initialValues: {
      title: '',
      description: '',
      priority: 1,
      dueDate: ''
    },
    validate,
    onSubmit: handleSubmit
  });

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '28px', color: '#fff', marginBottom: '24px' }}>Создать задачу</h1>
      <form onSubmit={onSubmit} style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '30px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: 500 }}>Название задачи *</label>
          <input
            type="text"
            name="title"
            placeholder="Введите название"
            value={values.title}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${errors.title ? '#f44336' : '#ddd'}`,
              fontSize: '14px'
            }}
          />
          {errors.title && <div style={{ color: '#f44336', fontSize: '12px', marginTop: '5px' }}>{errors.title}</div>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: 500 }}>Описание</label>
          <textarea
            name="description"
            placeholder="Опишите задачу..."
            value={values.description}
            onChange={handleChange}
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: 500 }}>Приоритет</label>
          <select
            name="priority"
            value={values.priority}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '14px',
              background: '#fff'
            }}
          >
            <option value={1}>Низкий приоритет</option>
            <option value={2}>Средний приоритет</option>
            <option value={3}>Высокий приоритет</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: 500 }}>Срок выполнения</label>
          <input
            type="date"
            name="dueDate"
            value={values.dueDate}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '14px'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '12px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 500
          }}
        >
          {isSubmitting ? 'Создание...' : 'Создать задачу'}
        </button>
      </form>
    </div>
  );
};

export default CreateTaskPage;