import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskStatus, TaskPriority } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ICONS } from '../../constants';
import { generateSubtasksFromPrompt } from '../../services/geminiService';
import { useNotification } from '../../context/NotificationContext';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  prefilledData?: Partial<Task> | null;
  onSubmit: (data: Omit<Task, 'id' | 'assignedToName' | 'relatedEntityName'>, subtaskTitles: string[]) => void;
}

interface FormErrors {
    title?: string;
    dueDate?: string;
}

interface SuggestedSubtask {
    title: string;
    checked: boolean;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, task, prefilledData, onSubmit }) => {
    const { employees, customers, projects, deals } = useApp();
    const { addToast } = useNotification();
    
    const today = new Date().toISOString().split('T')[0];
    const initialFormState: Omit<Task, 'id' | 'assignedToName' | 'relatedEntityName'> = {
        title: '',
        description: '',
        status: TaskStatus.Todo,
        priority: TaskPriority.Normal,
        startDate: today,
        dueDate: today,
        assignedToId: employees[0]?.id || 0,
        estimatedTime: 60,
        timeSpent: 0,
        recurrenceRule: '',
    };
    
    const [formData, setFormData] = useState(initialFormState);
    const [relatedEntityType, setRelatedEntityType] = useState<'none' | 'customer' | 'project' | 'deal'>('none');
    const [errors, setErrors] = useState<FormErrors>({});
    const [suggestedSubtasks, setSuggestedSubtasks] = useState<SuggestedSubtask[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (task) {
            const populatedData = { ...initialFormState, ...task };
            setFormData(populatedData);
            setRelatedEntityType(populatedData.relatedEntityType || 'none');
        } else if (prefilledData) {
            setFormData({ ...initialFormState, ...prefilledData });
            setRelatedEntityType(prefilledData.relatedEntityType || 'none');
        } else {
            setFormData(initialFormState);
            setRelatedEntityType('none');
        }
        setSuggestedSubtasks([]);
        setErrors({});
    }, [task, prefilledData, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let finalValue: string | number | undefined = value;

        if (name === 'assignedToId' || name === 'relatedEntityId') {
            finalValue = parseInt(value);
        } else if (name === 'estimatedTime') {
            finalValue = parseFloat(value) * 60; // Convert hours to minutes
        } else if (name === 'recurrenceRule' && value === '') {
            finalValue = undefined;
        }

        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };
    
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Başlık alanı zorunludur.';
        }
        if (formData.startDate && formData.dueDate && new Date(formData.dueDate) < new Date(formData.startDate)) {
            newErrors.dueDate = 'Bitiş tarihi başlangıç tarihinden önce olamaz.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleGenerateSubtasks = async () => {
        if (!formData.title.trim()) {
            addToast('Lütfen önce bir görev başlığı girin.', 'warning');
            return;
        }
        setIsGenerating(true);
        try {
            const subtaskTitles = await generateSubtasksFromPrompt(formData.title);
            setSuggestedSubtasks(subtaskTitles.map(title => ({ title, checked: true })));
            addToast('Alt görev önerileri oluşturuldu!', 'success');
        } catch (error) {
            console.error(error);
            addToast('Yapay zeka ile alt görev oluşturulurken bir hata oluştu.', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubtaskChange = (index: number, field: 'title' | 'checked', value: string | boolean) => {
        const newSubtasks = [...suggestedSubtasks];
        (newSubtasks[index] as any)[field] = value;
        setSuggestedSubtasks(newSubtasks);
    };

    const addManualSubtask = () => {
        setSuggestedSubtasks([...suggestedSubtasks, { title: '', checked: true }]);
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const finalFormData: Omit<Task, 'id' | 'assignedToName' | 'relatedEntityName'> = { ...formData };
        if (relatedEntityType === 'none') {
            delete finalFormData.relatedEntityType;
            delete finalFormData.relatedEntityId;
        } else {
            finalFormData.relatedEntityType = relatedEntityType;
        }
        
        const subtaskTitles = suggestedSubtasks.filter(st => st.checked && st.title.trim()).map(st => st.title.trim());
        
        onSubmit(finalFormData, subtaskTitles);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={task && task.id ? "Görevi Düzenle" : "Yeni Görev Oluştur"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-text-secondary">Başlık *</label>
                    <div className="flex items-center gap-2">
                        <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                        <Button type="button" variant="secondary" onClick={handleGenerateSubtasks} disabled={isGenerating} className="!p-2 mt-1">
                            {isGenerating ? '...' : ICONS.magic}
                        </Button>
                    </div>
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                 {suggestedSubtasks.length > 0 && (
                    <div className="border-t pt-4 dark:border-dark-border">
                        <h4 className="font-semibold mb-2">Önerilen Alt Görevler</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {suggestedSubtasks.map((st, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    checked={st.checked} 
                                    onChange={(e) => handleSubtaskChange(index, 'checked', e.target.checked)}
                                    className="h-5 w-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                />
                                <input 
                                    type="text"
                                    value={st.title}
                                    onChange={(e) => handleSubtaskChange(index, 'title', e.target.value)}
                                    className="flex-grow p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border text-sm"
                                />
                            </div>
                        ))}
                        </div>
                        <Button type="button" variant="secondary" onClick={addManualSubtask} className="mt-2 text-sm">
                            Manuel Ekle
                        </Button>
                    </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="assignedToId" className="block text-sm font-medium text-text-secondary">Atanan Kişi *</label>
                        <select name="assignedToId" id="assignedToId" value={formData.assignedToId} onChange={handleInputChange} required className="mt-1 block w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-text-secondary">Öncelik</label>
                        <select name="priority" id="priority" value={formData.priority} onChange={handleInputChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                            {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-text-secondary">Başlangıç Tarihi</label>
                        <input type="date" name="startDate" id="startDate" value={formData.startDate || ''} onChange={handleInputChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                    </div>
                     <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-text-secondary">Bitiş Tarihi</label>
                        <input type="date" name="dueDate" id="dueDate" value={formData.dueDate} onChange={handleInputChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                        {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
                    </div>
                     <div>
                        <label htmlFor="status" className="block text-sm font-medium text-text-secondary">Durum</label>
                        <select name="status" id="status" value={formData.status} onChange={handleInputChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                            {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="estimatedTime" className="block text-sm font-medium text-text-secondary">Tahmini Süre (saat)</label>
                        <input type="number" step="0.5" name="estimatedTime" id="estimatedTime" value={(formData.estimatedTime || 0) / 60} onChange={handleInputChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                    </div>
                </div>

                 <div>
                    <label className="block text-sm font-medium text-text-secondary">İlgili Kayıt (Opsiyonel)</label>
                    <div className="flex gap-4 mt-1">
                        <select value={relatedEntityType} onChange={e => setRelatedEntityType(e.target.value as 'none' | 'customer' | 'project' | 'deal')} className="p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                            <option value="none">Yok</option>
                            <option value="customer">Müşteri</option>
                            <option value="project">Proje</option>
                            <option value="deal">Anlaşma</option>
                        </select>
                        {relatedEntityType === 'customer' && (
                            <select name="relatedEntityId" value={formData.relatedEntityId || ''} onChange={handleInputChange} className="flex-grow p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                                <option value="">Müşteri Seçin...</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        )}
                        {relatedEntityType === 'project' && (
                            <select name="relatedEntityId" value={formData.relatedEntityId || ''} onChange={handleInputChange} className="flex-grow p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                                 <option value="">Proje Seçin...</option>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        )}
                        {relatedEntityType === 'deal' && (
                            <select name="relatedEntityId" value={formData.relatedEntityId || ''} onChange={handleInputChange} className="flex-grow p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                                 <option value="">Anlaşma Seçin...</option>
                                {deals.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                            </select>
                        )}
                    </div>
                </div>
                
                <div>
                    <label htmlFor="recurrenceRule" className="block text-sm font-medium text-text-secondary">Tekrarla</label>
                    <select name="recurrenceRule" id="recurrenceRule" value={formData.recurrenceRule || ''} onChange={handleInputChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                        <option value="">Tekrarlanmaz</option>
                        <option value="FREQ=DAILY">Her Gün</option>
                        <option value="FREQ=WEEKLY">Her Hafta</option>
                    </select>
                </div>
                
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-text-secondary">Açıklama</label>
                    <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} rows={3} className="mt-1 block w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"></textarea>
                </div>
                
                <div className="flex justify-end pt-4 gap-2">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit">{task && task.id ? "Güncelle" : "Oluştur"}</Button>
                </div>
            </form>
        </Modal>
    );
};

export default TaskFormModal;