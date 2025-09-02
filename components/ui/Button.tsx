
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', icon, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  
  const variantClasses = {
    primary: 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...props}
    >
      {icon && <span className="mr-2 -ml-1 h-5 w-5">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
