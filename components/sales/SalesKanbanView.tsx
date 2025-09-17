
import React from 'react';
import { Deal, DealStage } from '../../types';
import PipelineColumn from './PipelineColumn';

interface SalesKanbanViewProps {
  deals: Deal[];
  onEditDeal: (deal: Deal) => void;
  onDeleteDeal: (deal: Deal) => void;
  onStageChangeRequest: (deal: Deal, newStage: DealStage) => void;
  canManage: boolean;
}

const SalesKanbanView: React.FC<SalesKanbanViewProps> = ({ deals, onEditDeal, onDeleteDeal, onStageChangeRequest, canManage }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, dealId: number) => {
    e.dataTransfer.setData('dealId', dealId.toString());
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStage: DealStage) => {
    const dealId = parseInt(e.dataTransfer.getData('dealId'), 10);
    const deal = deals.find(d => d.id === dealId);
    if (deal && deal.stage !== newStage) {
      onStageChangeRequest(deal, newStage);
    }
  };

  const stages = Object.values(DealStage);

  return (
    <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
      {stages.map(stage => (
        <PipelineColumn
          key={stage}
          stage={stage}
          deals={deals.filter(d => d.stage === stage)}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onEditDeal={onEditDeal}
          onDeleteDeal={onDeleteDeal}
          canManage={canManage}
        />
      ))}
    </div>
  );
};

export default SalesKanbanView;
