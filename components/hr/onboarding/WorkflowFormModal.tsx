import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { OnboardingType } from '../../../types';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';

interface WorkflowFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WorkflowFormModal: React.FC<WorkflowFormModalProps> = ({ isOpen, onClose }) => {
    const { employees, onboardingTemplates, startOnboardingWorkflow } = useApp();
    const [employeeId, setEmployeeId] = useState<number>(0);
    const [templateId, setTemplateId] = useState<number>(0);
    const [workflowType, setWorkflowType] = useState<OnboardingType>(OnboardingType.Onboarding);

    const filteredTemplates = onboardingTemplates.filter(t => t.type === workflowType);

    useEffect(() => {
        if(employees.length > 0) setEmployeeId(employees[0].id);
    }, [employees, isOpen]);

    useEffect(() => {
        if(filteredTemplates.length > 0) setTemplateId(filteredTemplates[0].id);
        else setTemplateId(0);
    }, [workflowType, onboardingTemplates, isOpen]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (employeeId && templateId) {
            startOnboardingWorkflow({ employeeId, templateId });
            onClose();
        } else {
            alert("Lütfen bir çalışan ve şablon seçin.");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Yeni İş Akışı Başlat">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Süreç Türü</label>
                    <select
                        value={workflowType}
                        onChange={(e) => setWorkflowType(e.target.value as OnboardingType)}
                        className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                    >
                        <option value={OnboardingType.Onboarding}>İşe Alım</option>
                        <option value={OnboardingType.Offboarding}>İşten Çıkış</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Çalışan *</label>
                    <select
                        value={employeeId}
                        onChange={(e) => setEmployeeId(parseInt(e.target.value))}
                        required
                        className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                    >
                        <option value={0} disabled>Seçiniz...</option>
                        {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Şablon *</label>
                    <select
                        value={templateId}
                        onChange={(e) => setTemplateId(parseInt(e.target.value))}
                        required
                        className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                    >
                        <option value={0} disabled>Seçiniz...</option>
                        {filteredTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                     {filteredTemplates.length === 0 && <p className="text-xs text-red-500 mt-1">Bu süreç türü için uygun şablon bulunamadı.</p>}
                </div>
                <div className="flex justify-end pt-4 gap-2">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit" disabled={!employeeId || !templateId}>Başlat</Button>
                </div>
            </form>
        </Modal>
    );
};

export default WorkflowFormModal;
