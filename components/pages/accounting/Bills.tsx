
import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Bill, BillStatus } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import EmptyState from '../../ui/EmptyState';
import { ICONS } from '../../../constants';

const Bills: React.FC = () => {
    const { bills, updateBill, hasPermission } = useApp();

    const canManage = hasPermission('muhasebe:yonet');

    const handleUpdateStatus = (bill: Bill, newStatus: BillStatus) => {
        if (!canManage) return;
        updateBill({ ...bill, status: newStatus });
    };

    const getStatusBadge = (status: BillStatus) => {
        const styles: { [key in BillStatus]: string } = {
            [BillStatus.Paid]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            [BillStatus.Payable]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };

    return (
        <Card title="Gider Faturaları">
            <div className="overflow-x-auto">
                {bills.length > 0 ? (
                    <table className="w-full text-left">
                        <thead className="border-b border-slate-200 dark:border-dark-border">
                            <tr className="bg-slate-50 dark:bg-slate-900/50">
                                <th className="p-4 font-semibold">Fatura No</th>
                                <th className="p-4 font-semibold">Tedarikçi</th>
                                <th className="p-4 font-semibold">Fatura Tarihi</th>
                                <th className="p-4 font-semibold">Vade Tarihi</th>
                                <th className="p-4 font-semibold">Tutar</th>
                                <th className="p-4 font-semibold">Durum</th>
                                {canManage && <th className="p-4 font-semibold">Eylemler</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map((bill) => (
                                <tr key={bill.id} className="border-b border-slate-200 hover:bg-slate-50 dark:border-dark-border dark:hover:bg-slate-800/50">
                                    <td className="p-4 font-medium">{bill.billNumber}</td>
                                    <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{bill.supplierName}</td>
                                    <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{bill.issueDate}</td>
                                    <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{bill.dueDate}</td>
                                    <td className="p-4 font-semibold text-text-main dark:text-dark-text-main">${bill.totalAmount.toLocaleString()}</td>
                                    <td className="p-4">{getStatusBadge(bill.status)}</td>
                                    {canManage && <td className="p-4">
                                        {bill.status === BillStatus.Payable && (
                                            <Button onClick={() => handleUpdateStatus(bill, BillStatus.Paid)} className="!px-2 !py-1 text-xs">
                                                Ödendi Olarak İşaretle
                                            </Button>
                                        )}
                                    </td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                     <EmptyState
                        icon={ICONS.bills}
                        title="Henüz Gider Faturası Yok"
                        description="Satın alma siparişleri teslim alındığında faturalarınız burada görünecektir."
                    />
                )}
            </div>
        </Card>
    );
};

export default Bills;
