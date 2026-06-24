import React from 'react';
import { Avatar } from './Avatar';
import { formatTime } from '../../utils';

interface DialogItemProps {
  dialog: {
    user: { id: number; username: string; email: string; lastLogin?: string };
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
  };
  isSelected: boolean;
  onSelect: () => void;
}

export const DialogItem: React.FC<DialogItemProps> = ({ dialog, isSelected, onSelect }) => {
  const isOnline = dialog.user.lastLogin
    ? new Date(dialog.user.lastLogin).getTime() > Date.now() - 5 * 60 * 1000
    : false;

  return (
    <div
      onClick={onSelect}
      style={{
        padding: '15px',
        cursor: 'pointer',
        borderBottom: '1px solid #eee',
        background: isSelected ? '#f0f0f0' : 'white',
        transition: 'background 0.2s'
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
      onMouseLeave={(e) => e.currentTarget.style.background = isSelected ? '#f0f0f0' : 'white'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ position: 'relative' }}>
          <Avatar name={dialog.user.username} size={45} />
          <div style={{
            position: 'absolute',
            bottom: 2,
            right: 2,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: isOnline ? '#4caf50' : '#9e9e9e',
            border: '2px solid white'
          }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>{dialog.user.username}</strong>
            {dialog.unreadCount > 0 && (
              <span style={{
                background: '#f44336',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 8px',
                fontSize: '11px'
              }}>
                {dialog.unreadCount}
              </span>
            )}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            {dialog.lastMessage?.substring(0, 40)}...
          </div>
          <div style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>
            {formatTime(dialog.lastMessageTime)}
          </div>
        </div>
      </div>
    </div>
  );
};