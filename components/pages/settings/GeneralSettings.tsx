
import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const GeneralSettings: React.FC = () => {
    const { companyInfo, updateCompanyInfo, hasPermission } = useApp();
    const [formData, setFormData] = useState(companyInfo);
    
    const canManage = hasPermission('ayarlar:genel-yonet');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateCompanyInfo(formData);
    };

    return (
        <Card title="Genel Şirket Bilgileri">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Şirket Adı</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} disabled={!canManage} className="mt-1 block w-full p-2 border rounded-md disabled:bg-slate-100 dark:bg-slate-700 dark:border-dark-border dark:disabled:bg-slate-800"/>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">E-posta</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} disabled={!canManage} className="mt-1 block w-full p-2 border rounded-md disabled:bg-slate-100 dark:bg-slate-700 dark:border-dark-border dark:disabled:bg-slate-800"/>
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Telefon</label>
                        <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} disabled={!canManage} className="mt-1 block w-full p-2 border rounded-md disabled:bg-slate-100 dark:bg-slate-700 dark:border-dark-border dark:disabled:bg-slate-800"/>
                    </div>
                </div>
                 <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Adres</label>
                    <input type="text" name="address" id="address" value={formData.address} onChange={handleInputChange} disabled={!canManage} className="mt-1 block w-full p-2 border rounded-md disabled:bg-slate-100 dark:bg-slate-700 dark:border-dark-border dark:disabled:bg-slate-800"/>
                </div>
                 <div>
                    <label htmlFor="website" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Web Sitesi</label>
                    <input type="url" name="website" id="website" value={formData.website} onChange={handleInputChange} disabled={!canManage} className="mt-1 block w-full p-2 border rounded-md disabled:bg-slate-100 dark:bg-slate-700 dark:border-dark-border dark:disabled:bg-slate-800"/>
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

export default GeneralSettings;