
import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { SalesOrder, SalesOrderStatus } from '../../../types';
import Card from '../../ui/Card';
import EmptyState from '../../ui/EmptyState';
import { ICONS } from '../../../constants';
import { Link } from 'react-router-dom';
import AllocateStockModal from '../../inventory/AllocateStockModal';
import CreateShipmentModal from '../../inventory/CreateShipmentModal';
import Button from '../../ui/Button';

const SalesOrders: React.FC = () => {
    const { salesOrders, hasPermission } = useApp();
    const [allocatingOrder, setAllocatingOrder] = useState<SalesOrder | null>(null);
    const [shippingOrder, setShippingOrder] = useState<SalesOrder | null>(null);

    const canManage = hasPermission('satis-siparis:yonet');

    const getStatusBadge = (status: SalesOrderStatus) => {
        const styles: { [key in SalesOrderStatus]: string } = {
            [SalesOrderStatus.Pending]: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
            [SalesOrderStatus.AwaitingStock]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            [SalesOrderStatus.ReadyToShip]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            [SalesOrderStatus.PartiallyShipped]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            [SalesOrderStatus.Shipped]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            [SalesOrderStatus.Cancelled]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };

    return (
        <>
            <Card title="Satış Siparişleri">
                <div className="overflow-x-auto">
                    {salesOrders.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                                <th className="p-3 font-semibold">Sipariş No</th>
                                <th className="p-3 font-semibold">Müşteri</th>
                                <th className="p-3 font-semibold">Sipariş Tarihi</th>
                                <th className="p-3 font-semibold text-right">Tutar</th>
                                <th className="p-3 font-semibold">Durum</th>
                                {canManage && <th className="p-3 font-semibold">Eylemler</th>}
                            </tr></thead>
                            <tbody>
                                {salesOrders.map(order => {
                                    const needsAllocation = order.status === SalesOrderStatus.AwaitingStock || order.status === SalesOrderStatus.Pending;
                                    const canShip = order.status === SalesOrderStatus.ReadyToShip || order.status === SalesOrderStatus.PartiallyShipped;
                                    return (
                                        <tr key={order.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <td className="p-3 font-mono">{order.orderNumber}</td>
                                            <td className="p-3">
                                                <Link to={`/customers/${order.customerId}`} className="hover:underline text-primary-600">
                                                    {order.customerName}
                                                </Link>
                                            </td>
                                            <td className="p-3">{order.orderDate}</td>
                                            <td className="p-3 text-right font-mono">${order.totalAmount.toLocaleString()}</td>
                                            <td className="p-3">{getStatusBadge(order.status)}</td>
                                            {canManage && <td className="p-3">
                                                <div className="flex gap-2">
                                                    {needsAllocation && <Button onClick={() => setAllocatingOrder(order)} className="!text-xs !py-1 !px-2">Stok Ayır</Button>}
                                                    {canShip && <Button onClick={() => setShippingOrder(order)} className="!text-xs !py-1 !px-2">Sevkiyat Oluştur</Button>}
                                                </div>
                                            </td>}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState
                            icon={ICONS.salesOrder!}
                            title="Henüz Satış Siparişi Yok"
                            description="Kazanılan bir anlaşma olduğunda, satış siparişleri burada görünecektir."
                        />
                    )}
                </div>
            </Card>
            {allocatingOrder && canManage && (
                <AllocateStockModal
                    isOpen={!!allocatingOrder}
                    onClose={() => setAllocatingOrder(null)}
                    salesOrder={allocatingOrder}
                />
            )}
            {shippingOrder && canManage && (
                <CreateShipmentModal
                    isOpen={!!shippingOrder}
                    onClose={() => setShippingOrder(null)}
                    salesOrder={shippingOrder}
                />
            )}
        </>
    );
};

export default SalesOrders;
