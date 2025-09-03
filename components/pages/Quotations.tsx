import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Quotation, QuotationStatus } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ICONS } from '../../constants';
import EmptyState from '../ui/EmptyState';
import { Link, useNavigate } from 'react-router-dom';

const Quotations: React.FC = () => {
    const { quotations, hasPermission } = useApp();
    const canManage = hasPermission('anlasma:yonet');
    const navigate = useNavigate();

    const stats = useMemo(() => {
        const draftCount = quotations.filter(q => q.status === QuotationStatus.Draft).length;
        const sentCount = quotations.filter(q => q.status === QuotationStatus.Sent).length;
        const acceptedValue = quotations
            .filter(q => q.status === QuotationStatus.Accepted)
            .reduce((sum, q) => sum + q.grandTotal, 0);

        return { draftCount, sentCount, acceptedValue };
    }, [quotations]);
    
    const getStatusBadge = (status: QuotationStatus) => {
        const styles: { [key in QuotationStatus]: string } = {
            [QuotationStatus.Draft]: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
            [QuotationStatus.Sent]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            [QuotationStatus.Accepted]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            [QuotationStatus.Rejected]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            [QuotationStatus.Expired]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };


    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card><h4 className="text-text-secondary">Taslak Teklifler</h4><p className="text-3xl font-bold">{stats.draftCount}</p></Card>
                <Card><h4 className="text-text-secondary">Gönderilmiş Teklifler</h4><p className="text-3xl font-bold">{stats.sentCount}</p></Card>
                <Card><h4 className="text-text-secondary">Kabul Edilen Teklif Değeri</h4><p className="text-3xl font-bold text-green-600">${stats.acceptedValue.toLocaleString()}</p></Card>
            </div>
             <Card
                title="Tüm Teklifler"
                action={canManage && (
                    <Link to="/sales/quotations/new">
                        <Button>
                            <span className="flex items-center gap-2">{ICONS.add} Yeni Teklif</span>
                        </Button>
                    </Link>
                )}
            >
                <div className="overflow-x-auto">
                    {quotations.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                                <th className="p-3 font-semibold">Teklif No</th>
                                <th className="p-3 font-semibold">Müşteri</th>
                                <th className="p-3 font-semibold">Teklif Tarihi</th>
                                <th className="p-3 font-semibold">Geçerlilik Tarihi</th>
                                <th className="p-3 font-semibold text-right">Tutar</th>
                                <th className="p-3 font-semibold">Durum</th>
                            </tr></thead>
                            <tbody>
                                {quotations.map(q => (
                                    <tr key={q.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer" onClick={() => navigate(`/sales/quotations/edit/${q.id}`)}>
                                        <td className="p-3 font-mono text-primary-600 hover:underline">{q.quotationNumber}</td>
                                        <td className="p-3">{q.customerName}</td>
                                        <td className="p-3">{q.issueDate}</td>
                                        <td className="p-3">{q.expiryDate}</td>
                                        <td className="p-3 text-right font-mono">${q.grandTotal.toLocaleString()}</td>
                                        <td className="p-3">{getStatusBadge(q.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState
                            icon={ICONS.documents}
                            title="Henüz Teklif Oluşturulmadı"
                            description="İlk teklifinizi oluşturarak satış sürecinizi bir sonraki adıma taşıyın."
                            action={canManage && <Link to="/sales/quotations/new"><Button>Teklif Oluştur</Button></Link>}
                        />
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Quotations;
