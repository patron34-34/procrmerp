import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SalesOrder, StockItem } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface CreateShipmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    salesOrder: SalesOrder;
}

const CreateShipmentModal: React.FC<CreateShipmentModalProps> = ({ isOpen, onClose, salesOrder }) => {
    const { stockItems, createShipmentFromSalesOrder } = useApp();
    const [itemsToShip, setItemsToShip] = useState<Record<number, { quantity: number, selectedStockItemIds: Set<number>}>>({});

    const committedStockByProduct = useMemo(() => {
        const stockByProduct: Record<number, StockItem[]> = {};
        salesOrder.items.forEach(orderItem => {
            const shippedItems = stockItems.filter(si => si.status === 'Sevk Edildi' && orderItem.committedStockItemIds.includes(si.id));
            const shippedItemIds = new Set(shippedItems.map(si => si.id));
            
            stockByProduct[orderItem.productId] = orderItem.committedStockItemIds
                .filter(id => !shippedItemIds.has(id)) // Exclude already shipped items from this order's commitment list
                .map(id => stockItems.find(si => si.id === id))
                .filter((si): si is StockItem => !!si);
        });
        return stockByProduct;
    }, [stockItems, salesOrder]);

    useEffect(() => {
        if (isOpen) {
            const initialItems: Record<number, { quantity: number, selectedStockItemIds: Set<number>}> = {};
            salesOrder.items.forEach(item => {
                const committedForThisItem = committedStockByProduct[item.productId] || [];
                if(committedForThisItem.length > 0) {
                     initialItems[item.productId] = {
                        quantity: committedForThisItem.length,
                        selectedStockItemIds: new Set(committedForThisItem.map(si => si.id))
                    };
                }
            });
            setItemsToShip(initialItems);
        }
    }, [isOpen, salesOrder, committedStockByProduct]);


    const handleSubmit = () => {
        const finalItemsToShip = Object.entries(itemsToShip)
            .map(([productIdStr, data]) => ({ 
                productId: parseInt(productIdStr), 
                quantity: data.quantity,
                stockItemIds: Array.from(data.selectedStockItemIds)
            }))
            .filter(item => item.quantity > 0);
        
        if (finalItemsToShip.length > 0) {
            createShipmentFromSalesOrder(salesOrder.id, finalItemsToShip);
            onClose();
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Sevkiyat Oluştur: ${salesOrder.orderNumber}`}>
            <div className="space-y-4">
                <p className="text-sm text-text-secondary">Aşağıdaki ayrılmış ürünler için bir sevkiyat oluşturulacak.</p>
                {salesOrder.items.map(orderItem => {
                    const committedForThisItem = committedStockByProduct[orderItem.productId] || [];
                    
                    if(committedForThisItem.length === 0) return null;

                    return (
                        <div key={orderItem.productId} className="p-3 border rounded-md dark:border-dark-border">
                            <h4 className="font-bold">{orderItem.productName}</h4>
                            <p className="text-sm text-text-secondary">Sipariş: {orderItem.quantity} | Sevk Edilen: {orderItem.shippedQuantity}</p>
                            <p className="text-sm text-green-600 font-semibold">Gönderilecek Miktar: {committedForThisItem.length}</p>
                            
                            <div className="text-xs text-slate-500 mt-1 space-y-1">
                                <p className="font-semibold">Ayrılan Seri/Parti Numaraları:</p>
                                <div className="max-h-20 overflow-y-auto bg-slate-100 dark:bg-slate-800/50 p-1 rounded">
                                {committedForThisItem.map(si => (
                                    <span key={si.id} className="block font-mono">{si.serialNumber || si.batchNumber}</span>
                                ))}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="flex justify-end pt-4 gap-2">
                <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                <Button onClick={handleSubmit}>Sevkiyatı Oluştur</Button>
            </div>
        </Modal>
    );
};

export default CreateShipmentModal;