import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SalesOrder, StockItem, Product, StockItemStatus } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useNotification } from '../../context/NotificationContext';

interface AllocateStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  salesOrder: SalesOrder;
}

const AllocateStockModal: React.FC<AllocateStockModalProps> = ({ isOpen, onClose, salesOrder }) => {
    const { stockItems, products, allocateStockToSalesOrder } = useApp();
    const { addToast } = useNotification();
    const [selectedItems, setSelectedItems] = useState<Record<number, Set<number>>>({});

    useEffect(() => {
        if(isOpen) {
            setSelectedItems({});
        }
    }, [isOpen]);

    const availableStock = useMemo(() => {
        const stockByProduct: Record<number, StockItem[]> = {};
        salesOrder.items.forEach(item => {
            stockByProduct[item.productId] = stockItems.filter(si =>
                si.productId === item.productId && si.status === StockItemStatus.Available
            );
        });
        return stockByProduct;
    }, [stockItems, salesOrder]);

    const handleSelect = (productId: number, stockItemId: number) => {
        setSelectedItems(prev => {
            const newSelection = { ...prev };
            if (!newSelection[productId]) {
                newSelection[productId] = new Set();
            }
            const productSet = newSelection[productId];
            const orderItem = salesOrder.items.find(i => i.productId === productId)!;
            const needToAllocate = orderItem.quantity - orderItem.committedStockItemIds.length;

            if (productSet.has(stockItemId)) {
                productSet.delete(stockItemId);
            } else {
                if(productSet.size < needToAllocate) {
                    productSet.add(stockItemId);
                } else {
                    addToast("Bu ürün için gerekenden fazla stok ayıramazsınız.", "warning");
                }
            }
            return newSelection;
        });
    };

    const handleSubmit = () => {
        const allocations: { [productId: string]: number[] } = {};
        Object.entries(selectedItems).forEach(([productId, itemIds]) => {
            allocations[productId] = Array.from(itemIds);
        });
        allocateStockToSalesOrder(salesOrder.id, allocations);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Stok Ayırma: ${salesOrder.orderNumber}`}>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                {salesOrder.items.map(orderItem => {
                    const product = products.find(p => p.id === orderItem.productId);
                    if (!product) return null;

                    const needToAllocate = orderItem.quantity - orderItem.committedStockItemIds.length;
                    const selectedCount = selectedItems[product.id]?.size || 0;

                    if (needToAllocate <= 0) return null;

                    return (
                        <div key={product.id} className="p-3 border rounded-md dark:border-dark-border">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold">{product.name}</h4>
                                <span className={`font-semibold ${selectedCount === needToAllocate ? 'text-green-600' : 'text-orange-500'}`}>
                                    {selectedCount} / {needToAllocate} seçildi
                                </span>
                            </div>
                            <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                                {availableStock[product.id]?.length > 0 ? availableStock[product.id]?.map(stockItem => (
                                    <label key={stockItem.id} className="flex items-center p-2 rounded-md bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems[product.id]?.has(stockItem.id)}
                                            onChange={() => handleSelect(product.id, stockItem.id)}
                                            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="ml-3 text-sm font-mono">
                                            {stockItem.serialNumber || `${stockItem.batchNumber} (Miktar: ${stockItem.quantity || 1})`}
                                        </span>
                                    </label>
                                )) : <p className="text-sm text-center text-text-secondary">Bu ürün için stokta kullanılabilir kalem yok.</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-end pt-4 gap-2">
                <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                <Button onClick={handleSubmit}>Stokları Ayır</Button>
            </div>
        </Modal>
    );
};

export default AllocateStockModal;