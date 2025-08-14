
import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Transaction, TransactionType } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

// Simulate a bank statement for demonstration
const MOCK_BANK_STATEMENT: any[] = [
    { id: 'BANK001', date: '2024-07-15', description: 'GELEN ODEME - Lojistik Ltd.', amount: 15000 },
    { id: 'BANK002', date: '2024-07-19', description: 'FATURA - Sunucu Hizmetleri', amount: -1200 },
    { id: 'BANK003', date: '2024-07-21', description: 'MAAS ODEMESI', amount: -25000 },
    { id: 'BANK004', date: '2024-07-22', description: 'GELEN ODEME - Tekno A.S.', amount: 2500 },
];

const BankReconciliation: React.FC = () => {
    const { transactions, bankAccounts } = useApp();
    const [selectedAccount, setSelectedAccount] = useState(bankAccounts[0]?.id || 0);
    const [reconciledSystemIds, setReconciledSystemIds] = useState<Set<number>>(new Set());
    const [reconciledBankIds, setReconciledBankIds] = useState<Set<string>>(new Set());

    const accountTransactions = useMemo(() => {
        return transactions.filter(t => t.accountId === selectedAccount);
    }, [transactions, selectedAccount]);

    const handleToggleSystem = (id: number) => {
        const newSet = new Set(reconciledSystemIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setReconciledSystemIds(newSet);
    };
    
    const handleToggleBank = (id: string) => {
        const newSet = new Set(reconciledBankIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setReconciledBankIds(newSet);
    };
    
    const systemTotal = accountTransactions.filter(t => reconciledSystemIds.has(t.id)).reduce((sum, t) => sum + (t.type === TransactionType.Income ? t.amount : -t.amount), 0);
    const bankTotal = MOCK_BANK_STATEMENT.filter(t => reconciledBankIds.has(t.id)).reduce((sum, t) => sum + t.amount, 0);
    const difference = bankTotal - systemTotal;

    return (
        <div className="space-y-6">
            <Card title="Banka Mutabakatı">
                <div className="mb-4">
                    <label htmlFor="account" className="mr-2">Hesap Seçin:</label>
                    <select id="account" value={selectedAccount} onChange={e => setSelectedAccount(Number(e.target.value))} className="p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                        {bankAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.accountName}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-bold text-lg mb-2">Sistem Kayıtları</h3>
                        <div className="border rounded-lg max-h-96 overflow-y-auto dark:border-dark-border">
                            {accountTransactions.map(t => (
                                <div key={t.id} onClick={() => handleToggleSystem(t.id)} className={`flex justify-between p-2 border-b dark:border-dark-border cursor-pointer ${reconciledSystemIds.has(t.id) ? 'bg-green-100 dark:bg-green-900/50' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                    <span>{t.description}</span>
                                    <span className={t.type === TransactionType.Income ? 'text-green-600' : 'text-red-600'}>${t.amount.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h3 className="font-bold text-lg mb-2">Banka Ekstresi (Simülasyon)</h3>
                         <div className="border rounded-lg max-h-96 overflow-y-auto dark:border-dark-border">
                             {MOCK_BANK_STATEMENT.map(t => (
                                <div key={t.id} onClick={() => handleToggleBank(t.id)} className={`flex justify-between p-2 border-b dark:border-dark-border cursor-pointer ${reconciledBankIds.has(t.id) ? 'bg-green-100 dark:bg-green-900/50' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                    <span>{t.description}</span>
                                    <span className={t.amount > 0 ? 'text-green-600' : 'text-red-600'}>${Math.abs(t.amount).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-6 pt-4 border-t dark:border-dark-border grid grid-cols-3 gap-4 text-center">
                    <div><h4 className="font-semibold">Sistem Toplamı</h4><p className="text-xl font-bold">${systemTotal.toLocaleString()}</p></div>
                    <div><h4 className="font-semibold">Banka Toplamı</h4><p className="text-xl font-bold">${bankTotal.toLocaleString()}</p></div>
                    <div><h4 className="font-semibold">Fark</h4><p className={`text-xl font-bold ${difference === 0 ? 'text-green-600' : 'text-red-600'}`}>${difference.toLocaleString()}</p></div>
                </div>
                <div className="text-center mt-4">
                    <Button disabled={difference !== 0}>Mutabakatı Tamamla</Button>
                </div>
            </Card>
        </div>
    );
};

export default BankReconciliation;
