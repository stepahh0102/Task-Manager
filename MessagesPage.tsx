import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { messagesAPI } from '../api';
import { UserList } from '../components/Messages/UserList';
import { Loader } from '../components/Common';
import { formatTime } from '../utils';

interface User {
  id: number;
  username: string;
  email: string;
}

interface Message {
  id: number;
  fromUserId: number;
  toUserId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  fromUser: User;
  toUser: User;
}

export const MessagesPage: React.FC = () => {
  const [dialogs, setDialogs] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [showUserList, setShowUserList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const loadDialogs = useCallback(async () => {
    try {
      const data = await messagesAPI.getDialogs() as unknown as any[];
      setDialogs(data);
    } catch (error) {
      console.error('Ошибка загрузки диалогов:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadConversation = useCallback(async (userId: number) => {
    setLoading(true);
    try {
      const data = await messagesAPI.getConversation(userId) as unknown as Message[];
      setMessages(data);
      await messagesAPI.markAsRead(userId);
    } catch (error) {
      console.error('Ошибка загрузки сообщений:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDialogs();
  }, [loadDialogs]);

  useEffect(() => {
    if (selectedUser) {
      loadConversation(selectedUser.id);
    }
  }, [selectedUser, loadConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || sending) return;

    setSending(true);
    try {
      await messagesAPI.send(selectedUser.id, newMessage);
      setNewMessage('');
      await loadConversation(selectedUser.id);
    } catch (error) {
      console.error('Ошибка отправки:', error);
      alert('Ошибка отправки сообщения');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setShowUserList(false);
  };

  if (loading && dialogs.length === 0) {
    return <Loader text="Загрузка диалогов..." />;
  }

  return (
    <div style={{ height: 'calc(100vh - 100px)', display: 'flex', background: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ width: '320px', borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #e0e0e0', background: '#f5f5f5' }}>
          <h3 style={{ margin: 0 }}>Диалоги</h3>
          <button
            onClick={() => setShowUserList(!showUserList)}
            style={{
              padding: '6px 12px',
              background: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Начать диалог
          </button>
        </div>
        {showUserList && (
          <div style={{ padding: '15px', borderBottom: '1px solid #e0e0e0', maxHeight: '300px', overflow: 'auto' }}>
            <UserList
              onSelectUser={handleSelectUser}
              currentUserId={currentUser?.id || 0}
            />
          </div>
        )}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {dialogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              Нет диалогов
            </div>
          ) : (
            dialogs.map((dialog: any) => (
              <div
                key={dialog.user.id}
                onClick={() => setSelectedUser(dialog.user)}
                style={{
                  padding: '15px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee',
                  background: selectedUser?.id === dialog.user.id ? '#e3f2fd' : 'white',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.background = selectedUser?.id === dialog.user.id ? '#e3f2fd' : 'white'}
              >
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
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  {dialog.lastMessage?.substring(0, 50)}...
                </div>
                <div style={{ fontSize: '10px', color: '#999', marginTop: '5px' }}>
                  {formatTime(dialog.lastMessageTime)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedUser ? (
          <>
            <div style={{
              padding: '15px',
              borderBottom: '1px solid #e0e0e0',
              background: '#f5f5f5'
            }}>
              <h3 style={{ margin: 0 }}>{selectedUser.username}</h3>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
              {messages.map((msg) => {
                const isMine = msg.fromUserId === currentUser?.id;
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: isMine ? 'flex-end' : 'flex-start',
                      marginBottom: '15px'
                    }}
                  >
                    <div style={{
                      maxWidth: '60%',
                      padding: '10px 15px',
                      borderRadius: '18px',
                      background: isMine ? '#667eea' : '#f0f0f0',
                      color: isMine ? 'white' : '#333'
                    }}>
                      <div>{msg.message}</div>
                      <div style={{
                        fontSize: '10px',
                        marginTop: '5px',
                        opacity: 0.7,
                        textAlign: 'right'
                      }}>
                        {formatTime(msg.createdAt)}
                        {isMine && msg.isRead && ' ✓✓'}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <div style={{ padding: '15px', borderTop: '1px solid #e0e0e0', display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Введите сообщение..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{
                  flex: 1,
                  padding: '10px 15px',
                  borderRadius: '25px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || sending}
                style={{
                  padding: '10px 25px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer'
                }}
              >
                {sending ? '...' : 'Отправить'}
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
            Выберите диалог или начните новый
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;