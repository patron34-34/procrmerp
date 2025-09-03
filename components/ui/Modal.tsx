import React, { ReactNode } from 'react';
import { ICONS } from '../../constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = '2xl' }) => {
  if (!isOpen) return null;

  const sizeClasses: { [key: string]: string } = {
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className={`bg-card rounded-2xl shadow-lg w-full m-4 border border-border ${sizeClasses[size]}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-border">
          <h2 className="text-xl font-bold text-text-main">{title}</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-main" aria-label="Kapat">
            {ICONS.close}
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
