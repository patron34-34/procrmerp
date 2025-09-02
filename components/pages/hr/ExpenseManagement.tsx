
import React, { useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Expense, ExpenseStatus } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const ExpenseManagement: React.FC = () => {
    const { expenses, updateExpenseStatus, hasPermission } = useApp();
    const canManage = hasPermission('ik:masraf-yonet');

    const pendingExpenses = useMemo(() => expenses.filter(e => e.status === ExpenseStatus.Pending), [expenses]);
    const reviewedExpenses = useMemo(() => expenses.filter(e => e.status !== ExpenseStatus.Pending), [expenses]);

    const handleUpdateStatus = (expenseId: number, status: ExpenseStatus) => {
        if (canManage) {
            updateExpenseStatus(expenseId, status);
        }
    };

    const getStatusBadge = (status: ExpenseStatus) => {
        const styles: { [key in ExpenseStatus]: string } = {
            [ExpenseStatus.Pending]: 'bg-yellow-100 text-yellow-800',
            [ExpenseStatus.Approved]: 'bg-blue-100 text-blue-800',
            [ExpenseStatus.Paid]: 'bg-green-100 text-green-800',
            [ExpenseStatus.Rejected]: 'bg-red-100 text-red-800',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };
    
    const renderTable = (data: Expense[], title: string) => (
        <Card title={title}>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                        <th className="p-3">Çalışan</th><th className="p-3">Tarih</th><th className="p-3">Açıklama</th><th className="p-3">Tutar</th><th className="p-3">Durum</th>{canManage && <th className="p-3">Eylemler</th>}
                    </tr></thead>
                    <tbody>
                        {data.map(expense => (
                            <tr key={expense.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="p-3 font-medium">{expense.employeeName}</td>
                                <td className="p-3">{expense.submissionDate}</td>
                                <td className="p-3">{expense.description}</td>
                                <td className="p-3 font-mono text-right">${expense.amount.toLocaleString()}</td>
                                <td className="p-3">{getStatusBadge(expense.status)}</td>
                                {canManage && expense.status === ExpenseStatus.Pending && (
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={() => handleUpdateStatus(expense.id, ExpenseStatus.Approved)}>Onayla</Button>
                                            <Button size="sm" variant="danger" onClick={() => handleUpdateStatus(expense.id, ExpenseStatus.Rejected)}>Reddet</Button>
                                        </div>
                                    </td>
                                )}
                                {canManage && expense.status === ExpenseStatus.Approved && (
                                     <td className="p-3">
                                        <Button size="sm" onClick={() => handleUpdateStatus(expense.id, ExpenseStatus.Paid)}>Ödendi İşaretle</Button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );

    return (
        <div className="space-y-6">
            {renderTable(pendingExpenses, "Onay Bekleyen Masraf Talepleri")}
            {renderTable(reviewedExpenses, "İncelenmiş Masraf Talepleri")}
        </div>
    );
};

export default ExpenseManagement;