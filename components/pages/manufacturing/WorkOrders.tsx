import React from 'react';
import { useApp } from '../../../context/AppContext';
import { WorkOrder, WorkOrderStatus } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import { Link } from 'react-router-dom';
import EmptyState from '../../ui/EmptyState';

const WorkOrders: React.FC = () => {
    const { workOrders, hasPermission } = useApp();
    const canManage = hasPermission('envanter:yonet');
    
    const getStatusBadge = (status: WorkOrderStatus) => {
        const styles: { [key in WorkOrderStatus]: string } = {
            [WorkOrderStatus.Taslak]: 'bg-slate-100 text-slate-800',
            [WorkOrderStatus.Onaylandı]: 'bg-blue-100 text-blue-800',
            [WorkOrderStatus.Uretimde]: 'bg-yellow-100 text-yellow-800',
            [WorkOrderStatus.Tamamlandı]: 'bg-green-100 text-green-800',
            [WorkOrderStatus.IptalEdildi]: 'bg-red-100 text-red-800',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };


    return (
        <Card
            title="İş Emirleri"
            action={
                canManage && (
                    <Link to="/manufacturing/work-orders/new">
                        <Button>
                            <span className="flex items-center gap-2">{ICONS.add} Yeni İş Emri</span>
                        </Button>
                    </Link>
                )
            }
        >
            <p className="mb-4 text-text-secondary dark:text-dark-text-secondary">
                Üretim süreçlerinizi yönetin ve takip edin.
            </p>
            <div className="overflow-x-auto">
                {workOrders.length > 0 ? (
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border">
                            <tr className="bg-slate-50 dark:bg-slate-900/50">
                                <th className="p-3 font-semibold">İş Emri No</th>
                                <th className="p-3 font-semibold">Üretilecek Mamul</th>
                                <th className="p-3 font-semibold text-right">Miktar</th>
                                <th className="p-3 font-semibold">Oluşturma Tarihi</th>
                                <th className="p-3 font-semibold">Durum</th>
                                {canManage && <th className="p-3 font-semibold">Eylemler</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {workOrders.map(wo => (
                                <tr key={wo.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="p-3 font-medium font-mono">
                                         <Link to={`/manufacturing/work-orders/${wo.id}/edit`} className="text-primary-600 hover:underline">
                                            {wo.workOrderNumber}
                                        </Link>
                                    </td>
                                    <td className="p-3">{wo.productName}</td>
                                    <td className="p-3 text-right font-semibold">{wo.quantityToProduce}</td>
                                    <td className="p-3 text-sm">{wo.creationDate}</td>
                                    <td className="p-3">{getStatusBadge(wo.status)}</td>
                                    {canManage && (
                                        <td className="p-3">
                                            <Link to={`/manufacturing/work-orders/${wo.id}/edit`}>
                                                <Button variant="secondary" size="sm">Düzenle</Button>
                                            </Link>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <EmptyState
                        icon={ICONS.manufacturing}
                        title="Henüz İş Emri Yok"
                        description="İlk iş emrinizi oluşturarak üretime başlayın."
                        action={canManage ? <Link to="/manufacturing/work-orders/new"><Button>İş Emri Oluştur</Button></Link> : undefined}
                    />
                )}
            </div>
        </Card>
    );
};

export default WorkOrders;