

import React, { useState, useMemo, Fragment } from 'react';
import { useApp } from '../../../context/AppContext';
import { Account, AccountType } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import AccountFormModal from '../../accounting/AccountFormModal';
import { Link } from 'react-router-dom';

const ChartOfAccounts: React.FC = () => {
    const { accounts, hasPermission } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<Account | null>(null);
    const [expandedAccounts, setExpandedAccounts] = useState<Set<number>>(new Set());

    const canManage = hasPermission('muhasebe:yonet');

    const childrenMap = useMemo(() => {
        const map = new Map<number | null, Account[]>();
        accounts.forEach(acc => {
            const parentId = acc.parentId || null;
            if (!map.has(parentId)) map.set(parentId, []);
            map.get(parentId)!.push(acc);
        });
        map.forEach(children => children.sort((a, b) => a.accountNumber.localeCompare(b.accountNumber)));
        return map;
    }, [accounts]);

    const balanceMap = useMemo(() => {
        const balances = new Map<number, number>();
        const calculateBalance = (accountId: number): number => {
            if (balances.has(accountId)) return balances.get(accountId)!;
            
            const account = accounts.find(a => a.id === accountId)!;
            let total = account.balance;
            const children = childrenMap.get(accountId) || [];

            for (const child of children) {
                total += calculateBalance(child.id);
            }
            balances.set(accountId, total);
            return total;
        };
        accounts.forEach(acc => calculateBalance(acc.id));
        return balances;
    }, [accounts, childrenMap]);

    const openModalForNew = () => {
        setEditingAccount(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (account: Account) => {
        setEditingAccount(account);
        setIsModalOpen(true);
    };

    const toggleExpand = (accountId: number) => {
        setExpandedAccounts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(accountId)) {
                newSet.delete(accountId);
            } else {
                newSet.add(accountId);
            }
            return newSet;
        });
    };

    const renderAccountRow = (account: Account, level: number) => {
        const hasChildren = (childrenMap.get(account.id) || []).length > 0;
        const isExpanded = expandedAccounts.has(account.id);
        const totalBalance = balanceMap.get(account.id) || 0;

        return (
            <Fragment key={account.id}>
                <tr className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-mono" style={{ paddingLeft: `${level * 24 + 12}px` }}>
                         <div className="flex items-center">
                            {hasChildren && (
                                <button onClick={() => toggleExpand(account.id)} className="mr-2">
                                    <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </button>
                            )}
                            <span className={!hasChildren ? 'ml-6' : ''}>{account.accountNumber}</span>
                         </div>
                    </td>
                    <td className="p-3 font-medium">
                        <Link to={`/accounting/general-ledger/${account.id}`} className="hover:text-primary-600 dark:hover:text-primary-400 hover:underline">
                            {account.name}
                        </Link>
                    </td>
                    <td className="p-3 text-right font-semibold">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    {canManage && <td className="p-3"><button onClick={() => openModalForEdit(account)} className="text-slate-500 hover:text-primary-600">{ICONS.edit}</button></td>}
                </tr>
                {isExpanded && hasChildren && (childrenMap.get(account.id) || []).map(child => renderAccountRow(child, level + 1))}
            </Fragment>
        );
    };

    const renderAccountsByType = (type: AccountType) => {
        const rootAccounts = (childrenMap.get(null) || []).filter(a => a.type === type);
        return (
            <Fragment key={type}>
                <tr className="bg-slate-100 dark:bg-slate-800/50 sticky top-0">
                    <th colSpan={canManage ? 4 : 3} className="p-2 font-bold text-lg">{type}</th>
                </tr>
                {rootAccounts.map(acc => renderAccountRow(acc, 0))}
            </Fragment>
        );
    };

    return (
        <>
            <Card
                title="Hesap Planı"
                action={canManage && <Button onClick={openModalForNew}><span className="flex items-center gap-2">{ICONS.add} Yeni Hesap Ekle</span></Button>}
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border sticky top-0 bg-card dark:bg-dark-card"><tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-3 font-semibold w-1/4">Hesap No</th>
                            <th className="p-3 font-semibold w-2/4">Hesap Adı</th>
                            <th className="p-3 font-semibold text-right w-1/4">Bakiye</th>
                            {canManage && <th className="p-3 w-12">Eylemler</th>}
                        </tr></thead>
                        <tbody>
                            {Object.values(AccountType).map(type => renderAccountsByType(type))}
                        </tbody>
                    </table>
                </div>
            </Card>
            {canManage && (
                <AccountFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    account={editingAccount}
                />
            )}
        </>
    );
};

export default ChartOfAccounts;
