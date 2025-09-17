import React, { ReactNode, memo } from 'react';

interface CardProps {
  children?: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = memo(({ children, className = '', title, action, style }) => {
  const hasHeader = !!title || !!action;
  
  return (
    <div 
      className={`bg-card rounded-xl shadow border border-border ${className}`}
      style={style}
    >
      {hasHeader && (
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          {title && <h3 className="font-bold text-lg text-text-main">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={children ? (hasHeader ? 'p-6' : 'p-6') : ''}>
        {children}
      </div>
    </div>
  );
});

export default Card;