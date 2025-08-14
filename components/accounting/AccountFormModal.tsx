

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Account, AccountType } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface AccountFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: Account | null;
}

const AccountFormModal: React.FC<AccountFormModalProps> = ({ isOpen, onClose, account }) => {
    const { accounts, addAccount, updateAccount, taxRates } = useApp();
    
    const initialFormState: Omit<Account, 'id'> = {
        accountNumber: '',
        name: '',
        type: AccountType.Asset,
        balance: 0,
        parentId: undefined,
        defaultTaxRateId: undefined,
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (account) {
            setFormData(account);
        } else {
            setFormData(initialFormState);
        }
    }, [account, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'parentId' || name === 'defaultTaxRateId') {
            const numValue = parseInt(value);
            setFormData(prev => ({...prev, [name]: numValue > 0 ? numValue : undefined }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: name === 'balance' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.accountNumber && formData.type) {
            if (account) {
                updateAccount({ ...account, ...formData });
            } else {
                addAccount(formData);
            }
            onClose();
        } else {
            alert("Lütfen tüm zorunlu alanları doldurun.");
        }
    };
    
    const possibleParents = accounts.filter(acc => 
        acc.id !== account?.id && acc.type === formData.type
    );

    const showTaxRateField = formData.type === AccountType.Revenue || formData.type === AccountType.Expense;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={account ? "Hesabı Düzenle" : "Yeni Hesap Ekle"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Hesap Numarası *</label>
                        <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Hesap Adı *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium">Hesap Türü</label>
                    <select name="type" value={formData.type} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                        {Object.values(AccountType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium">Üst Hesap</label>
                    <select name="parentId" value={formData.parentId || 0} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                        <option value="0">Ana Hesap (Üst Hesap Yok)</option>
                        {possibleParents.map(parent => (
                             <option key={parent.id} value={parent.id}>{parent.accountNumber} - {parent.name}</option>
                        ))}
                    </select>
                </div>
                {showTaxRateField && (
                    <div>
                        <label className="block text-sm font-medium">Varsayılan Vergi Oranı</label>
                        <select name="defaultTaxRateId" value={formData.defaultTaxRateId || 0} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                            <option value="0">Vergi Yok</option>
                            {taxRates.map(rate => (
                                <option key={rate.id} value={rate.id}>{rate.name} ({(rate.rate * 100).toFixed(2)}%)</option>
                            ))}
                        </select>
                    </div>
                )}
                 <div>
                    <label className="block text-sm font-medium">Açılış Bakiyesi</label>
                    <input type="number" step="0.01" name="balance" value={formData.balance} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                    <p className="text-xs text-slate-500 mt-1">Not: Bir üst hesabın bakiyesi, alt hesaplarının toplamını yansıtacaktır. Bu alana girilen değer, sadece bu hesabın kendi işlemlerinin bakiyesidir.</p>
                </div>
                <div className="flex justify-end pt-4 gap-2">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit">Kaydet</Button>
                </div>
            </form>
        </Modal>
    );
};

export default AccountFormModal;
