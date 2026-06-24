import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api';

interface Log {
  id: number;
  username: string;
  action: string;
  entity: string;
  entityId: number;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get('/logs') as Log[];
      setLogs(data);
    } catch (error) {
      console.error('Ошибка загрузки логов:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('ru-RU');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px', color: '#fff' }}>Загрузка...</div>;
  }

  return (
    <div>
      <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '16px' }}>История действий</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Дата</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Пользователь</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Действие</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Объект</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>IP</th>
              </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px', fontSize: '12px', color: '#666' }}>{formatDate(log.createdAt)}</td>
                <td style={{ padding: '12px', fontWeight: 500 }}>{log.username}</td>
                <td style={{ padding: '12px' }}>{log.action}</td>
                <td style={{ padding: '12px' }}>{log.entity} #{log.entityId}</td>
                <td style={{ padding: '12px', fontSize: '12px', color: '#666' }}>{log.ipAddress || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Нет записей</div>
        )}
      </div>
    </div>
  );
};

export default LogsPage;