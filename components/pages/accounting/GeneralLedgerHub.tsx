
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { JournalEntryStatus } from '../../../types';
import Card from '../../ui/Card';

const GeneralLedgerHub: React.FC = () => {
    const { accounts, journalEntries } = useApp();
    const navigate = useNavigate();

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [startDate, setStartDate] = useState(firstDayOfMonth.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');

    const processedAccounts = useMemo(() => {
        const accountMovements = new Map<number, { debit: number; credit: number }>();

        // Filter journal entries by date range and status
        const filteredEntries = journalEntries.filter(entry => {
            return entry.date >= startDate && entry.date <= endDate && entry.status === JournalEntryStatus.Posted;
        });

        // Aggregate debits and credits for each account
        for (const entry of filteredEntries) {
            for (const item of entry.items) {
                const current = accountMovements.get(item.accountId) || { debit: 0, credit: 0 };
                current.debit += item.debit;
                current.credit += item.credit;
                accountMovements.set(item.accountId, current);
            }
        }

        // Map accounts to the final data structure, filtering and searching
        return accounts
            .map(account => {
                const movements = accountMovements.get(account.id);
                if (!movements || (movements.debit === 0 && movements.credit === 0)) {
                    return null;
                }

                const netChange = movements.debit - movements.credit;
                return {
                    id: account.id,
                    accountNumber: account.accountNumber,
                    name: account.name,
                    debit: movements.debit,
                    credit: movements.credit,
                    netChange: netChange,
                };
            })
            .filter((acc): acc is NonNullable<typeof acc> => acc !== null) // Type guard to remove nulls
            .filter(acc => 
                acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                acc.accountNumber.includes(searchTerm)
            )
            .sort((a, b) => a.accountNumber.localeCompare(b.accountNumber));

    }, [accounts, journalEntries, startDate, endDate, searchTerm]);

    const formatCurrency = (amount: number) => {
        return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4 border-b pb-4 dark:border-dark-border">
                <div>
                    <h2 className="text-2xl font-bold">Defter-i Kebir Merkezi</h2>
                    <p className="text-text-secondary dark:text-dark-text-secondary">Dönem içinde hareket gören hesaplar</p>
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
                </div>
            </div>

             <div className="mb-4">
                <input
                    type="text"
                    placeholder="Hesap adı veya numarasını ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3 p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:border-dark-border dark:text-white"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b dark:border-dark-border">
                        <tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-3 font-semibold">Hesap No</th>
                            <th className="p-3 font-semibold">Hesap Adı</th>
                            <th className="p-3 font-semibold text-right">Borç Toplamı</th>
                            <th className="p-3 font-semibold text-right">Alacak Toplamı</th>
                            <th className="p-3 font-semibold text-right">Net Değişim</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processedAccounts.length > 0 ? processedAccounts.map(account => (
                            <tr
                                key={account.id}
                                onClick={() => navigate(`/accounting/reports/general-ledger/${account.id}`)}
                                className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                            >
                                <td className="p-3 font-mono">{account.accountNumber}</td>
                                <td className="p-3 font-medium text-primary-600 dark:text-primary-400">{account.name}</td>
                                <td className="p-3 text-right font-mono">{formatCurrency(account.debit)}</td>
                                <td className="p-3 text-right font-mono">{formatCurrency(account.credit)}</td>
                                <td className={`p-3 text-right font-mono font-semibold ${account.netChange > 0 ? 'text-green-600' : account.netChange < 0 ? 'text-red-600' : ''}`}>
                                    {formatCurrency(account.netChange)}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="text-center p-8 text-text-secondary dark:text-dark-text-secondary">
                                    Seçilen dönemde veya arama kriterlerinde hareket gören hesap bulunamadı.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default GeneralLedgerHub;
