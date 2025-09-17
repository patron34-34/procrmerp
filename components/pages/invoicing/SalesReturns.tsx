



import React, { useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { SalesReturn, SalesReturnStatus } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import EmptyState from '../../ui/EmptyState';
import { useNavigate } from 'react-router-dom';

const SalesReturns: React.FC = () => {
    const { salesReturns, hasPermission } = useApp();
    const canManage = hasPermission('fatura:yonet');
    const navigate = useNavigate();

    const stats = useMemo(() => {
        const totalReturnedAmount = salesReturns.reduce((sum, sr) => sum + sr.grandTotal, 0);
        const draftReturns = salesReturns.filter(sr => sr.status === SalesReturnStatus.Draft).length;
        return { totalReturnedAmount, draftReturns };
    }, [salesReturns]);

    const getStatusBadge = (status: SalesReturnStatus) => {
        const styles: { [key in SalesReturnStatus]: string } = {
            [SalesReturnStatus.Draft]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            [SalesReturnStatus.Approved]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            [SalesReturnStatus.Processed]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <h4 className="text-text-secondary">Toplam İade Tutarı</h4>
                    <p className="text-3xl font-bold text-red-600">${stats.totalReturnedAmount.toLocaleString()}</p>
                </Card>
                <Card>
                    <h4 className="text-text-secondary">Taslak İadeler</h4>
                    <p className="text-3xl font-bold">{stats.draftReturns}</p>
                </Card>
            </div>
            <Card
                title="Satış İadeleri"
            >
                <div className="overflow-x-auto">
                    {salesReturns.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                                <th className="p-3 font-semibold">İade No</th>
                                <th className="p-3 font-semibold">Müşteri</th>
                                <th className="p-3 font-semibold">Tarih</th>
                                <th className="p-3 font-semibold text-right">Tutar</th>
                                <th className="p-3 font-semibold">Durum</th>
                                {canManage && <th className="p-3 font-semibold">Eylemler</th>}
                            </tr></thead>
                            <tbody>
                                {salesReturns.map(sr => (
                                    <tr key={sr.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="p-3 font-mono">
                                            <button onClick={() => navigate(`/invoicing/edit/${sr.id}`)} className="text-primary-600 hover:underline">{sr.returnNumber}</button>
                                        </td>
                                        <td className="p-3">{sr.customerName}</td>
                                        <td className="p-3">{sr.issueDate}</td>
                                        <td className="p-3 text-right font-mono">${sr.grandTotal.toLocaleString()}</td>
                                        <td className="p-3">{getStatusBadge(sr.status)}</td>
                                        {canManage && <td className="p-3">
                                             <Button variant="secondary" size="sm" onClick={() => navigate(`/invoicing/edit/${sr.id}`)}>Görüntüle</Button>
                                        </td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState
                            icon={ICONS.reverse}
                            title="Henüz Satış İadesi Yok"
                            description="Yeni bir iade faturası oluşturarak başlayın."
                            action={canManage && <Button onClick={() => navigate('/invoicing/new')}>Fatura Oluştur</Button>}
                        />
                    )}
                </div>
            </Card>
        </div>
    );
};

export default SalesReturns;