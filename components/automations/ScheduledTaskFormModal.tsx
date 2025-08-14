import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ScheduledTask, TaskTemplate } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface ScheduledTaskFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    schedule: ScheduledTask | null;
}

const ScheduledTaskFormModal: React.FC<ScheduledTaskFormModalProps> = ({ isOpen, onClose, schedule }) => {
    const { taskTemplates, addScheduledTask, updateScheduledTask } = useApp();

    const initialFormState: Omit<ScheduledTask, 'id'> = {
        name: '',
        taskTemplateId: 0,
        rrule: 'FREQ=MONTHLY;BYMONTHDAY=1',
        startDate: new Date().toISOString().split('T')[0],
        nextRunDate: new Date().toISOString().split('T')[0],
        enabled: true,
    };
    const [formData, setFormData] = useState(initialFormState);
    const [freq, setFreq] = useState('MONTHLY');
    const [dayOfMonth, setDayOfMonth] = useState(1);

    useEffect(() => {
        if (schedule) {
            setFormData(schedule);
            const rruleParts = schedule.rrule.split(';');
            const freqPart = rruleParts.find(p => p.startsWith('FREQ='))?.split('=')[1];
            const dayPart = rruleParts.find(p => p.startsWith('BYMONTHDAY='))?.split('=')[1];
            if (freqPart) setFreq(freqPart);
            if (dayPart) setDayOfMonth(parseInt(dayPart));
        } else {
            setFormData(initialFormState);
            setFreq('MONTHLY');
            setDayOfMonth(1);
        }
    }, [schedule, isOpen]);

    useEffect(() => {
        const rrule = `FREQ=${freq};BYMONTHDAY=${dayOfMonth}`;
        setFormData(prev => ({ ...prev, rrule }));
    }, [freq, dayOfMonth]);
    
    useEffect(() => {
        if (formData.startDate) {
            setFormData(prev => ({...prev, nextRunDate: prev.startDate}));
        }
    }, [formData.startDate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: name.includes('Id') ? parseInt(value) : value }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.taskTemplateId && formData.rrule) {
            if (schedule) {
                updateScheduledTask({ ...schedule, ...formData });
            } else {
                addScheduledTask(formData);
            }
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={schedule ? "Planı Düzenle" : "Yeni Görev Planı Oluştur"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField label="Plan Adı *" name="name" value={formData.name} onChange={handleInputChange} required />
                <div>
                    <label className="block text-sm font-medium">Görev Şablonu *</label>
                    <select name="taskTemplateId" value={formData.taskTemplateId} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                        <option value={0} disabled>Seçiniz...</option>
                        {taskTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Tekrarlama Kuralı</label>
                    <div className="grid grid-cols-2 gap-4 mt-1">
                        <select value={freq} onChange={(e) => setFreq(e.target.value)} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                            <option value="MONTHLY">Aylık</option>
                            <option value="WEEKLY">Haftalık</option>
                        </select>
                         <input type="number" min="1" max="31" value={dayOfMonth} onChange={(e) => setDayOfMonth(Number(e.target.value))} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" placeholder="Ayın günü" />
                    </div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <InputField label="Başlangıç Tarihi" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} />
                    <InputField label="Bitiş Tarihi (Opsiyonel)" name="endDate" type="date" value={formData.endDate || ''} onChange={handleInputChange} />
                </div>
                 <div className="flex items-center">
                    <input type="checkbox" id="enabled" name="enabled" checked={formData.enabled} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"/>
                    <label htmlFor="enabled" className="ml-2 block text-sm">Bu planı aktifleştir</label>
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

export default ScheduledTaskFormModal;
