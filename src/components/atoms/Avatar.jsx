import React from 'react';

const Avatar = ({ 
  name, 
  src, 
  color = 'blue', 
  size = 'md',
  className = '',
  showBorder = false 
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };
  
  const colors = {
    blue: 'bg-blue-500 text-white border-blue-500',
    pink: 'bg-pink-500 text-white border-pink-500',
    purple: 'bg-purple-500 text-white border-purple-500',
    green: 'bg-green-500 text-white border-green-500',
    indigo: 'bg-indigo-500 text-white border-indigo-500',
    amber: 'bg-amber-500 text-white border-amber-500'
  };
  
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const borderClass = showBorder ? 'border-2' : '';
  
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} ${borderClass} ${colors[color]} rounded-full object-cover ${className}`}
      />
    );
  }
  
  return (
    <div className={`${sizes[size]} ${colors[color]} ${borderClass} rounded-full flex items-center justify-center font-semibold ${className}`}>
      {getInitials(name)}
    </div>
  );
};

export default Avatar;