import React from 'react';
import { Avatar } from './Avatar';
import { formatDateTime } from '../../utils';

interface ChatHeaderProps {
  user: { id: number; username: string; email: string; lastLogin?: string };
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ user }) => {
  const isOnline = user.lastLogin
    ? new Date(user.lastLogin).getTime() > Date.now() - 5 * 60 * 1000
    : false;

  const getStatusText = () => {
    if (isOnline) return 'В сети';
    if (user.lastLogin) return `Был(а) ${formatDateTime(user.lastLogin)}`;
    return 'Не в сети';
  };

  return (
    <div style={{
      padding: '15px',
      borderBottom: '1px solid #ddd',
      background: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <Avatar name={user.username} size={45} />
      <div>
        <h3 style={{ margin: 0 }}>{user.username}</h3>
        <div style={{
          fontSize: '12px',
          color: isOnline ? '#4caf50' : '#999',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          marginTop: '4px'
        }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: isOnline ? '#4caf50' : '#999',
            display: 'inline-block'
          }} />
          {getStatusText()}
        </div>
      </div>
    </div>
  );
};