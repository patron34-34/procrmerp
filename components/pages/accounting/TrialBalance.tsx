
import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Account, AccountType } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import { exportToCSV } from '../../../utils/csvExporter';
import { Link } from 'react-router-dom';

type TrialBalanceRow = {
    accountId: number;
    accountNumber: string;
    name: string;
    totalDebit: number;
    totalCredit: number;
    debitBalance: number;
    creditBalance: number;
};

const TrialBalance: React.FC = () => {
    const { accounts, journalEntries } = useApp();
    
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [startDate, setStartDate] = useState(firstDayOfMonth.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);

    const trialBalanceData = useMemo(() => {
        const accountData = new Map<number, {
            id: number;
            accountNumber: string;
            name: string;
            type: AccountType;
            totalDebit: number;
            totalCredit: number;
        }>();

        accounts.forEach(acc => {
            accountData.set(acc.id, { ...acc, totalDebit: 0, totalCredit: 0 });
        });
        
        const filteredEntries = journalEntries.filter(entry => {
            return entry.date >= startDate && entry.date <= endDate;
        });

        filteredEntries.forEach(entry => {
            entry.items.forEach(item => {
                if (accountData.has(item.accountId)) {
                    const acc = accountData.get(item.accountId)!;
                    acc.totalDebit += item.debit;
                    acc.totalCredit += item.credit;
                }
            });
        });

        const finalData: TrialBalanceRow[] = Array.from(accountData.values())
            .map(acc => {
                const isDebitNormal = acc.type === AccountType.Asset || acc.type === AccountType.Expense;
                const balance = isDebitNormal ? (acc.totalDebit - acc.totalCredit) : (acc.totalCredit - acc.totalDebit);
                
                return {
                    accountId: acc.id,
                    accountNumber: acc.accountNumber,
                    name: acc.name,
                    totalDebit: acc.totalDebit,
                    totalCredit: acc.totalCredit,
                    debitBalance: balance > 0 && isDebitNormal ? balance : 0,
                    creditBalance: balance > 0 && !isDebitNormal ? balance : 0,
                };
            })
            .filter(acc => acc.totalDebit > 0 || acc.totalCredit > 0)
            .sort((a,b) => a.accountNumber.localeCompare(b.accountNumber));

        const totals = finalData.reduce((acc, curr) => ({
            totalDebit: acc.totalDebit + curr.totalDebit,
            totalCredit: acc.totalCredit + curr.totalCredit,
            debitBalance: acc.debitBalance + curr.debitBalance,
            creditBalance: acc.creditBalance + curr.creditBalance,
        }), { totalDebit: 0, totalCredit: 0, debitBalance: 0, creditBalance: 0 });

        return { rows: finalData, totals };
    }, [accounts, journalEntries, startDate, endDate]);
    
    const isTotalBalanced = Math.abs(trialBalanceData.totals.totalDebit - trialBalanceData.totals.totalCredit) < 0.01;
    const isBalanceBalanced = Math.abs(trialBalanceData.totals.debitBalance - trialBalanceData.totals.creditBalance) < 0.01;
    const isFullyBalanced = isTotalBalanced && isBalanceBalanced;

    const handleExport = () => {
        const dataToExport = trialBalanceData.rows.map(row => ({
            'Hesap Kodu': row.accountNumber,
            'Hesap Adı': row.name,
            'Borç Toplamı': row.totalDebit,
            'Alacak Toplamı': row.totalCredit,
            'Borç Bakiyesi': row.debitBalance,
            'Alacak Bakiyesi': row.creditBalance,
        }));
        dataToExport.push({
            'Hesap Kodu': 'TOPLAM',
            'Hesap Adı': '',
            'Borç Toplamı': trialBalanceData.totals.totalDebit,
            'Alacak Toplamı': trialBalanceData.totals.totalCredit,
            'Borç Bakiyesi': trialBalanceData.totals.debitBalance,
            'Alacak Bakiyesi': trialBalanceData.totals.creditBalance,
        });
        exportToCSV(dataToExport, `mizan-${startDate}-${endDate}.csv`);
    };

    const formatCurrency = (amount: number) => amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <Card>
             <div className="flex justify-between items-center mb-4 flex-wrap gap-4 border-b pb-4 dark:border-dark-border">
                <div>
                    <h2 className="text-2xl font-bold">Mizan Raporu</h2>
                     <span className={`px-3 py-1 text-sm font-semibold rounded-full mt-2 inline-block ${isFullyBalanced ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                        {isFullyBalanced ? 'Dengede' : 'Dengede Değil'}
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                     <div>
                        <label htmlFor="startDate" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Başlangıç Tarihi</label>
                        <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 p-2 border border-border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Bitiş Tarihi</label>
                        <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 p-2 border border-border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                    </div>
                    <div className="self-end">
                        <Button onClick={handleExport} variant="secondary">
                            <span className="flex items-center gap-2">{ICONS.export} Dışa Aktar</span>
                        </Button>
                    </div>
                </div>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b dark:border-dark-border">
                        <tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-3 font-semibold" rowSpan={2}>Hesap Kodu</th>
                            <th className="p-3 font-semibold" rowSpan={2}>Hesap Adı</th>
                            <th className="p-3 font-semibold text-center border-b dark:border-dark-border" colSpan={2}>Toplam Tutar</th>
                            <th className="p-3 font-semibold text-center border-b dark:border-dark-border" colSpan={2}>Bakiye</th>
                        </tr>
                        <tr className="bg-slate-50 dark:bg-slate-900/50 text-center">
                            <th className="p-3 font-semibold">Borç</th>
                            <th className="p-3 font-semibold">Alacak</th>
                            <th className="p-3 font-semibold">Borç</th>
                            <th className="p-3 font-semibold">Alacak</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trialBalanceData.rows.map(row => (
                            <tr key={row.accountNumber} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="p-3 font-mono">{row.accountNumber}</td>
                                <td className="p-3 font-medium">
                                    <Link to={`/accounting/general-ledger/${row.accountId}`} className="hover:text-primary-600 dark:hover:text-primary-400 hover:underline">
                                        {row.name}
                                    </Link>
                                </td>
                                <td className="p-3 text-right font-mono">{formatCurrency(row.totalDebit)}</td>
                                <td className="p-3 text-right font-mono">{formatCurrency(row.totalCredit)}</td>
                                <td className="p-3 text-right font-mono">{row.debitBalance > 0 ? formatCurrency(row.debitBalance) : ''}</td>
                                <td className="p-3 text-right font-mono">{row.creditBalance > 0 ? formatCurrency(row.creditBalance) : ''}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="font-bold bg-slate-100 dark:bg-slate-800 text-lg">
                        <tr>
                            <td colSpan={2} className="p-3">GENEL TOPLAM</td>
                            <td className={`p-3 text-right font-mono ${!isTotalBalanced ? 'text-red-500' : ''}`}>{formatCurrency(trialBalanceData.totals.totalDebit)}</td>
                            <td className={`p-3 text-right font-mono ${!isTotalBalanced ? 'text-red-500' : ''}`}>{formatCurrency(trialBalanceData.totals.totalCredit)}</td>
                            <td className={`p-3 text-right font-mono ${!isBalanceBalanced ? 'text-red-500' : ''}`}>{formatCurrency(trialBalanceData.totals.debitBalance)}</td>
                            <td className={`p-3 text-right font-mono ${!isBalanceBalanced ? 'text-red-500' : ''}`}>{formatCurrency(trialBalanceData.totals.creditBalance)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </Card>
    );
};

export default TrialBalance;
