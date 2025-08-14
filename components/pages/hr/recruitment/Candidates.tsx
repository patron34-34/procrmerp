import React, { useState, useMemo } from 'react';
import { useApp } from '../../../../context/AppContext';
import { Candidate, CandidateStage, JobOpening } from '../../../../types';
import CandidateKanbanColumn from '../../../hr/recruitment/CandidateKanbanColumn';
import CandidateDetailModal from '../../../hr/recruitment/CandidateDetailModal';

const Candidates: React.FC = () => {
    const { candidates, jobOpenings, updateCandidateStage, hasPermission } = useApp();
    const [selectedJobId, setSelectedJobId] = useState<string>('all');
    const [detailCandidate, setDetailCandidate] = useState<Candidate | null>(null);

    const canManage = hasPermission('ik:ise-alim-yonet');

    const filteredCandidates = useMemo(() => {
        if (selectedJobId === 'all') {
            return candidates;
        }
        return candidates.filter(c => c.jobOpeningId === parseInt(selectedJobId));
    }, [candidates, selectedJobId]);

    const handleDrop = (candidateId: number, newStage: CandidateStage) => {
        updateCandidateStage(candidateId, newStage);
    };
    
    const stages = Object.values(CandidateStage);

    return (
        <>
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Aday Yönetimi</h1>
                <div>
                    <label htmlFor="jobFilter" className="mr-2 text-sm font-medium">Pozisyona Göre Filtrele:</label>
                    <select
                        id="jobFilter"
                        value={selectedJobId}
                        onChange={(e) => setSelectedJobId(e.target.value)}
                        className="p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                    >
                        <option value="all">Tüm Pozisyonlar</option>
                        {jobOpenings.map(job => (
                            <option key={job.id} value={job.id}>{job.title}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
                {stages.map(stage => (
                    <CandidateKanbanColumn
                        key={stage}
                        stage={stage}
                        candidates={filteredCandidates.filter(c => c.stage === stage)}
                        onDrop={handleDrop}
                        onCardClick={setDetailCandidate}
                        canManage={canManage}
                    />
                ))}
            </div>
            {detailCandidate && (
                <CandidateDetailModal
                    isOpen={!!detailCandidate}
                    onClose={() => setDetailCandidate(null)}
                    candidate={detailCandidate}
                />
            )}
        </>
    );
};

export default Candidates;