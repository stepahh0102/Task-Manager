import React from 'react';
import { formatTime } from '../../utils';

interface MessageBubbleProps {
  message: string;
  isMine: boolean;
  createdAt: string;
  isRead?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isMine,
  createdAt,
  isRead
}) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: isMine ? 'flex-end' : 'flex-start',
      marginBottom: '15px'
    }}>
      <div style={{
        maxWidth: '70%',
        padding: '10px 15px',
        borderRadius: '18px',
        background: isMine ? '#667eea' : '#f0f0f0',
        color: isMine ? 'white' : '#333'
      }}>
        <div style={{ wordWrap: 'break-word' }}>{message}</div>
        <div style={{
          fontSize: '10px',
          marginTop: '5px',
          opacity: 0.7,
          textAlign: 'right'
        }}>
          {formatTime(createdAt)}
          {isMine && isRead && ' ✓✓'}
        </div>
      </div>
    </div>
  );
};