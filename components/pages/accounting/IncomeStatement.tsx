import React, { useMemo, useState, Fragment } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import { Account, AccountType, JournalEntryStatus } from '../../../types';
import Button from '../../ui/Button';
import { Link, useNavigate } from 'react-router-dom';

const IncomeStatement: React.FC = () => {
    const { accounts, journalEntries } = useApp();
    const navigate = useNavigate();

    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const [startDate, setStartDate] = useState(firstDayOfYear.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);

    const childrenMap = useMemo(() => {
        const map = new Map<number | undefined, Account[]>();
        accounts.forEach(acc => {
            const parentId = acc.parentId;
            if (!map.has(parentId)) map.set(parentId, []);
            map.get(parentId)!.push(acc);
        });
        map.forEach(children => children.sort((a, b) => a.accountNumber.localeCompare(b.accountNumber)));
        return map;
    }, [accounts]);

    const periodChangeMap = useMemo(() => {
        const changes = new Map<number, number>();
        if (!startDate || !endDate) return changes;

        const periodJournals = journalEntries.filter(j => j.date >= startDate && j.date <= endDate && j.status === JournalEntryStatus.Posted);

        accounts.forEach(acc => {
            if (acc.type === AccountType.Revenue || acc.type === AccountType.Expense) {
                const balanceChange = periodJournals.flatMap(j => j.items)
                    .filter(i => i.accountId === acc.id)
                    .reduce((sum, item) => {
                        const isDebitNormal = acc.type === AccountType.Expense;
                        const change = isDebitNormal ? (item.debit - item.credit) : (item.credit - item.debit);
                        return sum + change;
                    }, 0);
                changes.set(acc.id, balanceChange);
            }
        });
        
        const rolledUpChanges = new Map<number, number>();
        const calculateRolledUpChange = (accountId: number): number => {
            if (rolledUpChanges.has(accountId)) return rolledUpChanges.get(accountId)!;
            
            let total = changes.get(accountId) || 0;
            const children = childrenMap.get(accountId) || [];

            for (const child of children) {
                total += calculateRolledUpChange(child.id);
            }
            rolledUpChanges.set(accountId, total);
            return total;
        };

        accounts.forEach(acc => {
            if (acc.type === AccountType.Revenue || acc.type === AccountType.Expense) {
                calculateRolledUpChange(acc.id);
            }
        });

        return rolledUpChanges;
    }, [accounts, journalEntries, startDate, endDate, childrenMap]);

    const { revenue, expense, totalRevenue, totalExpense, netIncome } = useMemo(() => {
        const rootAccounts = childrenMap.get(undefined) || [];
        const revenue = rootAccounts.filter(a => a.type === AccountType.Revenue);
        const expense = rootAccounts.filter(a => a.type === AccountType.Expense);

        const totalRevenue = revenue.reduce((sum, acc) => sum + (periodChangeMap.get(acc.id) || 0), 0);
        const totalExpense = expense.reduce((sum, acc) => sum + (periodChangeMap.get(acc.id) || 0), 0);

        return {
            revenue, expense,
            totalRevenue, totalExpense,
            netIncome: totalRevenue - totalExpense
        };
    }, [periodChangeMap, childrenMap]);
    
    const formatCurrency = (amount: number) => amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const renderAccountRows = (accounts: Account[], level: number): (JSX.Element | null)[] => {
        return accounts.flatMap(account => {
            const change = periodChangeMap.get(account.id) || 0;
            const children = childrenMap.get(account.id) || [];
            
            const renderedChildren = renderAccountRows(children, level + 1);
            
            if (Math.abs(change) < 0.01 && renderedChildren.every(c => c === null)) return [null];

            return [
                <tr key={account.id} className={level === 0 ? "font-semibold" : ""}>
                    <td style={{ paddingLeft: `${1 + level * 1.5}rem` }} className="py-2">
                        <Link to={`/accounting/reports/general-ledger/${account.id}`} className="hover:underline text-primary-600 dark:text-primary-400">
                            {account.name}
                        </Link>
                    </td>
                    <td className="text-right font-mono pr-4 py-2">${formatCurrency(change)}</td>
                </tr>,
                ...renderedChildren.filter(c => c !== null)
            ];
        });
    };
    
    const renderSection = (title: string, accounts: Account[]) => (
        <div>
            <h4 className="font-bold text-lg mb-2 p-2 bg-slate-100 dark:bg-slate-800 rounded">{title}</h4>
            <table className="w-full">
                <tbody>
                    {renderAccountRows(accounts, 0).filter(c => c !== null)}
                </tbody>
            </table>
        </div>
    );

    return (
        <Card>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                 <div>
                    <h2 className="text-2xl font-bold">Gelir Tablosu</h2>
                </div>
                 <div className="flex items-center gap-4">
                     <div>
                        <label htmlFor="startDate" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Başlangıç Tarihi</label>
                        <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 p-2 border border-border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                    </div>
                     <div>
                        <label htmlFor="endDate" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Bitiş Tarihi</label>
                        <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 p-2 border border-border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                    </div>
                    <div className="self-end">
                        <Button variant="secondary" onClick={() => navigate('/accounting/reports')}>
                            &larr; Rapor Merkezine Dön
                        </Button>
                    </div>
                </div>
            </div>
             <div className="space-y-6">
                <div>
                    {renderSection('Gelirler', revenue)}
                    <p className="flex justify-between font-bold text-md mt-2 p-2">
                        <span>Toplam Gelirler</span>
                        <span>${formatCurrency(totalRevenue)}</span>
                    </p>
                </div>
                    
                <div>
                    {renderSection('Giderler', expense)}
                    <p className="flex justify-between font-bold text-md mt-2 p-2">
                        <span>Toplam Giderler</span>
                        <span>${formatCurrency(totalExpense)}</span>
                    </p>
                </div>
                
                <div className={`mt-4 p-3 rounded-md text-lg ${netIncome >= 0 ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'}`}>
                    <p className="flex justify-between font-bold">
                        <span>Net Kâr/Zarar</span>
                        <span>{formatCurrency(netIncome)}</span>
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default IncomeStatement;