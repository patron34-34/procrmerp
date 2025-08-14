
import React, { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { Account, JournalEntry, AccountType } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import { exportToCSV } from '../../../utils/csvExporter';

type LedgerEntry = {
    date: string;
    journalEntryId: number;
    journalEntryNumber: string;
    memo: string;
    debit: number;
    credit: number;
    balance: number;
};

const GeneralLedger: React.FC = () => {
    const { accountId } = useParams<{ accountId: string }>();
    const navigate = useNavigate();
    const { accounts, journalEntries } = useApp();

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [startDate, setStartDate] = useState(firstDayOfMonth.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);

    const account = useMemo(() => {
        if (!accountId) return null;
        return accounts.find(a => a.id === parseInt(accountId));
    }, [accountId, accounts]);

    const { openingBalance, ledgerEntries } = useMemo(() => {
        if (!account) return { openingBalance: 0, ledgerEntries: [] };

        const allRelevantItems: { item: any, entry: JournalEntry }[] = [];
        journalEntries.forEach(entry => {
            entry.items.forEach(item => {
                if (item.accountId === account.id) {
                    allRelevantItems.push({ item, entry });
                }
            });
        });

        const isDebitNormal = account.type === AccountType.Asset || account.type === AccountType.Expense;
        
        let balanceChangesInPeriod = 0;
        
        const periodStartDate = new Date(startDate);
        const periodEndDate = new Date(endDate);
        periodEndDate.setHours(23, 59, 59, 999);
        
        const transactionsInPeriod: { item: any, entry: JournalEntry }[] = [];

        allRelevantItems.forEach(({item, entry}) => {
            const entryDate = new Date(entry.date);
            const change = isDebitNormal ? (item.debit - item.credit) : (item.credit - item.debit);
            
            if (entryDate >= periodStartDate && entryDate <= periodEndDate) {
                balanceChangesInPeriod += change;
                transactionsInPeriod.push({ item, entry });
            }
        });
        
        const balanceChangesAfterPeriodEnd = allRelevantItems.filter(({entry}) => new Date(entry.date) > periodEndDate)
            .reduce((sum, {item}) => sum + (isDebitNormal ? (item.debit - item.credit) : (item.credit - item.debit)), 0);

        const closingBalance = account.balance;
        const openingBalance = closingBalance - balanceChangesInPeriod - balanceChangesAfterPeriodEnd;
        
        transactionsInPeriod.sort((a, b) => new Date(a.entry.date).getTime() - new Date(b.entry.date).getTime());
        
        let runningBalance = openingBalance;
        const finalLedgerEntries: LedgerEntry[] = transactionsInPeriod.map(({item, entry}) => {
            const change = isDebitNormal ? (item.debit - item.credit) : (item.credit - item.debit);
            runningBalance += change;
            return {
                date: entry.date,
                journalEntryId: entry.id,
                journalEntryNumber: entry.entryNumber,
                memo: entry.memo,
                debit: item.debit,
                credit: item.credit,
                balance: runningBalance,
            };
        });

        return { openingBalance, ledgerEntries: finalLedgerEntries };
    }, [account, journalEntries, startDate, endDate]);

    if (!account) {
        return <Card title="Hata"><p>Hesap bulunamadı.</p></Card>;
    }

    const handleExport = () => {
        const dataToExport = [
            { 'Tarih': '', 'Yevmiye No': '', 'Açıklama': 'Dönem Başı Bakiyesi', 'Borç': '', 'Alacak': '', 'Bakiye': openingBalance },
            ...ledgerEntries.map(e => ({
                'Tarih': e.date,
                'Yevmiye No': e.journalEntryNumber,
                'Açıklama': e.memo,
                'Borç': e.debit,
                'Alacak': e.credit,
                'Bakiye': e.balance
            }))
        ];
        exportToCSV(dataToExport, `defter-i-kebir-${account.accountNumber}.csv`);
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <div>
                    <Button variant="secondary" onClick={() => navigate(-1)} className="mb-4">
                        &larr; Hesap Planına Geri Dön
                    </Button>
                    <h2 className="text-2xl font-bold">Defter-i Kebir: {account.name} ({account.accountNumber})</h2>
                    <p className="text-text-secondary">Hesap Türü: {account.type}</p>
                </div>
                <div className="text-right">
                    <p className="text-text-secondary">Dönem Sonu Bakiye</p>
                    <p className="text-2xl font-bold">${(ledgerEntries[ledgerEntries.length - 1]?.balance ?? openingBalance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                </div>
            </div>
            
             <div className="flex flex-wrap items-center gap-4 p-4 border-y dark:border-dark-border my-4">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-semibold text-text-secondary">Başlangıç Tarihi</label>
                    <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 p-2 border border-border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-semibold text-text-secondary">Bitiş Tarihi</label>
                    <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 p-2 border border-border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                </div>
                <div className="self-end">
                    <Button onClick={handleExport} variant="secondary">
                        <span className="flex items-center gap-2">{ICONS.export} Dışa Aktar</span>
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                        <th className="p-3 font-semibold">Tarih</th>
                        <th className="p-3 font-semibold">Fiş No</th>
                        <th className="p-3 font-semibold">Açıklama</th>
                        <th className="p-3 font-semibold text-right">Borç</th>
                        <th className="p-3 font-semibold text-right">Alacak</th>
                        <th className="p-3 font-semibold text-right">Bakiye</th>
                    </tr></thead>
                    <tbody>
                        <tr className="border-b dark:border-dark-border">
                            <td colSpan={5} className="p-3 font-bold">Dönem Başı Bakiyesi</td>
                            <td className="p-3 text-right font-bold">${openingBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        </tr>
                        {ledgerEntries.map((item, index) => (
                            <tr key={index} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="p-3">{item.date}</td>
                                <td className="p-3 font-mono">
                                    <Link to={`/accounting/journal-entries/${item.journalEntryId}`} className="text-primary-600 hover:underline">{item.journalEntryNumber}</Link>
                                </td>
                                <td className="p-3">{item.memo}</td>
                                <td className="p-3 text-right font-mono">{item.debit > 0 ? `$${item.debit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : ''}</td>
                                <td className="p-3 text-right font-mono">{item.credit > 0 ? `$${item.credit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : ''}</td>
                                <td className="p-3 text-right font-mono">${item.balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default GeneralLedger;
