
import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Transaction, TransactionType, TransactionCategory } from '../../../types';
import Card from '../../ui/Card';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import EmptyState from '../../ui/EmptyState';
import ConfirmationModal from '../../ui/ConfirmationModal';
import { ICONS } from '../../../constants';

const Transactions: React.FC = () => {
    const { transactions, bankAccounts, addTransaction, updateTransaction, deleteTransaction, hasPermission } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
    const [filter, setFilter] = useState('all');

    const canManageFinance = hasPermission('finans:yonet');

    const today = new Date().toISOString().split('T')[0];
    const initialFormState: Omit<Transaction, 'id' | 'journalEntryId'> = {
        date: today,
        description: '',
        amount: 0,
        type: TransactionType.Expense,
        category: TransactionCategory.Other,
        accountId: bankAccounts[0]?.id || 0,
    };
    const [formData, setFormData] = useState(initialFormState);

    const resetForm = () => {
        setFormData(initialFormState);
        setEditingTransaction(null);
    };

    const openModalForNew = () => {
        if (!canManageFinance) return;
        resetForm();
        setIsModalOpen(true);
    };

    const openModalForEdit = (transaction: Transaction) => {
        if (!canManageFinance) return;
        setEditingTransaction(transaction);
        setFormData(transaction);
        setIsModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isNumber = ['amount', 'accountId'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.description && formData.amount > 0 && formData.accountId) {
            if (editingTransaction) {
                updateTransaction({ ...editingTransaction, ...formData });
            } else {
                addTransaction(formData);
            }
            setIsModalOpen(false);
            resetForm();
        } else {
            alert("Lütfen tüm zorunlu alanları doldurun.");
        }
    };
    
    const handleDeleteConfirm = () => {
        if(transactionToDelete) {
            deleteTransaction(transactionToDelete.id);
            setTransactionToDelete(null);
        }
    };

    const filteredTransactions = transactions.filter(t => {
        if (filter === 'all') return true;
        return t.type === filter;
    });

    return (
        <>
            <Card
                title="Finansal İşlemler"
                action={canManageFinance ? <Button onClick={openModalForNew}><span className="flex items-center gap-2">{ICONS.add} Yeni İşlem Ekle</span></Button> : undefined}
            >
                 <div className="mb-4 flex gap-2">
                    <Button variant={filter === 'all' ? 'primary' : 'secondary'} onClick={() => setFilter('all')}>Tümü</Button>
                    <Button variant={filter === TransactionType.Income ? 'primary' : 'secondary'} onClick={() => setFilter(TransactionType.Income)}>Gelir</Button>
                    <Button variant={filter === TransactionType.Expense ? 'primary' : 'secondary'} onClick={() => setFilter(TransactionType.Expense)}>Gider</Button>
                </div>
                <div className="overflow-x-auto">
                    {filteredTransactions.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-200 dark:border-dark-border">
                                <tr className="bg-slate-50 dark:bg-slate-900/50">
                                    <th className="p-4 font-semibold">Tarih</th>
                                    <th className="p-4 font-semibold">Açıklama</th>
                                    <th className="p-4 font-semibold">Kategori</th>
                                    <th className="p-4 font-semibold">Tutar</th>
                                    {canManageFinance && <th className="p-4 font-semibold">Eylemler</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((transaction) => (
                                    <tr key={transaction.id} className="border-b border-slate-200 hover:bg-slate-50 dark:border-dark-border dark:hover:bg-slate-800/50">
                                        <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{transaction.date}</td>
                                        <td className="p-4 font-medium">{transaction.description}</td>
                                        <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{transaction.category}</td>
                                        <td className={`p-4 font-semibold ${transaction.type === TransactionType.Income ? 'text-green-600' : 'text-red-600'}`}>
                                            {transaction.type === TransactionType.Income ? '+' : '-'}${transaction.amount.toLocaleString()}
                                        </td>
                                        {canManageFinance && <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => openModalForEdit(transaction)} className="text-slate-500 hover:text-primary-600 dark:hover:text-primary-400">{ICONS.edit}</button>
                                                <button onClick={() => setTransactionToDelete(transaction)} className="text-slate-500 hover:text-red-600 dark:hover:text-red-500">{ICONS.trash}</button>
                                            </div>
                                        </td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState
                            icon={ICONS.transfer}
                            title="Henüz Finansal İşlem Yok"
                            description="İlk gelirinizi veya giderinizi ekleyerek başlayın."
                            action={canManageFinance ? <Button onClick={openModalForNew}>İşlem Ekle</Button> : undefined}
                        />
                    )}
                </div>
            </Card>

            {canManageFinance && <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTransaction ? "İşlemi Düzenle" : "Yeni İşlem Ekle"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Açıklama *</label>
                        <input type="text" name="description" id="description" value={formData.description} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="amount" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Tutar ($) *</label>
                            <input type="number" step="0.01" name="amount" id="amount" value={formData.amount} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white"/>
                        </div>
                        <div>
                           <label htmlFor="date" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Tarih</label>
                           <input type="date" name="date" id="date" value={formData.date} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white"/>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="type" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Tür *</label>
                            <select name="type" id="type" value={formData.type} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white">
                                {Object.values(TransactionType).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Kategori *</label>
                            <select name="category" id="category" value={formData.category} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white">
                                {Object.values(TransactionCategory).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="accountId" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Banka Hesabı *</label>
                        <select name="accountId" id="accountId" value={formData.accountId} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white">
                           {bankAccounts.map(a => <option key={a.id} value={a.id}>{a.accountName} (Bakiye: ${a.balance.toLocaleString()})</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end pt-4 gap-2">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>İptal</Button>
                        <Button type="submit">{editingTransaction ? "Güncelle" : "Ekle"}</Button>
                    </div>
                </form>
            </Modal>}

            {canManageFinance && <ConfirmationModal 
                isOpen={!!transactionToDelete}
                onClose={() => setTransactionToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="İşlemi Sil"
                message={`Bu işlemi ve buna bağlı yevmiye kaydını kalıcı olarak silmek istediğinizden emin misiniz?`}
            />}
        </>
    );
};

export default Transactions;
