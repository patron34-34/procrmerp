import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const CountersSettings: React.FC = () => {
    const { counters, updateCounters, hasPermission } = useApp();
    const [formData, setFormData] = useState(counters);
    
    const canManage = hasPermission('ayarlar:muhasebe-yonet');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'prefix' ? value : parseInt(value) || 0 }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateCounters(formData);
    };

    return (
        <Card title="Sayaç Ayarları (Fatura Numaralandırma)">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="prefix" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Fatura Ön Eki</label>
                    <input type="text" name="prefix" id="prefix" value={formData.prefix} onChange={handleInputChange} disabled={!canManage} className="mt-1 block w-full p-2 border rounded-md disabled:bg-slate-100 dark:bg-slate-700 dark:border-dark-border dark:disabled:bg-slate-800"/>
                    <p className="text-xs text-slate-500 mt-1">Örn: FAT-, INV-</p>
                </div>
                <div>
                    <label htmlFor="nextNumber" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Sonraki Numara</label>
                    <input type="number" name="nextNumber" id="nextNumber" value={formData.nextNumber} onChange={handleInputChange} disabled={!canManage} className="mt-1 block w-full p-2 border rounded-md disabled:bg-slate-100 dark:bg-slate-700 dark:border-dark-border dark:disabled:bg-slate-800"/>
                     <p className="text-xs text-slate-500 mt-1">Oluşturulacak bir sonraki fatura bu numarayı alacaktır.</p>
                </div>
                <div>
                    <label htmlFor="padding" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Sayı Uzunluğu (Sıfır Dolgusu)</label>
                    <input type="number" name="padding" id="padding" value={formData.padding} onChange={handleInputChange} disabled={!canManage} className="mt-1 block w-full p-2 border rounded-md disabled:bg-slate-100 dark:bg-slate-700 dark:border-dark-border dark:disabled:bg-slate-800"/>
                     <p className="text-xs text-slate-500 mt-1">Numaranın toplamda kaç haneli olacağını belirtir. Örn: 5 değeri '00001' gibi bir sonuç üretir.</p>
                </div>

                 {canManage && (
                    <div className="flex justify-end pt-4">
                        <Button type="submit">Değişiklikleri Kaydet</Button>
                    </div>
                )}
            </form>
        </Card>
    );
};

export default CountersSettings;
