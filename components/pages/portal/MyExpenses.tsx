import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Expense, ExpenseStatus, Attachment } from '../../../types';
import Card from '../../ui/Card';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import EmptyState from '../../ui/EmptyState';

const MyExpenses: React.FC = () => {
    const { currentUser, expenses, addExpense } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const today = new Date().toISOString().split('T')[0];
    const initialFormState: Omit<Expense, 'id' | 'employeeName' | 'status' | 'employeeId'> = {
        submissionDate: today,
        description: '',
        category: 'Diğer',
        amount: 0,
        attachments: []
    };
    const [formData, setFormData] = useState(initialFormState);

    const myExpenses = useMemo(() => {
        return expenses.filter(e => e.employeeId === currentUser.id)
            .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
    }, [expenses, currentUser.id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.description && formData.amount > 0) {
            addExpense(formData);
            setIsModalOpen(false);
            setFormData(initialFormState);
        }
    };
    
    const getStatusBadge = (status: ExpenseStatus) => {
        const styles: { [key in ExpenseStatus]: string } = {
            [ExpenseStatus.Pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            [ExpenseStatus.Approved]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            [ExpenseStatus.Paid]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            [ExpenseStatus.Rejected]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };

    return (
        <>
            <Card
                title="Masraf Taleplerim"
                action={<Button onClick={() => setIsModalOpen(true)}><span className="flex items-center gap-2">{ICONS.add} Yeni Masraf Talebi</span></Button>}
            >
                <div className="overflow-x-auto">
                    {myExpenses.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                                <th className="p-3">Tarih</th><th className="p-3">Açıklama</th><th className="p-3">Kategori</th><th className="p-3 text-right">Tutar</th><th className="p-3">Durum</th>
                            </tr></thead>
                            <tbody>
                                {myExpenses.map(expense => (
                                    <tr key={expense.id} className="border-b dark:border-dark-border">
                                        <td className="p-3">{expense.submissionDate}</td>
                                        <td className="p-3">{expense.description}</td>
                                        <td className="p-3">{expense.category}</td>
                                        <td className="p-3 text-right font-mono">${expense.amount.toLocaleString()}</td>
                                        <td className="p-3">{getStatusBadge(expense.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                         <EmptyState 
                            icon={ICONS.expenses}
                            title="Masraf Talebi Bulunamadı"
                            description="Henüz oluşturulmuş bir masraf talebiniz bulunmuyor."
                            action={<Button onClick={() => setIsModalOpen(true)}>Yeni Masraf Talebi Oluştur</Button>}
                        />
                    )}
                </div>
            </Card>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yeni Masraf Talebi">
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div><label className="block text-sm font-medium">Tarih</label><input type="date" name="submissionDate" value={formData.submissionDate} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
                     <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium">Tutar *</label><input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
                        <div><label className="block text-sm font-medium">Kategori</label><select name="category" value={formData.category} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"><option>Seyahat</option><option>Yemek</option><option>Ofis Malzemeleri</option><option>Diğer</option></select></div>
                     </div>
                     <div><label className="block text-sm font-medium">Açıklama *</label><textarea name="description" value={formData.description} onChange={handleInputChange} required rows={3} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
                     <div className="flex justify-end pt-4 gap-2">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>İptal</Button>
                        <Button type="submit">Gönder</Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default MyExpenses;
