import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { JobOpening, JobOpeningStatus } from '../../../types';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';

interface JobOpeningFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobOpening: JobOpening | null;
}

const JobOpeningFormModal: React.FC<JobOpeningFormModalProps> = ({ isOpen, onClose, jobOpening }) => {
    const { addJobOpening, updateJobOpening } = useApp();
    
    const initialFormState: Omit<JobOpening, 'id'> = {
        title: '',
        department: '',
        description: '',
        requirements: '',
        status: JobOpeningStatus.Open,
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (jobOpening) {
            setFormData(jobOpening);
        } else {
            setFormData(initialFormState);
        }
    }, [jobOpening, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.title && formData.department) {
            if (jobOpening) {
                updateJobOpening({ ...jobOpening, ...formData });
            } else {
                addJobOpening(formData);
            }
            onClose();
        } else {
            alert("Lütfen başlık ve departman alanlarını doldurun.");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={jobOpening ? "Pozisyonu Düzenle" : "Yeni Pozisyon Oluştur"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Pozisyon Başlığı *</label>
                        <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Departman *</label>
                        <input type="text" name="department" value={formData.department} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium">Açıklama</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Gereksinimler</label>
                    <textarea name="requirements" value={formData.requirements} onChange={handleInputChange} rows={4} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Durum</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                        <option value={JobOpeningStatus.Open}>Açık</option>
                        <option value={JobOpeningStatus.Closed}>Kapalı</option>
                    </select>
                </div>
                <div className="flex justify-end pt-4 gap-2">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit">Kaydet</Button>
                </div>
            </form>
        </Modal>
    );
};

export default JobOpeningFormModal;
