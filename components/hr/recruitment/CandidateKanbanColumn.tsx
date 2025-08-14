import React, { useState } from 'react';
import { Candidate, CandidateStage } from '../../../types';
import CandidateCard from './CandidateCard';

interface CandidateKanbanColumnProps {
  stage: CandidateStage;
  candidates: Candidate[];
  onDrop: (candidateId: number, newStage: CandidateStage) => void;
  onCardClick: (candidate: Candidate) => void;
  canManage: boolean;
}

const CandidateKanbanColumn: React.FC<CandidateKanbanColumnProps> = ({ stage, candidates, onDrop, onCardClick, canManage }) => {
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (canManage) setIsOver(true);
    };
    const handleDragLeave = () => setIsOver(false);
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        if (canManage) {
            const candidateId = parseInt(e.dataTransfer.getData('candidateId'), 10);
            onDrop(candidateId, stage);
            setIsOver(false);
        }
    };

    const stageConfig = {
        [CandidateStage.NewApplication]: { color: 'border-t-blue-500' },
        [CandidateStage.Screening]: { color: 'border-t-purple-500' },
        [CandidateStage.Interview]: { color: 'border-t-yellow-500' },
        [CandidateStage.Offer]: { color: 'border-t-orange-500' },
        [CandidateStage.Hired]: { color: 'border-t-green-500' },
        [CandidateStage.Rejected]: { color: 'border-t-red-500' },
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex-1 min-w-[300px] bg-slate-100 rounded-lg p-3 transition-colors duration-300 dark:bg-dark-card/30 ${isOver ? 'bg-slate-200 dark:bg-dark-card/60' : ''}`}
        >
            <div className={`p-2 mb-3 rounded-t-md border-t-4 ${stageConfig[stage].color}`}>
                <h3 className="font-bold text-text-main dark:text-dark-text-main">{stage} ({candidates.length})</h3>
            </div>
            <div className="max-h-[calc(100vh-450px)] overflow-y-auto pr-2">
                {candidates.map(candidate => (
                    <CandidateCard 
                        key={candidate.id} 
                        candidate={candidate} 
                        onClick={() => onCardClick(candidate)} 
                        canManage={canManage}
                    />
                ))}
            </div>
        </div>
    );
};

export default CandidateKanbanColumn;
