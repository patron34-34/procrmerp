import React, { useState, useMemo } from 'react';
import { useApp } from '../../../../context/AppContext';
import { OnboardingWorkflow } from '../../../../types';
import Card from '../../../ui/Card';
import Button from '../../../ui/Button';
import { ICONS } from '../../../../constants';
import WorkflowFormModal from '../../../hr/onboarding/WorkflowFormModal';
import { Link } from 'react-router-dom';

const OnboardingWorkflows: React.FC = () => {
    const { onboardingWorkflows, hasPermission } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const canManage = hasPermission('ik:oryantasyon-yonet');

    const getProgress = (workflow: OnboardingWorkflow) => {
        const completedCount = workflow.itemsStatus.filter(Boolean).length;
        const totalCount = workflow.itemsStatus.length;
        return totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    };

    return (
        <>
            <Card
                title="İş Akışları"
                action={canManage && <Button onClick={() => setIsModalOpen(true)}><span className="flex items-center gap-2">{ICONS.add} Yeni İş Akışı Başlat</span></Button>}
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border">
                            <tr className="bg-slate-50 dark:bg-slate-900/50">
                                <th className="p-3">Çalışan</th>
                                <th className="p-3">Tür</th>
                                <th className="p-3">Şablon</th>
                                <th className="p-3">İlerleme</th>
                                <th className="p-3">Durum</th>
                                <th className="p-3">Eylemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {onboardingWorkflows.map(workflow => {
                                const progress = getProgress(workflow);
                                return (
                                    <tr key={workflow.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="p-3 font-medium">{workflow.employeeName}</td>
                                        <td className="p-3">{workflow.type}</td>
                                        <td className="p-3">{workflow.templateName}</td>
                                        <td className="p-3">
                                            <div className="flex items-center">
                                                <div className="w-full bg-slate-200 rounded-full h-2 mr-2 dark:bg-slate-700">
                                                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                                                </div>
                                                <span className="text-sm font-semibold">{Math.round(progress)}%</span>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${workflow.status === 'Tamamlandı' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {workflow.status}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <Link to={`/hr/onboarding/workflows/${workflow.id}`} className="text-primary-600 hover:underline">
                                                Detayları Gör
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
            {canManage && (
                <WorkflowFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
};

export default OnboardingWorkflows;