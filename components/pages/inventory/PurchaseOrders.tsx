import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { PurchaseOrder, PurchaseOrderStatus, PurchaseOrderItem, BillStatus, Warehouse, Product } from '../../../types';
import Card from '../../ui/Card';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import EmptyState from '../../ui/EmptyState';
import ConfirmationModal from '../../ui/ConfirmationModal';
import { ICONS } from '../../../constants';
import { useNotification } from '../../../context/NotificationContext';

interface ReceiveStockModalProps {
    isOpen: boolean;
    onClose: () => void;
    purchaseOrder: PurchaseOrder;
}

const ReceiveStockModal: React.FC<ReceiveStockModalProps> = ({ isOpen, onClose, purchaseOrder }) => {
    const { warehouses, receivePurchaseOrderItems, products } = useApp();
    const { addToast } = useNotification();
    const [itemsToReceive, setItemsToReceive] = useState<Record<number, { quantity: string; details: (string | { batch: string; expiry: string })[] }>>({});
    const [targetWarehouseId, setTargetWarehouseId] = useState(purchaseOrder.targetWarehouseId || warehouses.find(w => w.isDefault)?.id || warehouses[0]?.id || 0);

    useEffect(() => {
        if (isOpen) {
            const initialItems: Record<number, { quantity: string; details: (string | { batch: string; expiry: string })[] }> = {};
            purchaseOrder.items.forEach(item => {
                const remaining = item.quantity - (item.receivedQuantity || 0);
                if (remaining > 0) {
                     initialItems[item.productId] = { quantity: String(remaining), details: [] };
                }
            });
            setItemsToReceive(initialItems);
            setTargetWarehouseId(purchaseOrder.targetWarehouseId || warehouses.find(w => w.isDefault)?.id || warehouses[0]?.id || 0);
        }
    }, [isOpen, purchaseOrder, warehouses, products]);
    
    const handleDetailChange = (productId: number, index: number, field: 'serial' | 'batch' | 'expiry', value: string) => {
        setItemsToReceive(prev => {
            const newDetails = [...(prev[productId]?.details || [])];
            let detailItem = newDetails[index];

            if (typeof detailItem === 'string' && field === 'serial') {
                newDetails[index] = value;
            } else if (typeof detailItem === 'object') {
                (detailItem as any)[field] = value;
            }

            return { ...prev, [productId]: { ...prev[productId], details: newDetails } };
        });
    };

    const handleQuantityChange = (productId: number, value: string) => {
         const quantity = parseInt(value) || 0;
         const product = products.find(p => p.id === productId);

         setItemsToReceive(prev => {
            let details: (string | { batch: string; expiry: string })[] = [];
            if (product?.trackBy === 'serial') {
                details = Array(quantity).fill('');
            } else if (product?.trackBy === 'batch') {
                details = [{ batch: '', expiry: '' }];
            }
            return { ...prev, [productId]: { quantity: String(quantity), details } };
         });
    };


    const handleSubmit = () => {
        const itemsForApi = Object.entries(itemsToReceive)
            .map(([productIdStr, data]) => {
                const productId = parseInt(productIdStr);
                const quantity = parseInt(data.quantity) || 0;
                const product = products.find(p => p.id === productId);

                if (!product || quantity <= 0) return null;

                let details = data.details;
                if (product.trackBy === 'serial') {
                    if (details.some(d => typeof d !== 'string' || !d.trim())) {
                         addToast(`'${product.name}' için tüm seri numaralarını girmelisiniz.`, 'error');
                         return 'ERROR';
                    }
                } else if (product.trackBy === 'batch') {
                    const batchDetail = details[0] as { batch: string; expiry: string };
                     if (!batchDetail || !batchDetail.batch.trim()) {
                         addToast(`'${product.name}' için parti numarası girmelisiniz.`, 'error');
                         return 'ERROR';
                    }
                }
                
                return { productId, quantity, details };
            })
            .filter(Boolean);
        
        if (itemsForApi.some(item => item === 'ERROR')) return;

        if (itemsForApi.length > 0 && targetWarehouseId) {
            receivePurchaseOrderItems(purchaseOrder.id, itemsForApi as any, targetWarehouseId);
            onClose();
        } else {
            addToast("Lütfen en az bir ürün için miktar girin ve bir depo seçin.", "warning");
        }
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Mal Kabul: ${purchaseOrder.poNumber}`}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Teslim Alınacak Depo</label>
                    <select value={targetWarehouseId} onChange={e => setTargetWarehouseId(Number(e.target.value))} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                        {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {purchaseOrder.items.map(item => {
                        const remaining = item.quantity - (item.receivedQuantity || 0);
                        if (remaining <= 0) return null;
                        const product = products.find(p => p.id === item.productId);
                        const currentItemData = itemsToReceive[item.productId];
                        if (!currentItemData) return null;

                        return (
                            <div key={item.productId} className="p-3 border rounded-md dark:border-dark-border space-y-2">
                                <div>
                                    <p className="font-medium">{item.productName}</p>
                                    <p className="text-xs text-text-secondary">Sipariş: {item.quantity} | Gelen: {item.receivedQuantity || 0}</p>
                                </div>
                                 <label className="flex flex-col">
                                    <span className="text-sm">Gelen Miktar</span>
                                    <input
                                        type="number"
                                        max={remaining}
                                        min="0"
                                        value={currentItemData.quantity}
                                        placeholder={`Kalan: ${remaining}`}
                                        onChange={e => handleQuantityChange(item.productId, e.target.value)}
                                        className="p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border w-1/3"
                                    />
                                </label>
                                {product?.trackBy === 'serial' && currentItemData.details.map((detail, index) => (
                                     <input
                                        key={index}
                                        type="text"
                                        placeholder={`Seri No #${index + 1}`}
                                        value={typeof detail === 'string' ? detail : ''}
                                        onChange={e => handleDetailChange(item.productId, index, 'serial', e.target.value)}
                                        className="p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                                    />
                                ))}
                                {product?.trackBy === 'batch' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className="flex flex-col">
                                            <span className="text-sm">Parti Numarası</span>
                                            <input
                                                type="text"
                                                value={(currentItemData.details[0] as any)?.batch || ''}
                                                onChange={e => handleDetailChange(item.productId, 0, 'batch', e.target.value)}
                                                className="p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                                            />
                                        </label>
                                        <label className="flex flex-col">
                                            <span className="text-sm">Son Kullanma Tarihi</span>
                                            <input
                                                type="date"
                                                value={(currentItemData.details[0] as any)?.expiry || ''}
                                                onChange={e => handleDetailChange(item.productId, 0, 'expiry', e.target.value)}
                                                className="p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={onClose}>İptal</Button>
                    <Button onClick={handleSubmit}>Teslim Al</Button>
                </div>
            </div>
        </Modal>
    );
};


const PurchaseOrders: React.FC = () => {
    const { purchaseOrders, hasPermission, updatePurchaseOrderStatus, createBillFromPO, deletePurchaseOrder, bills, journalEntries } = useApp();
    const [poToReceive, setPoToReceive] = useState<PurchaseOrder | null>(null);
    const [poToDelete, setPoToDelete] = useState<PurchaseOrder | null>(null);

    const canManageInventory = hasPermission('envanter:yonet');
    
    const getStatusBadge = (status: PurchaseOrderStatus) => {
        const styles: { [key in PurchaseOrderStatus]: string } = {
            [PurchaseOrderStatus.Draft]: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
            [PurchaseOrderStatus.Ordered]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            [PurchaseOrderStatus.Shipped]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            [PurchaseOrderStatus.PartiallyReceived]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            [PurchaseOrderStatus.Received]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            [PurchaseOrderStatus.Cancelled]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };

    const handleDeleteConfirm = () => {
        if (poToDelete) {
            deletePurchaseOrder(poToDelete.id);
            setPoToDelete(null);
        }
    };


    return (
        <>
            <Card
                title="Tüm Satın Alma Siparişleri"
                action={canManageInventory ? <Link to="/inventory/purchase-orders/new"><Button><span className="flex items-center gap-2">{ICONS.add} Yeni Sipariş</span></Button></Link> : undefined}
            >
                <div className="overflow-x-auto">
                    {purchaseOrders.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-200 dark:border-dark-border">
                                <tr className="bg-slate-50 dark:bg-slate-900/50">
                                    <th className="p-4 font-semibold">Sipariş No</th>
                                    <th className="p-4 font-semibold">Tedarikçi</th>
                                    <th className="p-4 font-semibold">Sipariş Tarihi</th>
                                    <th className="p-4 font-semibold">Durum</th>
                                    <th className="p-4 font-semibold">Fatura No</th>
                                    <th className="p-4 font-semibold">Yevmiye No</th>
                                    {canManageInventory && <th className="p-4 font-semibold">Eylemler</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {purchaseOrders.map((po) => {
                                    const isDraft = po.status === PurchaseOrderStatus.Draft;
                                    const isReceivable = [PurchaseOrderStatus.Ordered, PurchaseOrderStatus.Shipped, PurchaseOrderStatus.PartiallyReceived].includes(po.status);
                                    const isBillable = po.status === PurchaseOrderStatus.Received && !po.billId;

                                    const bill = po.billId ? bills.find(b => b.id === po.billId) : null;
                                    const journalEntry = po.journalEntryId ? journalEntries.find(j => j.id === po.journalEntryId) : null;

                                    return (
                                    <tr key={po.id} className="border-b border-slate-200 hover:bg-slate-50 dark:border-dark-border dark:hover:bg-slate-800/50">
                                        <td className="p-4 font-medium">
                                            <Link to={`/inventory/purchase-orders/${po.id}/edit`} className="text-primary-600 hover:underline">
                                                {po.poNumber}
                                            </Link>
                                        </td>
                                        <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{po.supplierName}</td>
                                        <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{po.orderDate}</td>
                                        <td className="p-4">{getStatusBadge(po.status)}</td>
                                        <td className="p-4 font-mono">{bill ? <Link to="/finance/bills" className="text-primary-600 hover:underline">{bill.billNumber}</Link> : '-'}</td>
                                        <td className="p-4 font-mono">{journalEntry ? <Link to={`/accounting/journal-entries/${journalEntry.id}`} className="text-primary-600 hover:underline">{journalEntry.entryNumber}</Link> : '-'}</td>
                                        {canManageInventory && <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                 {isDraft && <Button onClick={() => updatePurchaseOrderStatus(po.id, PurchaseOrderStatus.Ordered)} size="sm">Onayla</Button>}
                                                 {isReceivable && <Button onClick={() => setPoToReceive(po)} size="sm"><span className="flex items-center gap-1">{ICONS.receive} Mal Kabul</span></Button>}
                                                 {isBillable && <Button onClick={() => createBillFromPO(po.id)} size="sm">Gider Faturası Oluştur</Button>}
                                                 <Link to={`/inventory/purchase-orders/${po.id}/edit`} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400" title={isDraft ? "Düzenle" : "Görüntüle"}>
                                                    {isDraft ? ICONS.edit : <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                                                </Link>
                                                {isDraft && <button onClick={() => setPoToDelete(po)} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-red-600 dark:hover:text-red-500" title="Sil">{ICONS.trash}</button>}
                                            </div>
                                        </td>}
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState
                            icon={ICONS.purchaseOrder}
                            title="Henüz Satın Alma Siparişi Yok"
                            description="İlk siparişinizi oluşturarak tedarik sürecinizi başlatın."
                            action={canManageInventory ? <Link to="/inventory/purchase-orders/new"><Button>Sipariş Oluştur</Button></Link> : undefined}
                        />
                    )}
                </div>
            </Card>

            {poToReceive && (
                <ReceiveStockModal
                    isOpen={!!poToReceive}
                    onClose={() => setPoToReceive(null)}
                    purchaseOrder={poToReceive}
                />
            )}
            
            {poToDelete && (
                <ConfirmationModal
                    isOpen={!!poToDelete}
                    onClose={() => setPoToDelete(null)}
                    onConfirm={handleDeleteConfirm}
                    title="Satın Alma Siparişini Sil"
                    message={`'${poToDelete?.poNumber}' numaralı siparişi kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
                />
            )}
        </>
    );
};

export default PurchaseOrders;