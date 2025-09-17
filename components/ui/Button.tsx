import React, { ReactNode, memo } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Button: React.FC<ButtonProps> = memo(({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseClasses = 'rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-background transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center';

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-card text-text-main border border-border hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-primary-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;