import React, { useState, useEffect } from 'react';
import { Payslip } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useApp } from '../../context/AppContext';
import { ICONS, SGK_MISSING_DAY_REASONS } from '../../constants';
import { generatePuantajFromPrompt } from '../../services/geminiService';
import { useNotification } from '../../context/NotificationContext';

interface PuantajEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  payslip: Payslip;
}

const InputField: React.FC<{ label: string; name: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, name, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium">{label}</label>
        <input id={name} name={name} type="number" {...props} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border text-right"/>
    </div>
);

const PuantajEditModal: React.FC<PuantajEditModalProps> = ({ isOpen, onClose, payslip }) => {
    const { updatePayslip } = useApp();
    const { addToast } = useNotification();
    const [formData, setFormData] = useState(payslip);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        setFormData(payslip);
    }, [payslip, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if(name === 'eksikGunNedeni') {
            setFormData(prev => ({ ...prev, [name]: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: Number(value) || 0 }));
        }
    };

    const handleDynamicFieldChange = (index: number, type: 'ekOdemeler' | 'digerKesintiler', field: 'name' | 'amount', value: string) => {
        const newItems = [...formData[type]];
        const newItem = { ...newItems[index] };
        
        if (field === 'name') {
            newItem.name = value;
        } else {
            newItem.amount = parseFloat(value) || 0;
        }

        newItems[index] = newItem;
        setFormData(prev => ({ ...prev, [type]: newItems }));
    };

    const addDynamicField = (type: 'ekOdemeler' | 'digerKesintiler') => {
        setFormData(prev => ({ ...prev, [type]: [...prev[type], { name: '', amount: 0 }] }));
    };
    
    const removeDynamicField = (index: number, type: 'ekOdemeler' | 'digerKesintiler') => {
        setFormData(prev => ({ ...prev, [type]: prev[type].filter((_, i) => i !== index) }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updatePayslip(formData);
        onClose();
    };

    const handleGenerateWithAI = async () => {
        if (!aiPrompt.trim()) return;
        setIsGenerating(true);
        try {
            const result = await generatePuantajFromPrompt(aiPrompt);
            setFormData(prev => ({
                ...prev,
                ...result
            }));
            addToast("Puantaj alanları AI tarafından dolduruldu.", "success");
        } catch (error: any) {
            addToast(error.message, "error");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const totalSgkDays = (formData.normalCalismaGunu || 0) + (formData.haftaTatili || 0) + (formData.genelTatil || 0) + (formData.ucretliIzin || 0) + (formData.raporluGun || 0);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${payslip.employeeName} - Puantaj Kartı`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-3 border rounded-lg bg-slate-50 dark:bg-slate-800/50 dark:border-dark-border space-y-3">
                    <label htmlFor="aiPrompt" className="block text-sm font-semibold">AI ile Hızlı Giriş</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            id="aiPrompt"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="Örn: 5 saat fazla mesai, 2 gün raporlu, 8 saat resmi tatil..."
                            className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                            disabled={isGenerating}
                        />
                        <Button type="button" onClick={handleGenerateWithAI} disabled={isGenerating || !aiPrompt.trim()}>
                            {isGenerating ? '...' : 'Doldur'}
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <InputField label="Normal Çalışma Günü" name="normalCalismaGunu" value={formData.normalCalismaGunu} onChange={handleInputChange} />
                    <InputField label="Hafta Tatili" name="haftaTatili" value={formData.haftaTatili} onChange={handleInputChange} />
                    <InputField label="Genel Tatil" name="genelTatil" value={formData.genelTatil} onChange={handleInputChange} />
                    <InputField label="Ücretli İzin" name="ucretliIzin" value={formData.ucretliIzin} onChange={handleInputChange} />
                    <InputField label="Raporlu Gün" name="raporluGun" value={formData.raporluGun} onChange={handleInputChange} />
                    <InputField label="Ücretsiz İzin" name="ucretsizIzin" value={formData.ucretsizIzin} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t pt-4 mt-4 dark:border-dark-border">
                    <InputField label="Fazla Mesai (Saat)" name="fazlaMesaiSaati" value={formData.fazlaMesaiSaati} onChange={handleInputChange} />
                    <InputField label="Resmi Tatil Mesaisi (Saat)" name="resmiTatilMesaisi" value={formData.resmiTatilMesaisi} onChange={handleInputChange} />
                    <InputField label="Gece Vardiyası (Saat)" name="geceVardiyasiSaati" value={formData.geceVardiyasiSaati} onChange={handleInputChange} />
                </div>
                 <div className="border-t pt-4 mt-4 dark:border-dark-border">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">Ek Ödemeler</h4>
                        <Button type="button" size="sm" variant="secondary" onClick={() => addDynamicField('ekOdemeler')}>Ekle</Button>
                    </div>
                    <div className="space-y-2">
                        {formData.ekOdemeler.map((item, index) => (
                            <div key={index} className="grid grid-cols-[2fr_1fr_auto] gap-2 items-center">
                                <input type="text" placeholder="Ödeme Adı" value={item.name} onChange={e => handleDynamicFieldChange(index, 'ekOdemeler', 'name', e.target.value)} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                                <input type="number" placeholder="Tutar" value={item.amount} onChange={e => handleDynamicFieldChange(index, 'ekOdemeler', 'amount', e.target.value)} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border text-right" />
                                <button type="button" onClick={() => removeDynamicField(index, 'ekOdemeler')} className="p-1 text-red-500 hover:text-red-700">{ICONS.trash}</button>
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="border-t pt-4 mt-4 dark:border-dark-border">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">Diğer Kesintiler</h4>
                        <Button type="button" size="sm" variant="secondary" onClick={() => addDynamicField('digerKesintiler')}>Ekle</Button>
                    </div>
                    <div className="space-y-2">
                         {formData.digerKesintiler.map((item, index) => (
                            <div key={index} className="grid grid-cols-[2fr_1fr_auto] gap-2 items-center">
                                <input type="text" placeholder="Kesinti Adı" value={item.name} onChange={e => handleDynamicFieldChange(index, 'digerKesintiler', 'name', e.target.value)} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                                <input type="number" placeholder="Tutar" value={item.amount} onChange={e => handleDynamicFieldChange(index, 'digerKesintiler', 'amount', e.target.value)} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border text-right" />
                                <button type="button" onClick={() => removeDynamicField(index, 'digerKesintiler')} className="p-1 text-red-500 hover:text-red-700">{ICONS.trash}</button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-4 dark:border-dark-border">
                    <InputField label="Eksik Gün" name="eksikGun" value={formData.eksikGun} onChange={handleInputChange} />
                    <div>
                        <label htmlFor="eksikGunNedeni" className="block text-sm font-medium">Eksik Gün Nedeni</label>
                        <select id="eksikGunNedeni" name="eksikGunNedeni" value={formData.eksikGunNedeni || ''} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                            <option value="">Seçiniz...</option>
                            {SGK_MISSING_DAY_REASONS.map(r => <option key={r.code} value={r.code}>{r.code} - {r.description}</option>)}
                        </select>
                    </div>
                </div>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/50 text-center font-bold rounded-md">
                    Toplam SGK Günü: {totalSgkDays}
                </div>
                <div className="flex justify-end pt-4 gap-2">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit">Kaydet ve Yeniden Hesapla</Button>
                </div>
            </form>
        </Modal>
    );
};

export default PuantajEditModal;
