
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import { AccountType } from '../../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Button from '../../ui/Button';

const BudgetDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { budgets, accounts, journalEntries } = useApp();

    const budgetId = parseInt(id || '', 10);
    const budget = useMemo(() => budgets.find(b => b.id === budgetId), [budgets, budgetId]);

    const budgetDetails = useMemo(() => {
        if (!budget) return [];

        const budgetStartDate = new Date(budget.startDate);
        const budgetEndDate = new Date(budget.endDate);
        budgetEndDate.setHours(23, 59, 59, 999);

        const relevantJournalEntries = journalEntries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= budgetStartDate && entryDate <= budgetEndDate;
        });

        return budget.items.map(item => {
            const account = accounts.find(a => a.id === item.accountId);
            if (!account) return { ...item, actual: 0, difference: -item.amount, accountName: 'Bilinmeyen Hesap' };

            let actual = 0;
            for (const entry of relevantJournalEntries) {
                for (const entryItem of entry.items) {
                    if (entryItem.accountId === item.accountId) {
                         if (account.type === AccountType.Revenue) {
                            actual += entryItem.credit - entryItem.debit;
                        } else if (account.type === AccountType.Expense) {
                            actual += entryItem.debit - entryItem.credit;
                        }
                    }
                }
            }
            
            const difference = actual - item.amount;
            return {
                ...item,
                actual,
                difference,
                accountName: account.name
            };
        });
    }, [budget, accounts, journalEntries]);

    const chartData = useMemo(() => {
        return budgetDetails.map(item => ({
            name: item.accountName,
            'Bütçelenen': item.amount,
            'Gerçekleşen': item.actual,
        }));
    }, [budgetDetails]);

    if (!budget) {
        return (
            <Card title="Hata">
                <p>Bütçe bulunamadı. Lütfen <Link to="/accounting/budgets" className="text-primary-600 hover:underline">Bütçeler sayfasına</Link> geri dönün.</p>
            </Card>
        );
    }
    
    const totalBudgeted = budgetDetails.reduce((sum, item) => sum + item.amount, 0);
    const totalActual = budgetDetails.reduce((sum, item) => sum + item.actual, 0);
    const totalDifference = totalActual - totalBudgeted;


    return (
        <div className="space-y-6">
            <Card>
                 <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold">{budget.name}</h2>
                        <p className="text-text-secondary dark:text-dark-text-secondary">{budget.startDate} - {budget.endDate}</p>
                    </div>
                     <Link to="/accounting/budgets">
                        <Button variant="secondary">&larr; Bütçe Listesine Dön</Button>
                    </Link>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card><h4 className="text-text-secondary dark:text-dark-text-secondary">Toplam Bütçe</h4><p className="text-3xl font-bold">${totalBudgeted.toLocaleString()}</p></Card>
                <Card><h4 className="text-text-secondary dark:text-dark-text-secondary">Toplam Gerçekleşen</h4><p className="text-3xl font-bold">${totalActual.toLocaleString()}</p></Card>
                <Card>
                    <h4 className="text-text-secondary dark:text-dark-text-secondary">Fark</h4>
                    <p className={`text-3xl font-bold ${totalActual >= totalBudgeted ? 'text-red-600' : 'text-green-600'}`}>
                        ${totalDifference.toLocaleString()}
                    </p>
                </Card>
            </div>

            <Card title="Bütçe vs. Gerçekleşen Karşılaştırması">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                        <YAxis tick={{ fill: '#94a3b8' }} />
                        <Tooltip wrapperClassName="!bg-card !border-slate-200 dark:!bg-dark-card dark:!border-dark-border rounded-md" contentStyle={{ backgroundColor: 'transparent' }}/>
                        <Legend />
                        <Bar dataKey="Bütçelenen" fill="#8884d8" />
                        <Bar dataKey="Gerçekleşen" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card title="Detaylı Rapor">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-3 font-semibold">Hesap Adı</th>
                            <th className="p-3 font-semibold text-right">Bütçelenen Tutar</th>
                            <th className="p-3 font-semibold text-right">Gerçekleşen Tutar</th>
                            <th className="p-3 font-semibold text-right">Fark</th>
                        </tr></thead>
                        <tbody>
                            {budgetDetails.map(item => (
                                <tr key={item.accountId} className="border-b dark:border-dark-border">
                                    <td className="p-3 font-medium">{item.accountName}</td>
                                    <td className="p-3 text-right font-mono">${item.amount.toLocaleString()}</td>
                                    <td className="p-3 text-right font-mono">${item.actual.toLocaleString()}</td>
                                    <td className={`p-3 text-right font-mono ${item.actual > item.amount ? 'text-red-600' : 'text-green-600'}`}>
                                        ${item.difference.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="font-bold bg-slate-100 dark:bg-slate-800">
                            <tr>
                                <td className="p-3">Toplam</td>
                                <td className="p-3 text-right font-mono">${totalBudgeted.toLocaleString()}</td>
                                <td className="p-3 text-right font-mono">${totalActual.toLocaleString()}</td>
                                <td className={`p-3 text-right font-mono ${totalDifference > 0 ? 'text-red-600' : 'text-green-600'}`}>${totalDifference.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default BudgetDetail;
