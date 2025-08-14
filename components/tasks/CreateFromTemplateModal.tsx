import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskTemplate } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface CreateFromTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateFromTemplateModal: React.FC<CreateFromTemplateModalProps> = ({ isOpen, onClose }) => {
    const { taskTemplates, createTasksFromTemplate, customers, projects, deals } = useApp();
    const [selectedTemplateId, setSelectedTemplateId] = useState<number>(0);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [relatedEntityType, setRelatedEntityType] = useState<'none' | 'customer' | 'project' | 'deal'>('none');
    const [relatedEntityId, setRelatedEntityId] = useState<number>(0);

    useEffect(() => {
        if (taskTemplates.length > 0) {
            setSelectedTemplateId(taskTemplates[0].id);
        }
    }, [taskTemplates, isOpen]);
    
    const selectedTemplate = taskTemplates.find(t => t.id === selectedTemplateId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTemplateId) {
            createTasksFromTemplate(
                selectedTemplateId, 
                startDate, 
                relatedEntityType !== 'none' ? relatedEntityType : undefined,
                relatedEntityId > 0 ? relatedEntityId : undefined
            );
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Şablondan Görev Oluştur">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="template" className="block text-sm font-medium">Görev Şablonu *</label>
                    <select
                        id="template"
                        value={selectedTemplateId}
                        onChange={(e) => setSelectedTemplateId(Number(e.target.value))}
                        required
                        className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                    >
                        <option value={0} disabled>Bir şablon seçin...</option>
                        {taskTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
                {selectedTemplate && <p className="text-sm p-3 bg-slate-50 dark:bg-slate-800/50 rounded-md">{selectedTemplate.description}</p>}
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium">Başlangıç Tarihi *</label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                    />
                     <p className="text-xs text-slate-500 mt-1">Şablondaki tüm görev tarihleri bu tarihe göre hesaplanacaktır.</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary">İlgili Kayıt (Opsiyonel)</label>
                    <div className="flex gap-4 mt-1">
                        <select value={relatedEntityType} onChange={e => setRelatedEntityType(e.target.value as any)} className="p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                            <option value="none">Yok</option>
                            <option value="customer">Müşteri</option>
                            <option value="project">Proje</option>
                            <option value="deal">Anlaşma</option>
                        </select>
                        {relatedEntityType === 'customer' && <select value={relatedEntityId} onChange={e => setRelatedEntityId(Number(e.target.value))} className="flex-grow p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"><option value={0}>Seçin...</option>{customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>}
                        {relatedEntityType === 'project' && <select value={relatedEntityId} onChange={e => setRelatedEntityId(Number(e.target.value))} className="flex-grow p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"><option value={0}>Seçin...</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>}
                        {relatedEntityType === 'deal' && <select value={relatedEntityId} onChange={e => setRelatedEntityId(Number(e.target.value))} className="flex-grow p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"><option value={0}>Seçin...</option>{deals.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}</select>}
                    </div>
                </div>
                <div className="flex justify-end pt-4 gap-2 border-t dark:border-dark-border">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit" disabled={!selectedTemplateId}>Oluştur</Button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateFromTemplateModal;