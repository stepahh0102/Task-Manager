import React from 'react';

interface AvatarProps {
  name: string;
  avatar?: string | null;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ name, avatar, size = 40 }) => {
  const getInitials = () => {
    return name.charAt(0).toUpperCase();
  };

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover'
        }}
      />
    );
  }

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: size * 0.4
    }}>
      {getInitials()}
    </div>
  );
};