import React, { ReactNode } from 'react';

interface CardProps {
  children?: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, action, style }) => {
  const hasTitle = !!title;

  return (
    <div 
      className={`bg-card dark:bg-dark-card rounded-lg border border-border dark:border-dark-border shadow-sm transition-shadow duration-300 hover:shadow-lg ${className}`}
      style={style}
    >
      {hasTitle ? (
        <>
          <div className="px-6 py-4 border-b border-border dark:border-dark-border flex justify-between items-center">
            <h3 className="font-bold text-lg text-text-main dark:text-dark-text-main">{title}</h3>
            {action && <div>{action}</div>}
          </div>
          <div className="p-6">
            {children}
          </div>
        </>
      ) : (
        <div className="p-6">
            {children}
        </div>
      )}
    </div>
  );
};

export default Card;