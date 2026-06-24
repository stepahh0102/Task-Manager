import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div style={{
      display: 'flex',
      gap: '4px',
      borderBottom: '1px solid #e0e0e0',
      marginBottom: '20px'
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            padding: '10px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === tab.id ? '2px solid #667eea' : 'none',
            color: activeTab === tab.id ? '#667eea' : '#666',
            cursor: 'pointer',
            fontWeight: activeTab === tab.id ? 'bold' : 'normal',
            transition: 'all 0.2s'
          }}
        >
          {tab.icon && <span style={{ marginRight: '8px' }}>{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
};