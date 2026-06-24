import React, { useState } from 'react';
import { Button } from './Button';

interface MessageInputProps {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || sending) return;
    setSending(true);
    await onSend(message);
    setMessage('');
    setSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ padding: '15px', borderTop: '1px solid #ddd', display: 'flex', gap: '10px' }}>
      <input
        type="text"
        placeholder="Введите сообщение..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled || sending}
        style={{
          flex: 1,
          padding: '10px 15px',
          borderRadius: '25px',
          border: '1px solid #ddd',
          fontSize: '14px',
          outline: 'none'
        }}
      />
      <Button
        onClick={handleSend}
        disabled={!message.trim() || sending || disabled}
        size="small"
      >
        {sending ? '...' : 'Отправить'}
      </Button>
    </div>
  );
};