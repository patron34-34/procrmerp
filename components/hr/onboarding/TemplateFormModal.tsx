import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { OnboardingTemplate, OnboardingType, AssignedDepartment, OnboardingTemplateItem } from '../../../types';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';

interface TemplateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: OnboardingTemplate | null;
}

const TemplateFormModal: React.FC<TemplateFormModalProps> = ({ isOpen, onClose, template }) => {
    const { addOnboardingTemplate, updateOnboardingTemplate } = useApp();
    
    const initialFormState: Omit<OnboardingTemplate, 'id'> = {
        name: '',
        type: OnboardingType.Onboarding,
        items: [{ taskName: '', assignedTo: AssignedDepartment.HR }],
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (template) {
            setFormData(template);
        } else {
            setFormData(initialFormState);
        }
    }, [template, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index: number, field: keyof OnboardingTemplateItem, value: string) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { taskName: '', assignedTo: AssignedDepartment.HR }]
        }));
    };

    const removeItem = (index: number) => {
        if (formData.items.length <= 1) return;
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.items.every(item => item.taskName.trim())) {
            if (template) {
                updateOnboardingTemplate({ ...template, ...formData });
            } else {
                addOnboardingTemplate(formData);
            }
            onClose();
        } else {
            alert("Lütfen şablon adını ve tüm görev isimlerini doldurun.");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={template ? "Şablonu Düzenle" : "Yeni Şablon Oluştur"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Şablon Adı *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Tür</label>
                        <select name="type" value={formData.type} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                            <option value={OnboardingType.Onboarding}>İşe Alım</option>
                            <option value={OnboardingType.Offboarding}>İşten Çıkış</option>
                        </select>
                    </div>
                </div>
                <div>
                    <h4 className="text-md font-medium mb-2">Görevler</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {formData.items.map((item, index) => (
                            <div key={index} className="grid grid-cols-[1fr_auto_auto] gap-2 items-center">
                                <input
                                    type="text"
                                    placeholder="Görev Açıklaması"
                                    value={item.taskName}
                                    onChange={(e) => handleItemChange(index, 'taskName', e.target.value)}
                                    className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                                />
                                <select
                                    value={item.assignedTo}
                                    onChange={(e) => handleItemChange(index, 'assignedTo', e.target.value)}
                                    className="p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                                >
                                    {Object.values(AssignedDepartment).map(dep => <option key={dep} value={dep}>{dep}</option>)}
                                </select>
                                <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-1">{ICONS.trash}</button>
                            </div>
                        ))}
                    </div>
                    <Button type="button" variant="secondary" onClick={addItem} className="mt-2 text-sm">
                       <span className="flex items-center gap-2">{ICONS.add} Görev Ekle</span>
                    </Button>
                </div>
                <div className="flex justify-end pt-4 gap-2">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit">Kaydet</Button>
                </div>
            </form>
        </Modal>
    );
};

export default TemplateFormModal;
