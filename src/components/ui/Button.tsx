import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const baseClasses = 'border-none border-radius cursor-pointer transition-all';
  
  const variantClasses = {
    primary: 'clone-btn',
    secondary: 'secondary-btn',
    danger: 'danger-btn'
  };

  const sizeClasses = {
    small: 'padding-small',
    medium: 'padding-medium', 
    large: 'padding-large'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};