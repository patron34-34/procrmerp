import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../../../context/AppContext';
import Card from '../../../ui/Card';
import { OnboardingTemplate, OnboardingWorkflowStatus, AssignedDepartment } from '../../../../types';

const WorkflowDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { onboardingWorkflows, onboardingTemplates, updateOnboardingWorkflowStatus, hasPermission } = useApp();
    
    const workflowId = parseInt(id || '', 10);
    const workflow = onboardingWorkflows.find(w => w.id === workflowId);
    const template = onboardingTemplates.find(t => t.id === workflow?.templateId);

    const canManage = hasPermission('ik:oryantasyon-yonet');

    if (!workflow || !template) {
        return <Card title="Hata"><p>İş akışı bulunamadı. <Link to="/hr/onboarding/workflows">İş Akışları sayfasına</Link> geri dönün.</p></Card>;
    }
    
    const handleTaskToggle = (itemIndex: number) => {
        if (!canManage) return;
        const isCompleted = !workflow.itemsStatus[itemIndex];
        updateOnboardingWorkflowStatus(workflow.id, itemIndex, isCompleted);
    };

    const getDepartmentBadge = (department: AssignedDepartment) => {
        const styles: { [key in AssignedDepartment]: string } = {
            [AssignedDepartment.HR]: 'bg-pink-100 text-pink-800',
            [AssignedDepartment.IT]: 'bg-blue-100 text-blue-800',
            [AssignedDepartment.Finance]: 'bg-green-100 text-green-800',
            [AssignedDepartment.Manager]: 'bg-purple-100 text-purple-800',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[department]}`}>{department}</span>;
    };

    const completedCount = workflow.itemsStatus.filter(Boolean).length;
    const totalCount = workflow.itemsStatus.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-2xl font-bold">{workflow.templateName} - {workflow.employeeName}</h2>
                <p className="text-text-secondary">Başlangıç Tarihi: {workflow.startDate}</p>
                <div className="mt-4">
                    <div className="flex justify-between mb-1">
                        <span className="text-base font-medium text-primary-700 dark:text-white">İlerleme</span>
                        <span className="text-sm font-medium text-primary-700 dark:text-white">{completedCount} / {totalCount} Tamamlandı</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700">
                        <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </Card>

            <Card title="Görev Listesi">
                <div className="space-y-3">
                    {template.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={workflow.itemsStatus[index]}
                                    onChange={() => handleTaskToggle(index)}
                                    disabled={!canManage}
                                    className="h-5 w-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                                />
                                <label className={`ml-3 text-base ${workflow.itemsStatus[index] ? 'line-through text-slate-500' : ''}`}>
                                    {item.taskName}
                                </label>
                            </div>
                            {getDepartmentBadge(item.assignedTo)}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default WorkflowDetail;