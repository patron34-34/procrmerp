import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Automation, AutomationTriggerType, AutomationActionType, DealStage, AutomationAction } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ICONS } from '../../constants';

interface AutomationFormProps {
    isOpen: boolean;
    onClose: () => void;
    automation: Automation | null;
}

const AutomationForm: React.FC<AutomationFormProps> = ({ isOpen, onClose, automation }) => {
    const { addAutomation, updateAutomation, systemLists } = useApp();
    
    const initialFormState: Omit<Automation, 'id' | 'lastRun'> = {
        name: '',
        triggerType: AutomationTriggerType.DEAL_STAGE_CHANGED,
        triggerConfig: { stageId: DealStage.Won },
        actions: [{
            type: AutomationActionType.WEBHOOK,
            config: { url: '' }
        }],
        active: true
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if(automation) {
            setFormData(automation);
        } else {
            setFormData(initialFormState);
        }
    }, [automation, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleTriggerConfigChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, triggerConfig: { ...prev.triggerConfig, [name]: value as DealStage } }));
    };

    const handleActionChange = (index: number, newAction: AutomationAction) => {
        const newActions = [...formData.actions];
        newActions[index] = newAction;
        setFormData(prev => ({ ...prev, actions: newActions }));
    };

    const addAction = () => {
        setFormData(prev => ({
            ...prev,
            actions: [...prev.actions, { type: AutomationActionType.WEBHOOK, config: { url: '' } }]
        }));
    };
    
    const removeAction = (index: number) => {
        setFormData(prev => ({
            ...prev,
            actions: prev.actions.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(formData.name && formData.actions.length > 0) {
            if(automation) {
                updateAutomation({...automation, ...formData});
            } else {
                addAutomation(formData);
            }
            onClose();
        } else {
            alert('Lütfen tüm zorunlu alanları doldurun.');
        }
    };
    
    const renderActionConfig = (action: AutomationAction, index: number) => {
        const handleConfigChange = (configField: string, value: any) => {
            const newAction = { ...action, config: { ...(action as any).config, [configField]: value } };
            handleActionChange(index, newAction);
        };
        
        switch(action.type) {
            case AutomationActionType.WEBHOOK:
                return <input type="url" placeholder="https://..." value={(action.config as any).url} onChange={(e) => handleConfigChange('url', e.target.value)} required className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" />;
            case AutomationActionType.UPDATE_CUSTOMER_STATUS:
                return <select value={(action.config as any).newStatus} onChange={(e) => handleConfigChange('newStatus', e.target.value)} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"><option value="">Durum Seçin...</option>{systemLists.customerStatus.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</select>;
            case AutomationActionType.CREATE_PROJECT:
                 return <input type="text" placeholder="{customerName} - {dealTitle}" value={(action.config as any).projectNameTemplate} onChange={(e) => handleConfigChange('projectNameTemplate', e.target.value)} required className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" />;
            case AutomationActionType.CREATE_TASK:
                return (<div className="grid grid-cols-3 gap-2">
                    <input type="text" placeholder="Görev Başlığı" value={(action.config as any).title} onChange={(e) => handleConfigChange('title', e.target.value)} required className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                    <select value={(action.config as any).assignedTo} onChange={(e) => handleConfigChange('assignedTo', e.target.value)} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                        <option value="deal_owner">Anlaşma Sahibi</option>
                        <option value="project_manager">Proje Yöneticisi</option>
                    </select>
                    <input type="number" placeholder="Kaç gün sonra?" value={(action.config as any).dueDays} onChange={(e) => handleConfigChange('dueDays', parseInt(e.target.value))} required className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                </div>);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={automation ? "Otomasyonu Düzenle" : "Yeni Otomasyon Oluştur"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Otomasyon Adı *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                </div>
                
                <div className="border-t pt-4 dark:border-dark-border">
                    <h4 className="font-semibold">Tetikleyici (Ne zaman çalışsın?)</h4>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                            <label className="block text-sm font-medium">Olay</label>
                            <select name="triggerType" value={formData.triggerType} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                                <option value={AutomationTriggerType.DEAL_STAGE_CHANGED}>Anlaşma Aşaması Değiştiğinde</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Hedef Aşama</label>
                            <select name="stageId" value={formData.triggerConfig.stageId} onChange={handleTriggerConfigChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                                {Object.values(DealStage).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-4 dark:border-dark-border">
                    <h4 className="font-semibold mb-2">Eylemler (Ne yapsın?)</h4>
                    <div className="space-y-3">
                    {formData.actions.map((action, index) => (
                        <div key={index} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-md space-y-2">
                           <div className="flex justify-between items-center">
                                <select 
                                    value={action.type} 
                                    onChange={(e) => {
                                        const newType = e.target.value as AutomationActionType;
                                        let newConfig = {};
                                        if(newType === AutomationActionType.WEBHOOK) newConfig = { url: ''};
                                        if(newType === AutomationActionType.UPDATE_CUSTOMER_STATUS) newConfig = { newStatus: systemLists.customerStatus[0].id };
                                        if(newType === AutomationActionType.CREATE_PROJECT) newConfig = { projectNameTemplate: '{customerName} Projesi' };
                                        if(newType === AutomationActionType.CREATE_TASK) newConfig = { title: '', assignedTo: 'deal_owner', dueDays: 1 };
                                        handleActionChange(index, { type: newType, config: newConfig } as AutomationAction);
                                    }} 
                                    className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                                >
                                    {Object.values(AutomationActionType).map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <button type="button" onClick={() => removeAction(index)} className="ml-2 text-red-500 hover:text-red-700 p-1">{ICONS.trash}</button>
                           </div>
                           <div>{renderActionConfig(action, index)}</div>
                        </div>
                    ))}
                    </div>
                    <Button type="button" variant="secondary" onClick={addAction} className="mt-3">
                        <span className="flex items-center gap-2">{ICONS.add} Eylem Ekle</span>
                    </Button>
                </div>
                
                <div className="flex justify-end pt-4 gap-2 border-t dark:border-dark-border">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit">Kaydet</Button>
                </div>
            </form>
        </Modal>
    );
};

export default AutomationForm;
