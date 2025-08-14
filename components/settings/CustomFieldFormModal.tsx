
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomFieldDefinition, CustomFieldType } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface CustomFieldFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: CustomFieldDefinition | null;
}

const CustomFieldFormModal: React.FC<CustomFieldFormModalProps> = ({ isOpen, onClose, field }) => {
    const { addCustomField, updateCustomField } = useApp();
    
    const initialFormState: Omit<CustomFieldDefinition, 'id'> = {
        name: '',
        type: CustomFieldType.Text,
        appliesTo: 'customer',
        options: [],
    };
    const [formData, setFormData] = useState(initialFormState);
    const [optionsText, setOptionsText] = useState('');

    useEffect(() => {
        if (field) {
            setFormData(field);
            setOptionsText(field.options?.join(', ') || '');
        } else {
            setFormData(initialFormState);
            setOptionsText('');
        }
    }, [field, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name) {
            const finalData = { ...formData };
            if (formData.type === CustomFieldType.Dropdown) {
                finalData.options = optionsText.split(',').map(opt => opt.trim()).filter(Boolean);
            } else {
                delete finalData.options;
            }

            if (field) {
                updateCustomField({ ...field, ...finalData });
            } else {
                addCustomField(finalData);
            }
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={field ? "Özel Alanı Düzenle" : "Yeni Özel Alan Ekle"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium">Alan Adı *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Alan Türü</label>
                        <select name="type" value={formData.type} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                            {Object.values(CustomFieldType).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Uygulandığı Modül</label>
                        <select name="appliesTo" value={formData.appliesTo} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                            <option value="customer">Müşteri</option>
                            <option value="deal">Anlaşma</option>
                            <option value="project">Proje</option>
                        </select>
                    </div>
                </div>
                {formData.type === CustomFieldType.Dropdown && (
                    <div>
                        <label className="block text-sm font-medium">Seçenekler</label>
                        <input
                            type="text"
                            value={optionsText}
                            onChange={(e) => setOptionsText(e.target.value)}
                            className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                            placeholder="Seçenekleri virgülle ayırın"
                        />
                    </div>
                )}
                <div className="flex justify-end pt-4 gap-2">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit">Kaydet</Button>
                </div>
            </form>
        </Modal>
    );
};

export default CustomFieldFormModal;
