import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Budget, BudgetItem, AccountType } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import AccountSelector from './AccountSelector';
import { ICONS } from '../../constants';

interface BudgetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: Budget | null;
}

const BudgetFormModal: React.FC<BudgetFormModalProps> = ({ isOpen, onClose, budget }) => {
    const { accounts, addBudget, updateBudget } = useApp();
    
    const initialFormState: Omit<Budget, 'id'> = {
        name: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        items: [{ accountId: 0, amount: 0, accountName: '' }],
    };
    const [formData, setFormData] = useState(initialFormState);

    const availableAccounts = useMemo(() => {
        return accounts.filter(a => a.type === AccountType.Revenue || a.type === AccountType.Expense);
    }, [accounts]);

    useEffect(() => {
        if (budget) {
            setFormData({
                name: budget.name,
                startDate: budget.startDate,
                endDate: budget.endDate,
                items: budget.items.map(item => ({...item, accountName: accounts.find(a=>a.id === item.accountId)?.name || ''})),
            });
        } else {
            const defaultAccountId = availableAccounts[0]?.id || 0;
            setFormData({
                ...initialFormState,
                items: [{ accountId: defaultAccountId, amount: 0, accountName: '' }]
            });
        }
    }, [budget, isOpen, accounts, availableAccounts]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index: number, field: keyof BudgetItem, value: any) => {
        const newItems = [...formData.items];
        const currentItem = { ...newItems[index] };
        
        if (field === 'accountId') {
            currentItem.accountId = parseInt(value);
        } else if (field === 'amount') {
            currentItem.amount = parseFloat(value) || 0;
        }

        newItems[index] = currentItem;
        setFormData(prev => ({ ...prev, items: newItems }));
    };
    
    const addItem = () => {
        const defaultAccountId = availableAccounts.find(acc => !formData.items.some(item => item.accountId === acc.id))?.id || availableAccounts[0]?.id || 0;
        setFormData(prev => ({...prev, items: [...prev.items, { accountId: defaultAccountId, amount: 0, accountName: '' }]}));
    };

    const removeItem = (index: number) => {
        if (formData.items.length > 1) {
            setFormData(prev => ({...prev, items: prev.items.filter((_, i) => i !== index)}));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validItems = formData.items.filter(item => item.accountId > 0 && item.amount > 0);

        if (formData.name.trim() && validItems.length > 0) {
            const finalItems: BudgetItem[] = validItems.map(item => ({
                accountId: item.accountId,
                amount: item.amount,
                accountName: accounts.find(a => a.id === item.accountId)?.name || 'Bilinmeyen Hesap'
            }));
            
            const budgetData = {
                name: formData.name,
                startDate: formData.startDate,
                endDate: formData.endDate,
                items: finalItems,
            };

            if (budget) {
                updateBudget({ ...budget, ...budgetData });
            } else {
                addBudget(budgetData);
            }
            onClose();
        } else {
            alert("Lütfen bir bütçe adı ve en az bir bütçe kalemi (hesap ve tutar) girin.");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={budget ? "Bütçeyi Düzenle" : "Yeni Bütçe Oluştur"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Bütçe Adı *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Başlangıç Tarihi</label>
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Bitiş Tarihi</label>
                        <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                    </div>
                </div>

                <div className="border-t pt-4 dark:border-dark-border">
                    <h4 className="font-semibold mb-2">Bütçe Kalemleri</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {formData.items.map((item, index) => (
                            <div key={index} className="grid grid-cols-[1fr_120px_auto] gap-2 items-center">
                                <AccountSelector accounts={availableAccounts} value={item.accountId} onChange={accId => handleItemChange(index, 'accountId', accId)} />
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Tutar"
                                    value={item.amount || ''}
                                    onChange={e => handleItemChange(index, 'amount', e.target.value)}
                                    className="w-full p-2 border rounded-md text-right dark:bg-slate-800 dark:border-dark-border"
                                />
                                <button type="button" onClick={() => removeItem(index)} disabled={formData.items.length <= 1} className="text-red-500 hover:text-red-700 disabled:opacity-50">{ICONS.trash}</button>
                            </div>
                        ))}
                    </div>
                    <Button type="button" variant="secondary" onClick={addItem} className="mt-2 text-sm">Kalem Ekle</Button>
                </div>

                <div className="flex justify-end pt-4 gap-2 border-t dark:border-dark-border">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit">Kaydet</Button>
                </div>
            </form>
        </Modal>
    );
};

export default BudgetFormModal;