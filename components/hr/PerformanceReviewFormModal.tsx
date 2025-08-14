import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PerformanceReview } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface PerformanceReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: PerformanceReview | null;
}

const PerformanceReviewFormModal: React.FC<PerformanceReviewFormModalProps> = ({ isOpen, onClose, review }) => {
    const { employees, addPerformanceReview, updatePerformanceReview } = useApp();
    
    const today = new Date().toISOString().split('T')[0];
    const initialFormState: Omit<PerformanceReview, 'id' | 'employeeName' | 'reviewerName'> = {
        employeeId: 0,
        reviewerId: 0,
        reviewDate: today,
        periodStartDate: '',
        periodEndDate: '',
        overallRating: 3,
        strengths: '',
        areasForImprovement: '',
        goalsForNextPeriod: '',
        status: 'Beklemede',
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (review) {
            setFormData(review);
        } else {
            setFormData(initialFormState);
        }
    }, [review, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name.includes('Id') || name === 'overallRating' ? parseInt(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.employeeId && formData.reviewerId) {
            if (review) {
                updatePerformanceReview({ ...review, ...formData });
            } else {
                addPerformanceReview(formData);
            }
            onClose();
        } else {
            alert("Lütfen çalışan ve değerlendirici seçin.");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={review ? "Değerlendirmeyi Düzenle" : "Yeni Performans Değerlendirmesi"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Çalışan *</label>
                        <select name="employeeId" value={formData.employeeId} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                            <option value="">Seçiniz...</option>
                            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Değerlendiren *</label>
                        <select name="reviewerId" value={formData.reviewerId} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                             <option value="">Seçiniz...</option>
                            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                    </div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Değerlendirme Dönemi Başlangıcı</label>
                        <input type="date" name="periodStartDate" value={formData.periodStartDate} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Değerlendirme Dönemi Bitişi</label>
                        <input type="date" name="periodEndDate" value={formData.periodEndDate} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium">Genel Değerlendirme Puanı (1-5)</label>
                    <input type="range" name="overallRating" min="1" max="5" value={formData.overallRating} onChange={handleInputChange} className="mt-1 w-full"/>
                    <div className="text-center font-bold">{formData.overallRating}</div>
                </div>
                <div>
                    <label className="block text-sm font-medium">Güçlü Yönler</label>
                    <textarea name="strengths" value={formData.strengths} onChange={handleInputChange} rows={3} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                </div>
                 <div>
                    <label className="block text-sm font-medium">Geliştirilecek Alanlar</label>
                    <textarea name="areasForImprovement" value={formData.areasForImprovement} onChange={handleInputChange} rows={3} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                </div>
                 <div>
                    <label className="block text-sm font-medium">Gelecek Dönem Hedefleri</label>
                    <textarea name="goalsForNextPeriod" value={formData.goalsForNextPeriod} onChange={handleInputChange} rows={3} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                </div>
                <div className="flex justify-end pt-4 gap-2">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit">Kaydet</Button>
                </div>
            </form>
        </Modal>
    );
};

export default PerformanceReviewFormModal;
