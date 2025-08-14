

import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Transaction, TransactionType, TransactionCategory } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import { exportToCSV } from '../../../utils/csvExporter';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ExpenseSummaryReport: React.FC = () => {
    const { transactions } = useApp();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<TransactionCategory | 'all'>('all');

    const filteredExpenses = useMemo(() => {
        return transactions.filter(transaction => {
            if (transaction.type !== TransactionType.Expense) return false;
            const transactionDate = new Date(transaction.date);
            if (startDate && transactionDate < new Date(startDate)) return false;
            if (endDate && transactionDate > new Date(endDate)) return false;
            if (categoryFilter !== 'all' && transaction.category !== categoryFilter) return false;
            return true;
        });
    }, [transactions, startDate, endDate, categoryFilter]);

    const totalExpense = filteredExpenses.reduce((sum, t) => sum + t.amount, 0);

    const categoryChartData = useMemo(() => {
        const data: { [key: string]: number } = {};
        filteredExpenses.forEach(t => {
            if (!data[t.category]) data[t.category] = 0;
            data[t.category] += t.amount;
        });
        return Object.keys(data).map(key => ({ name: key, value: data[key] }));
    }, [filteredExpenses]);

    const CATEGORY_COLORS = ['#ef4444', '#f97316', '#eab308', '#8b5cf6', '#ec4899', '#64748b'];

    const handleExport = () => {
        const dataToExport = filteredExpenses.map(({ id, type, accountId, ...rest }) => rest);
        exportToCSV(dataToExport, 'gider_analiz_raporu.csv');
    };

    return (
        <div className="space-y-6">
            <Card title="Filtreler">
                <div className="flex flex-wrap items-center gap-4">
                     <div>
                        <label htmlFor="startDate" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Başlangıç Tarihi</label>
                        <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 p-2 border border-border rounded-md dark:bg-slate-700 dark:border-dark-border dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Bitiş Tarihi</label>
                        <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 p-2 border border-border rounded-md dark:bg-slate-700 dark:border-dark-border dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="categoryFilter" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Kategori</label>
                        <select id="categoryFilter" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value as TransactionCategory | 'all')} className="mt-1 p-2 border border-border rounded-md dark:bg-slate-700 dark:border-dark-border dark:text-white">
                            <option value="all">Tümü</option>
                            {Object.values(TransactionCategory).filter(c => c !== TransactionCategory.Sales).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="self-end">
                        <Button onClick={handleExport} variant="secondary">
                            <span className="flex items-center gap-2">{ICONS.export} Dışa Aktar</span>
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card><h4 className="text-text-secondary dark:text-dark-text-secondary">Toplam Gider</h4><p className="text-3xl font-bold text-red-600">${totalExpense.toLocaleString()}</p></Card>
                <Card title="Gider Dağılımı (Kategori Bazında)">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={categoryChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} label>
                                {categoryChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip wrapperClassName="!bg-card !border-slate-200 dark:!bg-dark-card dark:!border-dark-border rounded-md" contentStyle={{ backgroundColor: 'transparent' }}/>
                            <Legend wrapperStyle={{ color: '#94a3b8' }}/>
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>
            
            <Card title="Detaylı Gider Listesi">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-slate-200 dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-4 font-semibold">Tarih</th>
                            <th className="p-4 font-semibold">Açıklama</th>
                            <th className="p-4 font-semibold">Kategori</th>
                            <th className="p-4 font-semibold">Tutar</th>
                        </tr></thead>
                        <tbody>
                            {filteredExpenses.map((t) => (
                                <tr key={t.id} className="border-b border-slate-200 hover:bg-slate-50 dark:border-dark-border dark:hover:bg-slate-800/50">
                                    <td className="p-4">{t.date}</td>
                                    <td className="p-4 font-medium">{t.description}</td>
                                    <td className="p-4">{t.category}</td>
                                    <td className="p-4 font-semibold text-red-600">${t.amount.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default ExpenseSummaryReport;