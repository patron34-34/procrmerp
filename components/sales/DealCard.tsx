

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Deal, DealStage } from '../../types';

interface DealCardProps {
  deal: Deal;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, dealId: number) => void;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
  canManage: boolean;
}

const DealCard: React.FC<DealCardProps> = ({ deal, onDragStart, onEdit, onDelete, canManage }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);
  
  const isOverdue = new Date(deal.closeDate) < new Date() && deal.stage !== DealStage.Won && deal.stage !== DealStage.Lost;
  
  const isStale = () => {
    const daysSinceLastActivity = (new Date().getTime() - new Date(deal.lastActivityDate).getTime()) / (1000 * 3600 * 24);
    return daysSinceLastActivity > 14 && deal.stage !== DealStage.Won && deal.stage !== DealStage.Lost;
  };

  return (
    <div
      draggable={canManage}
      onDragStart={(e) => canManage && onDragStart(e, deal.id)}
      className={`bg-white p-3 mb-3 rounded-md shadow-sm border border-slate-200 dark:bg-dark-card/50 dark:border-dark-border relative ${canManage ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 overflow-hidden">
          <Link to={`/deals/${deal.id}`} className="font-bold text-sm text-text-main dark:text-dark-text-main truncate hover:text-primary-600 dark:hover:text-primary-400" title={deal.title}>{deal.title}</Link>
          <Link to={`/customers/${deal.customerId}`} className="text-xs text-primary-600 hover:underline dark:text-primary-400 truncate block" title={deal.customerName}>{deal.customerName}</Link>
        </div>
        {canManage && <div className="relative" ref={menuRef}>
           <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 p-1 rounded-full -mr-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" /></svg>
           </button>
           {menuOpen && (
             <div className="absolute right-0 mt-2 w-40 bg-card rounded-md shadow-lg z-10 border border-slate-200 dark:bg-dark-card dark:border-dark-border">
                <button onClick={() => { onEdit(deal); setMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-slate-100 dark:text-dark-text-secondary dark:hover:bg-slate-700">Düzenle</button>
                <button onClick={() => { onDelete(deal); setMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700">Sil</button>
             </div>
           )}
        </div>}
      </div>
      <p className="text-sm font-semibold text-primary-600 mt-2">
        ${deal.value.toLocaleString()}
      </p>
      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-dark-border/50 flex justify-between items-center text-xs text-text-secondary dark:text-dark-text-secondary">
        <span title={`Sorumlu: ${deal.assignedToName}`}>{deal.assignedToName}</span>
        <div className="flex items-center gap-2" title={`Kapanış Tarihi: ${deal.closeDate}`}>
            {isOverdue && <span className="text-red-500" title="Kapanış tarihi geçti!">⏰</span>}
            {isStale() && <span className="text-orange-500" title="Bu anlaşma 14 günden uzun süredir işlem görmedi.">⚠️</span>}
            <span>{deal.closeDate}</span>
        </div>
      </div>
    </div>
  );
};

export default DealCard;