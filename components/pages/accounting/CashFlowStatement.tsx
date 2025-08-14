
import React, { useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import { Account, AccountType } from '../../../types';
import Button from '../../ui/Button';
import { useNavigate } from 'react-router-dom';

const CashFlowStatement: React.FC = () => {
    const { accounts } = useApp();
    const navigate = useNavigate();

    const cashFlowData = useMemo(() => {
        const revenue = accounts.filter(a => a.type === AccountType.Revenue).reduce((sum, a) => sum + a.balance, 0);
        const expense = accounts.filter(a => a.type === AccountType.Expense).reduce((sum, a) => sum + a.balance, 0);
        const netIncome = revenue - expense;

        // Note: In a real system, these would be calculated from changes over a period.
        // Here we use current balances as a proxy.
        const receivables = accounts.find(a => a.accountNumber === '120')?.balance || 0;
        const payables = accounts.find(a => a.accountNumber === '320')?.balance || 0;

        const cashFromOps = netIncome - receivables + payables;
        
        // Mock data for investing and financing activities
        const cashFromInvesting = -10000; // e.g. purchase of equipment
        const cashFromFinancing = 50000;  // e.g. took a loan

        const netCashChange = cashFromOps + cashFromInvesting + cashFromFinancing;

        return { netIncome, receivables, payables, cashFromOps, cashFromInvesting, cashFromFinancing, netCashChange };
    }, [accounts]);

    const formatNumber = (num: number) => {
        const value = num.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        return num < 0 ? `($${Math.abs(num).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})})` : `$${value}`;
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                 <div>
                    <h2 className="text-2xl font-bold">Nakit Akış Tablosu</h2>
                    <p className="text-text-secondary">Dönem Sonu: {new Date().toLocaleDateString('tr-TR')}</p>
                </div>
                <Button variant="secondary" onClick={() => navigate('/accounting/reports')}>
                    &larr; Rapor Merkezine Dön
                </Button>
            </div>
             <div className="space-y-6">
                <div>
                    <h4 className="font-bold text-lg mb-2 p-2 bg-slate-100 dark:bg-slate-800 rounded">İşletme Faaliyetlerinden Gelen Nakit Akışı</h4>
                    <ul className="space-y-1 text-sm">
                        <li className="flex justify-between py-1 border-b dark:border-slate-700"><span>Net Kâr/Zarar</span><span className="font-mono">{formatNumber(cashFlowData.netIncome)}</span></li>
                        <li className="flex justify-between py-1 border-b dark:border-slate-700"><span>Alacaklardaki Değişim (-)</span><span className="font-mono">{formatNumber(-cashFlowData.receivables)}</span></li>
                        <li className="flex justify-between py-1"><span>Borçlardaki Değişim (+)</span><span className="font-mono">{formatNumber(cashFlowData.payables)}</span></li>
                    </ul>
                    <p className="flex justify-between font-bold text-md mt-2 p-2">
                        <span>İşletme Faaliyetlerinden Net Nakit</span>
                        <span>{formatNumber(cashFlowData.cashFromOps)}</span>
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-2 p-2 bg-slate-100 dark:bg-slate-800 rounded">Yatırım Faaliyetlerinden Gelen Nakit Akışı</h4>
                    <ul className="space-y-1 text-sm">
                         <li className="flex justify-between py-1"><span>Ekipman Alımı (Simülasyon)</span><span className="font-mono">{formatNumber(cashFlowData.cashFromInvesting)}</span></li>
                    </ul>
                    <p className="flex justify-between font-bold text-md mt-2 p-2">
                        <span>Yatırım Faaliyetlerinden Net Nakit</span>
                        <span>{formatNumber(cashFlowData.cashFromInvesting)}</span>
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-2 p-2 bg-slate-100 dark:bg-slate-800 rounded">Finansman Faaliyetlerinden Gelen Nakit Akışı</h4>
                    <ul className="space-y-1 text-sm">
                        <li className="flex justify-between py-1"><span>Kredi Kullanımı (Simülasyon)</span><span className="font-mono">{formatNumber(cashFlowData.cashFromFinancing)}</span></li>
                    </ul>
                     <p className="flex justify-between font-bold text-md mt-2 p-2">
                        <span>Finansman Faaliyetlerinden Net Nakit</span>
                        <span>{formatNumber(cashFlowData.cashFromFinancing)}</span>
                    </p>
                </div>
                 <div className="mt-4 p-3 rounded-md text-lg bg-slate-200 dark:bg-slate-700">
                    <p className="flex justify-between font-bold">
                        <span>Nakit ve Nakit Benzerlerinde Net Değişim</span>
                        <span>{formatNumber(cashFlowData.netCashChange)}</span>
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default CashFlowStatement;
