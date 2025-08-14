import React, { useState, useMemo } from 'react';
import { useApp } from '../../../../context/AppContext';
import { JobOpening } from '../../../../types';
import Card from '../../../ui/Card';
import Button from '../../../ui/Button';
import { ICONS } from '../../../../constants';
import JobOpeningFormModal from '../../../hr/recruitment/JobOpeningFormModal';

const JobOpenings: React.FC = () => {
    const { jobOpenings, candidates, hasPermission } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<JobOpening | null>(null);

    const canManage = hasPermission('ik:ise-alim-yonet');

    const openModalForNew = () => {
        setEditingJob(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (job: JobOpening) => {
        setEditingJob(job);
        setIsModalOpen(true);
    };

    const candidateCounts = useMemo(() => {
        const counts: { [key: number]: number } = {};
        candidates.forEach(candidate => {
            counts[candidate.jobOpeningId] = (counts[candidate.jobOpeningId] || 0) + 1;
        });
        return counts;
    }, [candidates]);

    return (
        <>
            <Card
                title="Açık Pozisyonlar"
                action={canManage && <Button onClick={openModalForNew}><span className="flex items-center gap-2">{ICONS.add} Yeni Pozisyon</span></Button>}
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border">
                            <tr className="bg-slate-50 dark:bg-slate-900/50">
                                <th className="p-3">Pozisyon Başlığı</th>
                                <th className="p-3">Departman</th>
                                <th className="p-3">Aday Sayısı</th>
                                <th className="p-3">Durum</th>
                                {canManage && <th className="p-3">Eylemler</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {jobOpenings.map(job => (
                                <tr key={job.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="p-3 font-medium">{job.title}</td>
                                    <td className="p-3">{job.department}</td>
                                    <td className="p-3">{candidateCounts[job.id] || 0}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${job.status === 'Açık' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    {canManage && <td className="p-3">
                                        <button onClick={() => openModalForEdit(job)} className="text-slate-500 hover:text-primary-600">{ICONS.edit}</button>
                                    </td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            {canManage && (
                <JobOpeningFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    jobOpening={editingJob}
                />
            )}
        </>
    );
};

export default JobOpenings;