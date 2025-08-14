

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { InventoryTransfer, InventoryTransferItem, Product } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ICONS } from '../../constants';
import { useNotification } from '../../context/NotificationContext';
import ProductSelector from './ProductSelector';

interface InventoryTransferFormProps {
    isOpen: boolean;
    onClose: () => void;
    productToTransfer?: Product | null;
}

const InventoryTransferForm: React.FC<InventoryTransferFormProps> = ({ isOpen, onClose, productToTransfer }) => {
    const { warehouses, products, addInventoryTransfer, getProductStockByWarehouse } = useApp();
    const { addToast } = useNotification();

    const initialFormState: Omit<InventoryTransfer, 'id' | 'transferNumber' | 'status'> = {
        date: new Date().toISOString().split('T')[0],
        fromWarehouseId: warehouses.find(w => w.isDefault)?.id || warehouses[0]?.id || 0,
        toWarehouseId: warehouses.length > 1 ? warehouses.find(w => !w.isDefault)?.id || warehouses[1].id : 0,
        notes: '',
        items: [{ productId: 0, quantity: 1 }],
    };
    const [formData, setFormData] = useState(initialFormState);
    
    useEffect(() => {
        if(productToTransfer) {
            setFormData({ ...initialFormState, items: [{ productId: productToTransfer.id, quantity: 1 }]});
        } else {
            setFormData(initialFormState);
        }
    }, [productToTransfer, isOpen]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name.includes('Id') ? parseInt(value) : value }));
    };

    const handleItemChange = (index: number, field: keyof InventoryTransferItem, value: any) => {
        const newItems = [...formData.items];
        const item = { ...newItems[index] };
        
        const numericValue = parseInt(value, 10) || 0;

        if (field === 'productId') {
            item.productId = numericValue;
        } else if (field === 'quantity') {
            const product = products.find(p => p.id === item.productId);
            const availableStock = getProductStockByWarehouse(item.productId, formData.fromWarehouseId).available;
            if (numericValue > availableStock) {
                addToast(`${product?.name} için kaynak depoda yeterli stok yok (Mevcut: ${availableStock})`, "warning");
                item.quantity = availableStock;
            } else {
                item.quantity = numericValue;
            }
        }
        newItems[index] = item;
        setFormData(prev => ({ ...prev, items: newItems }));
    };
    
    const addItem = () => {
        setFormData(prev => ({ ...prev, items: [...prev.items, { productId: 0, quantity: 1 }] }));
    };
    const removeItem = (index: number) => {
        setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.fromWarehouseId === formData.toWarehouseId) {
            addToast("Kaynak ve hedef depo aynı olamaz.", "error");
            return;
        }
        const validItems = formData.items.filter(i => i.productId > 0 && i.quantity > 0);
        if (validItems.length === 0) {
            addToast("Lütfen en az bir geçerli ürün ekleyin.", "error");
            return;
        }

        addInventoryTransfer({ ...formData, items: validItems });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Yeni Stok Transferi">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <div><label className="block text-sm font-medium">Tarih</label><input type="date" name="date" value={formData.date} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" /></div>
                    <div><label className="block text-sm font-medium">Kaynak Depo</label><select name="fromWarehouseId" value={formData.fromWarehouseId} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">{warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select></div>
                    <div><label className="block text-sm font-medium">Hedef Depo</label><select name="toWarehouseId" value={formData.toWarehouseId} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">{warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select></div>
                </div>
                <div className="border-t pt-4 space-y-2 dark:border-dark-border">
                     {formData.items.map((item, index) => {
                         const availableStock = getProductStockByWarehouse(item.productId, formData.fromWarehouseId).available;
                         return (
                        <div key={index} className="grid grid-cols-[2fr_1fr_auto] gap-2 items-center">
                            <ProductSelector products={products} value={item.productId} onChange={(productId) => handleItemChange(index, 'productId', productId)} disabled={!!(productToTransfer && index === 0)} />
                            <input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} placeholder={`Mevcut: ${availableStock}`} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                            <Button type="button" variant="danger" onClick={() => removeItem(index)} className="!p-2">{ICONS.trash}</Button>
                        </div>
                     )})}
                    {!productToTransfer && <Button type="button" variant="secondary" onClick={addItem} className="text-sm">Ürün Ekle</Button>}
                </div>
                <div className="flex justify-end pt-4 gap-2 border-t dark:border-dark-border">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit">Transfer Oluştur</Button>
                </div>
            </form>
        </Modal>
    );
};

export default InventoryTransferForm;