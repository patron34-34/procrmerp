import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RecurringJournalEntry, JournalEntryItem, RecurringFrequency } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import AccountSelector from './AccountSelector';
import { ICONS } from '../../constants';

interface RecurringJournalEntryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: RecurringJournalEntry | null;
}

const RecurringJournalEntryFormModal: React.FC<RecurringJournalEntryFormModalProps> = ({ isOpen, onClose, template }) => {
    const { accounts, addRecurringJournalEntry, updateRecurringJournalEntry } = useApp();
    
    const initialFormState: Omit<RecurringJournalEntry, 'id' | 'totalAmount'> = {
        name: '',
        frequency: RecurringFrequency.Monthly,
        startDate: new Date().toISOString().split('T')[0],
        nextDate: new Date().toISOString().split('T')[0],
        memoTemplate: '',
        items: [{ accountId: 0, debit: 0, credit: 0 }, { accountId: 0, debit: 0, credit: 0 }],
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (template) {
            setFormData(template);
        } else {
            setFormData(initialFormState);
        }
    }, [template, isOpen]);
    
    const { totalDebit, totalCredit, isBalanced } = useMemo(() => {
        const totalDebit = formData.items.reduce((sum, item) => sum + (item.debit || 0), 0);
        const totalCredit = formData.items.reduce((sum, item) => sum + (item.credit || 0), 0);
        return { totalDebit, totalCredit, isBalanced: Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0 };
    }, [formData.items]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index: number, field: keyof JournalEntryItem, value: any) => {
        const newItems = [...formData.items];
        const currentItem = { ...newItems[index] };
        
        if (field === 'debit' || field === 'credit') {
            currentItem[field] = parseFloat(value) || 0;
            if (field === 'debit' && currentItem.debit > 0) currentItem.credit = 0;
            if (field === 'credit' && currentItem.credit > 0) currentItem.debit = 0;
        } else {
            (currentItem as any)[field] = value;
        }
        
        newItems[index] = currentItem;
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setFormData(prev => ({...prev, items: [...prev.items, { accountId: 0, debit: 0, credit: 0 }]}));
    };

    const removeItem = (index: number) => {
        if (formData.items.length > 2) {
            setFormData(prev => ({...prev, items: prev.items.filter((_, i) => i !== index)}));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isBalanced || !formData.name.trim() || !formData.memoTemplate.trim()) {
            alert("Lütfen tüm alanları doğru doldurun ve borç/alacak toplamlarının eşit olduğundan emin olun.");
            return;
        }

        const finalData = { ...formData, totalAmount: totalDebit };

        if (template) {
            updateRecurringJournalEntry({ ...template, ...finalData });
        } else {
            addRecurringJournalEntry(finalData);
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={template ? "Tekrarlanan Kayıt Şablonunu Düzenle" : "Yeni Tekrarlanan Kayıt Şablonu"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Şablon Adı *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Fiş Açıklama Şablonu *</label>
                        <input type="text" name="memoTemplate" value={formData.memoTemplate} onChange={handleInputChange} required placeholder="Örn: {AY} {YIL} Kira Gideri" className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                    </div>
                </div>
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                     <div>
                        <label className="block text-sm font-medium">Sıklık</label>
                        <select name="frequency" value={formData.frequency} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                            {Object.values(RecurringFrequency).map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Başlangıç Tarihi</label>
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Bitiş Tarihi (Opsiyonel)</label>
                        <input type="date" name="endDate" value={formData.endDate || ''} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Sıradaki Fiş Tarihi</label>
                        <input type="date" name="nextDate" value={formData.nextDate} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                    </div>
                </div>
                
                <div className="border-t pt-4 dark:border-dark-border">
                    <h4 className="font-semibold mb-2">Yevmiye Kalemleri</h4>
                    <div className="space-y-2">
                    {formData.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-[1fr_80px_80px_auto] gap-2 items-center">
                            <AccountSelector accounts={accounts} value={item.accountId} onChange={accId => handleItemChange(index, 'accountId', accId)} />
                            <input type="number" step="0.01" placeholder="Borç" value={item.debit || ''} onChange={e => handleItemChange(index, 'debit', e.target.value)} className="w-full p-2 border rounded-md text-right dark:bg-slate-800 dark:border-dark-border"/>
                            <input type="number" step="0.01" placeholder="Alacak" value={item.credit || ''} onChange={e => handleItemChange(index, 'credit', e.target.value)} className="w-full p-2 border rounded-md text-right dark:bg-slate-800 dark:border-dark-border"/>
                            <button type="button" onClick={() => removeItem(index)} disabled={formData.items.length <= 2} className="text-red-500 hover:text-red-700 disabled:opacity-50">{ICONS.trash}</button>
                        </div>
                    ))}
                    </div>
                    <Button type="button" variant="secondary" onClick={addItem} className="mt-2 text-sm">Satır Ekle</Button>
                </div>
                
                <div className="flex justify-end pt-4 gap-4 font-bold">
                    <span>Borç: ${totalDebit.toLocaleString()}</span>
                    <span>Alacak: ${totalCredit.toLocaleString()}</span>
                    <span className={isBalanced ? 'text-green-600' : 'text-red-500'}>
                        {isBalanced ? 'Dengede' : 'Dengede Değil'}
                    </span>
                </div>

                <div className="flex justify-end pt-4 gap-2 border-t dark:border-dark-border">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit" disabled={!isBalanced}>Kaydet</Button>
                </div>
            </form>
        </Modal>
    );
};

export default RecurringJournalEntryFormModal;
