
import React from 'react';
import { PayrollRun } from '../../../types';
import Card from '../../ui/Card';

interface PayrollTotalsProps {
    payrollRun: PayrollRun;
}

const PayrollTotals: React.FC<PayrollTotalsProps> = ({ payrollRun }) => {
    return (
        <Card title="Dönem Toplamları">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Çalışan Sayısı</p>
                    <p className="font-bold text-xl">{payrollRun.employeeCount}</p>
                </div>
                <div>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Toplam Brüt Maaş</p>
                    <p className="font-bold text-xl">${payrollRun.totalGrossPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Toplam İşveren Maliyeti</p>
                    <p className="font-bold text-xl">${(payrollRun.totalGrossPay + payrollRun.totalEmployerSgk).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Toplam Kesinti</p>
                    <p className="font-bold text-xl text-red-500">${payrollRun.totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Toplam Net Maaş</p>
                    <p className="font-bold text-xl text-green-600">${payrollRun.totalNetPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
            </div>
        </Card>
    );
};

export default PayrollTotals;
