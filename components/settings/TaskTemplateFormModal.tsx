import React, { useState, useEffect, Fragment } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskTemplate, TaskTemplateItem, TaskPriority } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ICONS } from '../../constants';
import { useNotification } from '../../context/NotificationContext';

interface TaskTemplateFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    template: TaskTemplate | null;
}

const TaskTemplateFormModal: React.FC<TaskTemplateFormModalProps> = ({ isOpen, onClose, template }) => {
    const { roles, addTaskTemplate, updateTaskTemplate } = useApp();
    const { addToast } = useNotification();
    
    const createNewItem = (parentId: string | null = null): TaskTemplateItem => ({
        id: `item-${Date.now()}-${Math.random()}`,
        taskName: '',
        dueDaysAfterStart: 0,
        priority: TaskPriority.Normal,
        estimatedTime: 60,
        parentId,
        defaultAssigneeRoleId: roles[1]?.id || '',
    });

    const initialFormState: Omit<TaskTemplate, 'id'> = {
        name: '',
        description: '',
        items: [createNewItem()],
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (template) {
            setFormData(template);
        } else {
            setFormData(initialFormState);
        }
    }, [template, isOpen, roles]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleItemChange = (id: string, field: keyof TaskTemplateItem, value: any) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
        }));
    };
    
    const getItemLevel = (itemId: string, level = 0): number => {
        const item = formData.items.find(i => i.id === itemId);
        if (item?.parentId) {
            const parent = formData.items.find(i => i.id === item.parentId);
            if(parent) return getItemLevel(parent.id, level + 1);
        }
        return level;
    };

    const addItem = (parentId: string | null = null) => {
        const newItem = createNewItem(parentId);
        setFormData(prev => {
            const newItems = [...prev.items];
            if (parentId) {
                let parentIndex = newItems.findIndex(i => i.id === parentId);
                let lastDescendantIndex = parentIndex;
                for (let i = parentIndex + 1; i < newItems.length; i++) {
                    const currentItem = newItems[i];
                    if (currentItem.parentId && getItemLevel(currentItem.id) > getItemLevel(parentId)) {
                        lastDescendantIndex = i;
                    } else {
                        break;
                    }
                }
                newItems.splice(lastDescendantIndex + 1, 0, newItem);
            } else {
                newItems.push(newItem);
            }
            return {...prev, items: newItems};
        });
    };
    
    const removeItem = (id: string) => {
        if (formData.items.length <= 1) return;
        const idsToRemove = new Set([id]);
        let search = true;
        while(search) {
            search = false;
            formData.items.forEach(item => {
                if(item.parentId && idsToRemove.has(item.parentId) && !idsToRemove.has(item.id)) {
                    idsToRemove.add(item.id);
                    search = true;
                }
            });
        }
        setFormData(prev => ({ ...prev, items: prev.items.filter(item => !idsToRemove.has(item.id)) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name.trim() && formData.items.every(item => item.taskName.trim())) {
            if (template) {
                updateTaskTemplate({ ...template, ...formData });
            } else {
                addTaskTemplate(formData);
            }
            onClose();
        } else {
            addToast("Lütfen şablon adını ve tüm görev isimlerini doldurun.", "error");
        }
    };

    const renderItem = (item: TaskTemplateItem) => {
        const level = getItemLevel(item.id);
        const children = formData.items.filter(child => child.parentId === item.id);
        return (
            <Fragment key={item.id}>
                <div 
                    className="grid grid-cols-[3fr_1fr_1.5fr_1fr_auto] gap-2 items-center" 
                    style={{ paddingLeft: `${level * 24}px` }}
                >
                    <input
                        type="text"
                        placeholder="Görev Adı"
                        value={item.taskName}
                        onChange={(e) => handleItemChange(item.id, 'taskName', e.target.value)}
                        className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                    />
                    <input type="number" value={item.dueDaysAfterStart} onChange={e => handleItemChange(item.id, 'dueDaysAfterStart', Number(e.target.value))} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" title="Başlangıçtan kaç gün sonra?" />
                    <select value={item.defaultAssigneeRoleId} onChange={e => handleItemChange(item.id, 'defaultAssigneeRoleId', e.target.value)} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                        {roles.filter(r => !r.isSystemRole).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                    <select value={item.priority} onChange={e => handleItemChange(item.id, 'priority', e.target.value)} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                        {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <div className="flex">
                        <button type="button" onClick={() => addItem(item.id)} title="Alt görev ekle" className="p-1 text-slate-500 hover:text-primary-600">{ICONS.add}</button>
                        <button type="button" onClick={() => removeItem(item.id)} title="Görevi ve alt görevleri sil" className="p-1 text-slate-500 hover:text-red-600">{ICONS.trash}</button>
                    </div>
                </div>
                {children.map(child => renderItem(child))}
            </Fragment>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={template ? "Şablonu Düzenle" : "Yeni Görev Şablonu"} size="4xl">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Şablon Adı *" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div>
                    <label className="block text-sm font-medium">Açıklama</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows={2} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                </div>
                <div className="border-t pt-4 dark:border-dark-border">
                    <div className="grid grid-cols-[3fr_1fr_1.5fr_1fr_auto] gap-2 font-semibold text-sm px-2 pb-2">
                        <span>Görev Adı</span>
                        <span>Bitiş Günü</span>
                        <span>Sorumlu Rolü</span>
                        <span>Öncelik</span>
                        <span>Eylemler</span>
                    </div>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                        {formData.items.filter(i => !i.parentId).map(item => renderItem(item))}
                    </div>
                    <Button type="button" variant="secondary" onClick={() => addItem(null)} className="mt-3">Ana Görev Ekle</Button>
                </div>
                <div className="flex justify-end pt-4 gap-2 border-t dark:border-dark-border">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit">Kaydet</Button>
                </div>
            </form>
        </Modal>
    );
};

const InputField: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium">{label}</label>
        <input {...props} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
    </div>
);


export default TaskTemplateFormModal;