import React, { useMemo, useState, Fragment } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import { Account, AccountType, JournalEntryStatus } from '../../../types';
import Button from '../../ui/Button';
import { Link, useNavigate } from 'react-router-dom';

const BalanceSheet: React.FC = () => {
    const { accounts, journalEntries } = useApp();
    const navigate = useNavigate();
    const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split('T')[0]);

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

    const balanceMap = useMemo(() => {
        const balances = new Map<number, number>();
        const targetDate = new Date(asOfDate);
        targetDate.setHours(23, 59, 59, 999);

        const periodJournals = journalEntries.filter(j => new Date(j.date) <= targetDate && j.status === JournalEntryStatus.Posted);

        accounts.forEach(acc => {
            const balance = periodJournals.flatMap(j => j.items)
                .filter(i => i.accountId === acc.id)
                .reduce((sum, item) => {
                    const isDebitNormal = acc.type === AccountType.Asset || acc.type === AccountType.Expense;
                    const change = isDebitNormal ? (item.debit - item.credit) : (item.credit - item.debit);
                    return sum + change;
                }, 0);
            // Add opening balance
            balances.set(acc.id, acc.balance + balance);
        });
        
        const rolledUpBalances = new Map<number, number>();
        const calculateRolledUpBalance = (accountId: number): number => {
            if (rolledUpBalances.has(accountId)) return rolledUpBalances.get(accountId)!;
            
            let total = balances.get(accountId) || 0;
            const children = childrenMap.get(accountId) || [];

            for (const child of children) {
                total += calculateRolledUpBalance(child.id);
            }
            rolledUpBalances.set(accountId, total);
            return total;
        };
        accounts.forEach(acc => calculateRolledUpBalance(acc.id));

        return rolledUpBalances;
    }, [accounts, journalEntries, asOfDate, childrenMap]);

    const { assets, liabilities, equity, netIncome, totalAssets, totalLiabilities, totalEquity, totalLiabilitiesAndEquity } = useMemo(() => {
        const rootAccounts = childrenMap.get(undefined) || [];
        const assets = rootAccounts.filter(a => a.type === AccountType.Asset);
        const liabilities = rootAccounts.filter(a => a.type === AccountType.Liability);
        const equity = rootAccounts.filter(a => a.type === AccountType.Equity);
        
        const totalRevenue = accounts.filter(a => a.type === AccountType.Revenue).reduce((sum, acc) => sum + (balanceMap.get(acc.id) || 0) - acc.balance, 0);
        const totalExpense = accounts.filter(a => a.type === AccountType.Expense).reduce((sum, acc) => sum + (balanceMap.get(acc.id) || 0) - acc.balance, 0);
        const netIncome = totalRevenue - totalExpense;

        const totalAssets = assets.reduce((sum, acc) => sum + (balanceMap.get(acc.id) || 0), 0);
        const totalLiabilities = liabilities.reduce((sum, acc) => sum + (balanceMap.get(acc.id) || 0), 0);
        const totalEquity = equity.reduce((sum, acc) => sum + (balanceMap.get(acc.id) || 0), 0);
        
        return { assets, liabilities, equity, netIncome, totalAssets, totalLiabilities, totalEquity, totalLiabilitiesAndEquity: totalLiabilities + totalEquity + netIncome };
    }, [balanceMap, childrenMap, accounts]);
    
    const formatCurrency = (amount: number) => amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const renderAccountRows = (accounts: Account[], level: number): (JSX.Element | null)[] => {
        return accounts.flatMap(account => {
            const balance = balanceMap.get(account.id) || 0;
            const children = childrenMap.get(account.id) || [];
            
            const renderedChildren = renderAccountRows(children, level + 1);
            
            // Hide account if its balance and all its children's balances are zero
            if (Math.abs(balance) < 0.01 && renderedChildren.every(c => c === null)) return [null];


            return [
                <tr key={account.id} className={level === 0 ? "font-semibold" : ""}>
                    <td style={{ paddingLeft: `${1 + level * 1.5}rem` }} className="py-2">
                        <Link to={`/accounting/reports/general-ledger/${account.id}`} className="hover:underline text-primary-600 dark:text-primary-400">
                            {account.name}
                        </Link>
                    </td>
                    <td className="text-right font-mono pr-4 py-2">${formatCurrency(balance)}</td>
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
                    <h2 className="text-2xl font-bold">Bilanço</h2>
                    <p className="text-text-secondary">Dönem Sonu: {asOfDate}</p>
                </div>
                 <div className="flex items-center gap-4">
                     <div>
                        <label htmlFor="asOfDate" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Tarih itibarıyla</label>
                        <input type="date" id="asOfDate" value={asOfDate} onChange={e => setAsOfDate(e.target.value)} className="mt-1 p-2 border border-border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                    </div>
                    <div className="self-end">
                        <Button variant="secondary" onClick={() => navigate('/accounting/reports')}>
                            &larr; Rapor Merkezine Dön
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                <div>
                    {renderSection('Varlıklar', assets)}
                    <p className="flex justify-between font-bold text-lg mt-4 p-2 bg-slate-200 dark:bg-slate-700 rounded">
                        <span>Toplam Varlıklar</span>
                        <span>${formatCurrency(totalAssets)}</span>
                    </p>
                </div>
                <div>
                    {renderSection('Yükümlülükler', liabilities)}
                    <p className="flex justify-between font-bold text-md mt-4 p-2">
                        <span>Toplam Yükümlülükler</span>
                        <span>${formatCurrency(totalLiabilities)}</span>
                    </p>
                    <div className="mt-4">
                        {renderSection('Özkaynak', equity)}
                        <table className="w-full mt-2">
                            <tbody>
                                 <tr>
                                    <td className="py-2 pl-4">Net Kâr/Zarar</td>
                                    <td className="text-right font-mono pr-4 py-2">${formatCurrency(netIncome)}</td>
                                </tr>
                            </tbody>
                        </table>
                         <p className="flex justify-between font-bold text-md mt-2 p-2">
                            <span>Toplam Özkaynak</span>
                            <span>${formatCurrency(totalEquity + netIncome)}</span>
                        </p>
                    </div>
                    <p className="flex justify-between font-bold text-lg mt-4 p-2 bg-slate-200 dark:bg-slate-700 rounded">
                        <span>Toplam Yükümlülükler ve Özkaynak</span>
                        <span>${formatCurrency(totalLiabilitiesAndEquity)}</span>
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default BalanceSheet;
