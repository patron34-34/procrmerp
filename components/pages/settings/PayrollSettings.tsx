import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { HrParameters } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import { useNotification } from '../../../context/NotificationContext';

const InputField: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium">{label}</label>
        <input {...props} type="number" step="any" className="mt-1 w-full p-2 border rounded-md disabled:bg-slate-100 dark:bg-slate-700 dark:border-dark-border dark:disabled:bg-slate-800"/>
    </div>
);


const PayrollSettings: React.FC = () => {
    const { hrParameters, updateHrParameters, hasPermission } = useApp();
    const { addToast } = useNotification();
    const [formData, setFormData] = useState<HrParameters>(hrParameters);
    
    const canManage = hasPermission('ayarlar:ik-bordro-yonet');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };
    
    const handleBracketChange = (index: number, field: 'limit' | 'rate', value: string) => {
        const newBrackets = [...formData.INCOME_TAX_BRACKETS];
        const numValue = parseFloat(value) || 0;
        newBrackets[index] = { ...newBrackets[index], [field]: field === 'rate' ? numValue / 100 : numValue };
        setFormData(prev => ({ ...prev, INCOME_TAX_BRACKETS: newBrackets }));
    };

    const addBracket = () => {
        const newBrackets = [...formData.INCOME_TAX_BRACKETS, { limit: 0, rate: 0 }];
        setFormData(prev => ({ ...prev, INCOME_TAX_BRACKETS: newBrackets }));
    };

    const removeBracket = (index: number) => {
        if (formData.INCOME_TAX_BRACKETS.length > 1) {
            const newBrackets = formData.INCOME_TAX_BRACKETS.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, INCOME_TAX_BRACKETS: newBrackets }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateHrParameters(formData);
        addToast('Bordro parametreleri başarıyla güncellendi.', 'success');
    };

    return (
        <Card title="İK & Bordro Parametreleri">
            <form onSubmit={handleSubmit} className="space-y-6">
                <details open>
                    <summary className="font-semibold text-lg cursor-pointer">Temel Parametreler</summary>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                        <InputField label="Asgari Ücret (Brüt)" name="MINIMUM_WAGE_GROSS" value={formData.MINIMUM_WAGE_GROSS} onChange={handleInputChange} disabled={!canManage} />
                        <InputField label="SGK Tavanı" name="SGK_CEILING" value={formData.SGK_CEILING} onChange={handleInputChange} disabled={!canManage} />
                        <InputField label="Kıdem Tazminatı Tavanı" name="SEVERANCE_CEILING" value={formData.SEVERANCE_CEILING} onChange={handleInputChange} disabled={!canManage} />
                    </div>
                </details>
                
                <details>
                    <summary className="font-semibold text-lg cursor-pointer">SGK & Damga Vergisi Oranları</summary>
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                         <InputField label="Çalışan SGK Oranı (%)" name="EMPLOYEE_SGK_RATE" value={formData.EMPLOYEE_SGK_RATE * 100} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, EMPLOYEE_SGK_RATE: parseFloat(e.target.value)/100})} disabled={!canManage} />
                         <InputField label="Çalışan İşsizlik Oranı (%)" name="EMPLOYEE_UNEMPLOYMENT_RATE" value={formData.EMPLOYEE_UNEMPLOYMENT_RATE * 100} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, EMPLOYEE_UNEMPLOYMENT_RATE: parseFloat(e.target.value)/100})} disabled={!canManage} />
                         <InputField label="İşveren SGK Oranı (%)" name="EMPLOYER_SGK_RATE" value={formData.EMPLOYER_SGK_RATE * 100} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, EMPLOYER_SGK_RATE: parseFloat(e.target.value)/100})} disabled={!canManage} />
                         <InputField label="İşveren İşsizlik Oranı (%)" name="EMPLOYER_UNEMPLOYMENT_RATE" value={formData.EMPLOYER_UNEMPLOYMENT_RATE * 100} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, EMPLOYER_UNEMPLOYMENT_RATE: parseFloat(e.target.value)/100})} disabled={!canManage} />
                         <InputField label="Damga Vergisi Oranı (Binde)" name="STAMP_DUTY_RATE" value={formData.STAMP_DUTY_RATE * 1000} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, STAMP_DUTY_RATE: parseFloat(e.target.value)/1000})} disabled={!canManage} />
                     </div>
                </details>

                <details>
                    <summary className="font-semibold text-lg cursor-pointer">Gelir Vergisi Dilimleri</summary>
                     <div className="pt-4 space-y-2">
                         {formData.INCOME_TAX_BRACKETS.map((bracket, index) => (
                            <div key={index} className="grid grid-cols-[2fr_1fr_auto] gap-2 items-center">
                                <div className="flex items-center gap-2">
                                    <span>Limit:</span>
                                    <input type="number" value={bracket.limit === Infinity ? '' : bracket.limit} onChange={e => handleBracketChange(index, 'limit', e.target.value)} placeholder="Sonsuz" disabled={!canManage} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>Oran (%):</span>
                                    <input type="number" value={bracket.rate * 100} onChange={e => handleBracketChange(index, 'rate', e.target.value)} disabled={!canManage} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                                </div>
                                 <button type="button" onClick={() => removeBracket(index)} disabled={!canManage} className="p-1 text-red-500 hover:text-red-700">{ICONS.trash}</button>
                            </div>
                        ))}
                        {canManage && <Button type="button" variant="secondary" onClick={addBracket}>Dilim Ekle</Button>}
                     </div>
                </details>

                {canManage && (
                    <div className="flex justify-end pt-4 border-t dark:border-dark-border">
                        <Button type="submit">Parametreleri Kaydet</Button>
                    </div>
                )}
            </form>
        </Card>
    );
};

export default PayrollSettings;
