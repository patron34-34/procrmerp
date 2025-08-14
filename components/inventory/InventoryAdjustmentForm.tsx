

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { InventoryAdjustment, InventoryAdjustmentItem, AdjustmentReason, Product, StockItemStatus } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ICONS } from '../../constants';
import { useNotification } from '../../context/NotificationContext';
import ProductSelector from './ProductSelector';

interface InventoryAdjustmentFormProps {
    isOpen: boolean;
    onClose: () => void;
    productToAdjust?: Product | null;
}

const InventoryAdjustmentForm: React.FC<InventoryAdjustmentFormProps> = ({ isOpen, onClose, productToAdjust }) => {
    const { warehouses, products, addInventoryAdjustment, getProductStockByWarehouse } = useApp();
    const { addToast } = useNotification();

    const initialFormState: Omit<InventoryAdjustment, 'id' | 'adjustmentNumber' | 'status'> = {
        date: new Date().toISOString().split('T')[0],
        warehouseId: warehouses.find(w => w.isDefault)?.id || warehouses[0]?.id || 0,
        reason: AdjustmentReason.Stocktake,
        notes: '',
        items: [],
    };
    const [formData, setFormData] = useState(initialFormState);
    
    useEffect(() => {
        if(productToAdjust) {
            const warehouseId = formData.warehouseId;
            const stock = getProductStockByWarehouse(productToAdjust.id, warehouseId).physical;
            setFormData({ 
                ...initialFormState,
                warehouseId, 
                items: [{ 
                    productId: productToAdjust.id, 
                    expectedQuantity: stock, 
                    countedQuantity: stock 
                }]
            });
        } else {
            setFormData(initialFormState);
        }
    }, [productToAdjust, isOpen, formData.warehouseId]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name.includes('Id') ? parseInt(value) : value }));
    };

    const handleItemChange = (index: number, field: keyof InventoryAdjustmentItem, value: any) => {
        const newItems = [...formData.items];
        const item = { ...newItems[index] };
        
        const numericValue = parseInt(value, 10) || 0;

        if (field === 'productId') {
            item.productId = numericValue;
            item.expectedQuantity = getProductStockByWarehouse(numericValue, formData.warehouseId).physical;
            item.countedQuantity = item.expectedQuantity;
        } else if (field === 'countedQuantity') {
            item.countedQuantity = numericValue;
        }

        newItems[index] = item;
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setFormData(prev => ({ ...prev, items: [...prev.items, { productId: 0, expectedQuantity: 0, countedQuantity: 0 }] }));
    };
    const removeItem = (index: number) => {
        setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validItems = formData.items.filter(i => i.productId > 0);
        if (validItems.length === 0) {
            addToast("Lütfen en az bir geçerli ürün ekleyin.", "error");
            return;
        }
        addInventoryAdjustment({ ...formData, items: validItems });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Yeni Stok Düzeltmesi">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <div><label className="block text-sm font-medium">Tarih</label><input type="date" name="date" value={formData.date} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" /></div>
                    <div><label className="block text-sm font-medium">Depo</label><select name="warehouseId" value={formData.warehouseId} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">{warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select></div>
                    <div><label className="block text-sm font-medium">Neden</label><select name="reason" value={formData.reason} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">{Object.values(AdjustmentReason).map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                </div>
                <div className="border-t pt-4 space-y-2 dark:border-dark-border">
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 font-semibold text-sm px-2">
                        <span>Ürün</span>
                        <span className="text-right">Sistem Miktarı</span>
                        <span className="text-right">Sayılan Miktar</span>
                        <span className="text-right">Fark</span>
                        <span></span>
                    </div>
                     {formData.items.map((item, index) => {
                         const difference = item.countedQuantity - item.expectedQuantity;
                         return (
                        <div key={index} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 items-center">
                            <ProductSelector products={products} value={item.productId} onChange={(productId) => handleItemChange(index, 'productId', productId)} disabled={!!(productToAdjust && index === 0)} />
                            <input type="number" value={item.expectedQuantity} disabled className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-dark-border text-right"/>
                            <input type="number" value={item.countedQuantity} onChange={e => handleItemChange(index, 'countedQuantity', e.target.value)} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border text-right"/>
                            <span className={`font-mono text-right font-semibold ${difference > 0 ? 'text-green-600' : difference < 0 ? 'text-red-600' : ''}`}>{difference}</span>
                            <Button type="button" variant="danger" onClick={() => removeItem(index)} className="!p-2">{ICONS.trash}</Button>
                        </div>
                     )})}
                    {!productToAdjust && <Button type="button" variant="secondary" onClick={addItem} className="text-sm">Ürün Ekle</Button>}
                </div>
                <div className="flex justify-end pt-4 gap-2 border-t dark:border-dark-border">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit">Düzeltmeyi Kaydet</Button>
                </div>
            </form>
        </Modal>
    );
};

export default InventoryAdjustmentForm;