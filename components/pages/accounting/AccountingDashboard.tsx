import React, { useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BillStatus, TransactionType } from '../../../types';

const AccountingDashboard: React.FC = () => {
    const { bankAccounts, bills, transactions } = useApp();

    const stats = useMemo(() => {
        const totalCash = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);
        const totalPayable = bills.filter(b => b.status === BillStatus.Payable).reduce((sum, b) => sum + b.totalAmount, 0);

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentTransactions = transactions.filter(t => new Date(t.date) >= thirtyDaysAgo);

        const cashIn = recentTransactions.filter(t => t.type === TransactionType.Income).reduce((sum, t) => sum + t.amount, 0);
        const cashOut = recentTransactions.filter(t => t.type === TransactionType.Expense).reduce((sum, t) => sum + t.amount, 0);

        return { totalCash, totalPayable, cashIn, cashOut };
    }, [bankAccounts, bills, transactions]);

    const cashFlowChartData = [
        { name: 'Nakit Girişi', amount: stats.cashIn, fill: '#22c55e' },
        { name: 'Nakit Çıkışı', amount: stats.cashOut, fill: '#ef4444' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Muhasebe Paneli</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <h4 className="text-text-secondary dark:text-dark-text-secondary">Toplam Nakit</h4>
                    <p className="text-3xl font-bold text-green-600">${stats.totalCash.toLocaleString()}</p>
                </Card>
                <Card>
                    <h4 className="text-text-secondary dark:text-dark-text-secondary">Ödenecek Faturalar</h4>
                    <p className="text-3xl font-bold text-red-600">${stats.totalPayable.toLocaleString()}</p>
                </Card>
                <Card>
                    <h4 className="text-text-secondary dark:text-dark-text-secondary">Nakit Girişi (Son 30 gün)</h4>
                    <p className="text-3xl font-bold text-green-500">${stats.cashIn.toLocaleString()}</p>
                </Card>
                <Card>
                    <h4 className="text-text-secondary dark:text-dark-text-secondary">Nakit Çıkışı (Son 30 gün)</h4>
                    <p className="text-3xl font-bold text-red-500">${stats.cashOut.toLocaleString()}</p>
                </Card>
            </div>
            <Card title="Son 30 Günlük Nakit Akışı">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={cashFlowChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                        <YAxis tick={{ fill: '#94a3b8' }} />
                        <Tooltip wrapperClassName="!bg-card !border-slate-200 dark:!bg-dark-card dark:!border-dark-border rounded-md" contentStyle={{ backgroundColor: 'transparent' }}/>
                        <Bar dataKey="amount" fill="fill" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export default AccountingDashboard;