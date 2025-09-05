import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import TagInput from '../ui/TagInput';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  prefilledData?: Partial<Omit<Project, 'id' | 'client'>> | null;
}

interface FormErrors {
    name?: string;
    deadline?: string;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({ isOpen, onClose, project, prefilledData }) => {
    const { customers, addProject, updateProject, taskTemplates } = useApp();
    
    const initialFormState: Omit<Project, 'id' | 'client'> = {
        name: '',
        customerId: customers[0]?.id || 0,
        deadline: new Date().toISOString().split('T')[0],
        status: 'beklemede',
        progress: 0,
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        teamMemberIds: [],
        budget: 0,
        spent: 0,
        tags: [],
    };

    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState<FormErrors>({});
    const [selectedTaskTemplateId, setSelectedTaskTemplateId] = useState<number | undefined>();

    useEffect(() => {
        let initialState = { ...initialFormState };
        if (project) {
            const { client, ...projectData } = project;
            initialState = { ...initialState, ...projectData };
        } else if (prefilledData) {
            initialState = { ...initialState, ...prefilledData };
        }
        setFormData(initialState);
        setSelectedTaskTemplateId(taskTemplates[0]?.id);
        setErrors({});
    }, [project, prefilledData, isOpen, customers, taskTemplates]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const isNumber = ['progress', 'customerId', 'budget', 'spent'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumber ? parseInt(value) : value }));
    };
    
    const validateForm = () => {
        const newErrors: FormErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Proje adı zorunludur.';
        }
        if (formData.startDate && formData.deadline && new Date(formData.deadline) < new Date(formData.startDate)) {
            newErrors.deadline = 'Bitiş tarihi başlangıç tarihinden önce olamaz.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        const customer = customers.find(c => c.id === formData.customerId);
        if (customer) {
            if(project) {
                updateProject({ ...project, ...formData, client: customer.company });
            } else {
                addProject(formData, selectedTaskTemplateId);
            }
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={project ? "Projeyi Düzenle" : "Yeni Proje Ekle"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Proje Adı *</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:border-dark-border dark:text-white"/>
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Açıklama</label>
                    <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} rows={3} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border"></textarea>
                </div>
                <div>
                    <label htmlFor="customerId" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Müşteri *</label>
                    <select name="customerId" id="customerId" value={formData.customerId} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:border-dark-border dark:text-white">
                    {customers.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Başlangıç Tarihi</label>
                        <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white"/>
                    </div>
                    <div>
                        <label htmlFor="deadline" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Bitiş Tarihi</label>
                        <input type="date" name="deadline" id="deadline" value={formData.deadline} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white"/>
                         {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="budget" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Bütçe ($)</label>
                        <input type="number" name="budget" id="budget" value={formData.budget} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white"/>
                    </div>
                    <div>
                        <label htmlFor="spent" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Harcanan ($)</label>
                        <input type="number" name="spent" id="spent" value={formData.spent} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white"/>
                    </div>
                </div>
                 {!project && taskTemplates.length > 0 && (
                 <div>
                    <label htmlFor="taskTemplateId" className="block text-sm font-medium">Görev Şablonu (Opsiyonel)</label>
                     <select name="taskTemplateId" id="taskTemplateId" value={selectedTaskTemplateId} onChange={(e) => setSelectedTaskTemplateId(Number(e.target.value))} className="mt-1 w-full">
                         <option value="">Şablonsuz oluştur</option>
                         {taskTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                     </select>
                </div>
               )}
                <TagInput tags={formData.tags} setTags={(tags) => setFormData(prev => ({...prev, tags}))} label="Etiketler" />
                <div className="flex justify-end pt-4 gap-2">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit">{project ? "Güncelle" : "Ekle"}</Button>
                </div>
            </form>
        </Modal>
    );
};

export default ProjectFormModal;