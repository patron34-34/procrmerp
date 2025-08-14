import React from 'react';
import { Candidate } from '../../../types';

interface CandidateCardProps {
  candidate: Candidate;
  onClick: () => void;
  canManage: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onClick, canManage }) => {

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('candidateId', candidate.id.toString());
    };

    return (
        <div
            draggable={canManage}
            onDragStart={canManage ? handleDragStart : undefined}
            onClick={onClick}
            className={`bg-white p-3 mb-3 rounded-md shadow-sm border border-slate-200 dark:bg-dark-card/50 dark:border-dark-border ${canManage ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
        >
            <div className="flex items-center gap-3">
                <img src={candidate.avatar} alt={candidate.name} className="h-10 w-10 rounded-full" />
                <div>
                    <p className="font-bold text-sm text-text-main dark:text-dark-text-main">{candidate.name}</p>
                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary truncate" title={candidate.jobTitle}>{candidate.jobTitle}</p>
                </div>
            </div>
        </div>
    );
};

export default CandidateCard;
