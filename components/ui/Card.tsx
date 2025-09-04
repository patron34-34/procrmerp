import React, { ReactNode } from 'react';

interface CardProps {
  children?: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, action, style }) => {
  const hasHeader = !!title || !!action;
  
  return (
    <div 
      className={`bg-card rounded-xl shadow-sm border border-border ${className}`}
      style={style}
    >
      {hasHeader && (
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          {title && <h3 className="font-bold text-lg text-text-main">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={hasHeader ? 'p-6' : ''}>
        {children}
      </div>
    </div>
  );
};

export default Card;
