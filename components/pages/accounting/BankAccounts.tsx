import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { BankAccount } from '../../../types';
import Card from '../../ui/Card';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import EmptyState from '../../ui/EmptyState';
import ConfirmationModal from '../../ui/ConfirmationModal';
import { ICONS } from '../../../constants';

const BankAccounts: React.FC = () => {
    const { bankAccounts, addBankAccount, updateBankAccount, deleteBankAccount, hasPermission } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
    const [accountToDelete, setAccountToDelete] = useState<BankAccount | null>(null);

    const canManageFinance = hasPermission('finans:yonet');

    const initialFormState: Omit<BankAccount, 'id'> = {
        accountName: '',
        accountNumber: '',
        bankName: '',
        balance: 0,
    };
    const [formData, setFormData] = useState(initialFormState);

    const resetForm = () => {
        setFormData(initialFormState);
        setEditingAccount(null);
    };

    const openModalForNew = () => {
        if (!canManageFinance) return;
        resetForm();
        setIsModalOpen(true);
    };

    const openModalForEdit = (account: BankAccount) => {
        if (!canManageFinance) return;
        setEditingAccount(account);
        setFormData(account);
        setIsModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'balance' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.accountName && formData.bankName) {
            if (editingAccount) {
                updateBankAccount({ ...editingAccount, ...formData });
            } else {
                addBankAccount(formData);
            }
            setIsModalOpen(false);
            resetForm();
        } else {
            alert("Lütfen tüm zorunlu alanları doldurun.");
        }
    };
    
    const handleDeleteConfirm = () => {
        if(accountToDelete) {
            deleteBankAccount(accountToDelete.id);
            setAccountToDelete(null);
        }
    };

    return (
        <>
            <Card
                title="Banka Hesapları"
                action={canManageFinance ? <Button onClick={openModalForNew}><span className="flex items-center gap-2">{ICONS.add} Yeni Hesap Ekle</span></Button> : undefined}
            >
                <div className="overflow-x-auto">
                    {bankAccounts.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-200 dark:border-dark-border">
                                <tr className="bg-slate-50 dark:bg-slate-900/50">
                                    <th className="p-4 font-semibold">Hesap Adı</th>
                                    <th className="p-4 font-semibold">Banka</th>
                                    <th className="p-4 font-semibold">Hesap Numarası</th>
                                    <th className="p-4 font-semibold">Bakiye</th>
                                    {canManageFinance && <th className="p-4 font-semibold">Eylemler</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {bankAccounts.map((account) => (
                                    <tr key={account.id} className="border-b border-slate-200 hover:bg-slate-50 dark:border-dark-border dark:hover:bg-slate-800/50">
                                        <td className="p-4 font-medium">{account.accountName}</td>
                                        <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{account.bankName}</td>
                                        <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{account.accountNumber}</td>
                                        <td className="p-4 font-semibold text-green-600">${account.balance.toLocaleString()}</td>
                                        {canManageFinance && <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => openModalForEdit(account)} className="text-slate-500 hover:text-primary-600 dark:hover:text-primary-400">{ICONS.edit}</button>
                                                <button onClick={() => setAccountToDelete(account)} className="text-slate-500 hover:text-red-600 dark:hover:text-red-500">{ICONS.trash}</button>
                                            </div>
                                        </td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState
                            icon={ICONS.bank}
                            title="Henüz Banka Hesabı Yok"
                            description="İlk banka hesabınızı ekleyerek finansal takibe başlayın."
                            action={canManageFinance ? <Button onClick={openModalForNew}>Hesap Ekle</Button> : undefined}
                        />
                    )}
                </div>
            </Card>

            {canManageFinance && <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAccount ? "Hesabı Düzenle" : "Yeni Banka Hesabı Ekle"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label htmlFor="accountName" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Hesap Adı *</label>
                           <input type="text" name="accountName" id="accountName" value={formData.accountName} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white"/>
                        </div>
                        <div>
                           <label htmlFor="bankName" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Banka Adı *</label>
                           <input type="text" name="bankName" id="bankName" value={formData.bankName} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="accountNumber" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Hesap Numarası</label>
                        <input type="text" name="accountNumber" id="accountNumber" value={formData.accountNumber} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white"/>
                    </div>
                     <div>
                       <label htmlFor="balance" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Başlangıç Bakiyesi</label>
                       <input type="number" step="0.01" name="balance" id="balance" value={formData.balance} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white"/>
                    </div>
                    <div className="flex justify-end pt-4 gap-2">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>İptal</Button>
                        <Button type="submit">{editingAccount ? "Güncelle" : "Ekle"}</Button>
                    </div>
                </form>
            </Modal>}

            {canManageFinance && <ConfirmationModal 
                isOpen={!!accountToDelete}
                onClose={() => setAccountToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Banka Hesabını Sil"
                message={`'${accountToDelete?.accountName}' adlı hesabı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
            />}
        </>
    );
};

export default BankAccounts;