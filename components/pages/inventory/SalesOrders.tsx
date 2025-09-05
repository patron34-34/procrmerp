
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { SalesOrder, SalesOrderStatus } from '../../../types';
import Card from '../../ui/Card';
import EmptyState from '../../ui/EmptyState';
import { ICONS } from '../../../constants';
import { Link } from 'react-router-dom';
import Button from '../../ui/Button';
import SalesOrderFormModal from '../../inventory/SalesOrderFormModal';
import ConfirmationModal from '../../ui/ConfirmationModal';

const SalesOrders: React.FC = () => {
    const { salesOrders, deleteSalesOrder, updateSalesOrderStatus, hasPermission } = useApp();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<SalesOrder | null>(null);
    const [orderToDelete, setOrderToDelete] = useState<SalesOrder | null>(null);
    const [statusFilter, setStatusFilter] = useState<SalesOrderStatus | 'all'>('all');
    const [editingCell, setEditingCell] = useState<{ id: number; key: 'status' } | null>(null);
    
    const canManage = hasPermission('satis-siparis:yonet');

    const filteredOrders = useMemo(() => {
        if (statusFilter === 'all') return salesOrders;
        return salesOrders.filter(order => order.status === statusFilter);
    }, [salesOrders, statusFilter]);

    const handleOpenNew = () => {
        setEditingOrder(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (order: SalesOrder) => {
        setEditingOrder(order);
        setIsFormOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (orderToDelete) {
            deleteSalesOrder(orderToDelete.id);
            setOrderToDelete(null);
        }
    };
    
    const handleInlineUpdate = (order: SalesOrder, newStatus: SalesOrderStatus) => {
        updateSalesOrderStatus(order.id, newStatus);
        setEditingCell(null);
    };
    
    const getStatusBadge = (status: SalesOrderStatus) => {
        const statusConfig: { [key in SalesOrderStatus]: { text: string; color: string } } = {
            [SalesOrderStatus.OnayBekliyor]: { text: 'Onay Bekliyor', color: 'bg-slate-100 text-slate-800' },
            [SalesOrderStatus.Onaylandı]: { text: 'Onaylandı', color: 'bg-blue-100 text-blue-800' },
            [SalesOrderStatus.StokBekleniyor]: { text: 'Stok Bekleniyor', color: 'bg-yellow-100 text-yellow-800' },
            [SalesOrderStatus.UretimBekleniyor]: { text: 'Üretim Bekleniyor', color: 'bg-orange-100 text-orange-800' },
            [SalesOrderStatus.SevkeHazır]: { text: 'Sevke Hazır', color: 'bg-purple-100 text-purple-800' },
            [SalesOrderStatus.KısmenSevkEdildi]: { text: 'Kısmen Sevk Edildi', color: 'bg-indigo-100 text-indigo-800' },
            [SalesOrderStatus.TamamenSevkEdildi]: { text: 'Tamamen Sevk Edildi', color: 'bg-cyan-100 text-cyan-800' },
            [SalesOrderStatus.Faturalandı]: { text: 'Faturalandı', color: 'bg-green-100 text-green-800' },
            [SalesOrderStatus.İptalEdildi]: { text: 'İptal Edildi', color: 'bg-red-100 text-red-800' },
        };
        const config = statusConfig[status];
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color} dark:bg-opacity-20`}>{config.text}</span>;
    };

    return (
        <>
            <Card>
                <div className="p-4 border-b dark:border-dark-border flex justify-between items-center">
                    <div className="flex items-center gap-4">
                         <h2 className="text-xl font-bold">Satış Siparişleri</h2>
                         <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                            <option value="all">Tüm Durumlar</option>
                            {Object.values(SalesOrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    {canManage && <Button onClick={handleOpenNew}><span className="flex items-center gap-2">{ICONS.add} Yeni Sipariş</span></Button>}
                </div>
                <div className="overflow-x-auto">
                    {filteredOrders.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                                <th className="p-3 font-semibold">Sipariş No</th>
                                <th className="p-3 font-semibold">Müşteri</th>
                                <th className="p-3 font-semibold">Sipariş Tarihi</th>
                                <th className="p-3 font-semibold text-right">Tutar</th>
                                <th className="p-3 font-semibold">Durum</th>
                                {canManage && <th className="p-3 font-semibold text-center">Eylemler</th>}
                            </tr></thead>
                            <tbody>
                                {filteredOrders.map(order => {
                                    const canBeEdited = [SalesOrderStatus.OnayBekliyor, SalesOrderStatus.Onaylandı].includes(order.status);
                                    const canBeDeleted = ![SalesOrderStatus.KısmenSevkEdildi, SalesOrderStatus.TamamenSevkEdildi, SalesOrderStatus.Faturalandı].includes(order.status);
                                    const canBeInvoiced = order.status === SalesOrderStatus.TamamenSevkEdildi;

                                    return (
                                        <tr key={order.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                                            <td className="p-3 font-mono">
                                                <Link to={`/inventory/sales-orders/${order.id}`} className="hover:underline text-primary-600">
                                                    {order.orderNumber}
                                                </Link>
                                            </td>
                                            <td className="p-3">
                                                <Link to={`/customers/${order.customerId}`} className="hover:underline text-primary-600">
                                                    {order.customerName}
                                                </Link>
                                            </td>
                                            <td className="p-3">{order.orderDate}</td>
                                            <td className="p-3 text-right font-mono">${order.grandTotal.toLocaleString()}</td>
                                            <td className="p-3" onClick={() => canManage && setEditingCell({ id: order.id, key: 'status' })}>
                                                {editingCell?.id === order.id && editingCell.key === 'status' ? (
                                                    <select
                                                        defaultValue={order.status}
                                                        onBlur={() => setEditingCell(null)}
                                                        onChange={(e) => handleInlineUpdate(order, e.target.value as SalesOrderStatus)}
                                                        autoFocus
                                                        className="p-1 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {Object.values(SalesOrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                ) : (
                                                    <div className="cursor-pointer">{getStatusBadge(order.status)}</div>
                                                )}
                                            </td>
                                            {canManage && <td className="p-3 text-center">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button onClick={() => handleOpenEdit(order)} className="text-slate-500 hover:text-primary-600" disabled={!canBeEdited} title={!canBeEdited ? "Bu aşamadaki sipariş düzenlenemez" : "Düzenle"}>{ICONS.edit}</button>
                                                    <button onClick={() => setOrderToDelete(order)} className="text-slate-500 hover:text-red-600" disabled={!canBeDeleted} title={!canBeDeleted ? "Bu aşamadaki sipariş silinemez" : "Sil"}>{ICONS.trash}</button>
                                                </div>
                                            </td>}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState
                            icon={ICONS.salesOrder}
                            title="Filtreye Uygun Sipariş Yok"
                            description="Filtre kriterlerini değiştirin veya yeni bir sipariş oluşturun."
                            action={canManage && <Button onClick={handleOpenNew}>Yeni Sipariş Oluştur</Button>}
                        />
                    )}
                </div>
            </Card>
            {isFormOpen && canManage && (
                <SalesOrderFormModal 
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    order={editingOrder}
                />
            )}
             {canManage && <ConfirmationModal
                isOpen={!!orderToDelete}
                onClose={() => setOrderToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Siparişi Sil"
                message={`'${orderToDelete?.orderNumber}' numaralı siparişi kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve ayrılmış stoklar serbest bırakılacaktır.`}
            />}
        </>
    );
};

export default SalesOrders;
