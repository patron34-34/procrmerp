
import React, { useState, useMemo } from 'react';
import { Deal, DealStage } from '../../types';
import DealCard from './DealCard';

interface PipelineColumnProps {
  stage: DealStage;
  deals: Deal[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, dealId: number) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, stage: DealStage) => void;
  onEditDeal: (deal: Deal) => void;
  onDeleteDeal: (deal: Deal) => void;
  canManage: boolean;
}

const PipelineColumn: React.FC<PipelineColumnProps> = ({ stage, deals, onDragStart, onDrop, onEditDeal, onDeleteDeal, canManage }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); if(canManage) setIsOver(true); };
  const handleDragLeave = () => setIsOver(false);
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => { if(canManage) { onDrop(e, stage); setIsOver(false);} };
  
  const stageColors: { [key: string]: string } = {
    [DealStage.Lead]: 'border-t-blue-500',
    [DealStage.Contacted]: 'border-t-yellow-500',
    [DealStage.Proposal]: 'border-t-orange-500',
    [DealStage.Won]: 'border-t-green-500',
    [DealStage.Lost]: 'border-t-red-500',
  };

  const totalValue = useMemo(() => {
    return deals.reduce((sum, deal) => sum + deal.value, 0);
  }, [deals]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 min-w-[300px] bg-slate-100 rounded-lg p-3 transition-colors duration-300 dark:bg-dark-card/30 ${isOver ? 'bg-slate-200 dark:bg-dark-card/60' : ''}`}
    >
      <div className={`p-2 mb-3 rounded-t-md border-t-4 ${stageColors[stage]}`}>
        <div className="flex justify-between items-center">
            <h3 className="font-bold text-text-main dark:text-dark-text-main">{stage}</h3>
            <span className="text-sm font-semibold text-text-main dark:text-dark-text-main">${totalValue.toLocaleString()}</span>
        </div>
        <span className="text-sm text-text-secondary dark:text-dark-text-secondary">{deals.length} anlaşma</span>
      </div>
      <div className="max-h-[calc(100vh-450px)] overflow-y-auto pr-2">
        {deals.map(deal => (
          <DealCard key={deal.id} deal={deal} onDragStart={onDragStart} onEdit={onEditDeal} onDelete={onDeleteDeal} canManage={canManage} />
        ))}
      </div>
    </div>
  );
};

export default PipelineColumn;
