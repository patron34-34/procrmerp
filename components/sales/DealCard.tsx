
import React from 'react';
import { Link } from 'react-router-dom';
import { Deal, DealStage } from '../../types';
import { ICONS } from '../../constants';

interface DealCardProps {
  deal: Deal;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, dealId: number) => void;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
  canManage: boolean;
}

const DealCard: React.FC<DealCardProps> = ({ deal, onDragStart, onEdit, onDelete, canManage }) => {
  
  const isOverdue = new Date(deal.closeDate) < new Date() && deal.stage !== DealStage.Won && deal.stage !== DealStage.Lost;
  
  const isStale = () => {
    const daysSinceLastActivity = (new Date().getTime() - new Date(deal.lastActivityDate).getTime()) / (1000 * 3600 * 24);
    return daysSinceLastActivity > 14 && deal.stage !== DealStage.Won && deal.stage !== DealStage.Lost;
  };

  return (
    <div
      draggable={canManage}
      onDragStart={(e) => canManage && onDragStart(e, deal.id)}
      className={`bg-card p-3 mb-3 rounded-md shadow-sm border border-border dark:border-dark-border relative dark:bg-dark-card group ${canManage ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
    >
      {canManage && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button onClick={(e) => { e.stopPropagation(); onEdit(deal); }} className="p-1.5 rounded-md bg-card/80 hover:bg-card text-slate-600 hover:text-primary-600 dark:bg-dark-card/80 dark:hover:bg-dark-card" title="Düzenle">
            {React.cloneElement(ICONS.edit, { className: 'h-4 w-4' })}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(deal); }} className="p-1.5 rounded-md bg-card/80 hover:bg-card text-slate-600 hover:text-red-600 dark:bg-dark-card/80 dark:hover:bg-dark-card" title="Sil">
            {React.cloneElement(ICONS.trash, { className: 'h-4 w-4' })}
          </button>
        </div>
      )}
      <div className="flex justify-between items-start">
        <div className="flex-1 overflow-hidden pr-12">
          <Link to={`/deals/${deal.id}`} className="font-bold text-sm text-text-main dark:text-dark-text-main truncate hover:text-primary-600 dark:hover:text-primary-400" title={deal.title}>{deal.title}</Link>
          <Link to={`/customers/${deal.customerId}`} className="text-xs text-primary-600 hover:underline dark:text-primary-400 truncate block" title={deal.customerName}>{deal.customerName}</Link>
        </div>
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
