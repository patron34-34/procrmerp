import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { PurchaseOrder, PurchaseOrderItem, PurchaseOrderStatus } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import ProductSelector from '../../inventory/ProductSelector';
import { useNotification } from '../../../context/NotificationContext';

const PurchaseOrderForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { purchaseOrders, suppliers, warehouses, products, addPurchaseOrder, updatePurchaseOrder, hasPermission } = useApp();
    const { addToast } = useNotification();

    const isEditMode = !!id;
    const existingPO = useMemo(() => isEditMode ? purchaseOrders.find(p => p.id === parseInt(id)) : null, [id, purchaseOrders, isEditMode]);
    const isDraft = useMemo(() => !existingPO || existingPO.status === PurchaseOrderStatus.Draft, [existingPO]);
    const canManageInventory = hasPermission('envanter:yonet');
    const canEdit = canManageInventory && isDraft;

    const initialFormState: Omit<PurchaseOrder, 'id' | 'poNumber' | 'supplierName' | 'totalAmount' > = {
        supplierId: suppliers[0]?.id || 0,
        orderDate: new Date().toISOString().split('T')[0],
        expectedDate: new Date().toISOString().split('T')[0],
        targetWarehouseId: warehouses.find(w => w.isDefault)?.id || warehouses[0]?.id || 0,
        status: PurchaseOrderStatus.Draft,
        items: [{ productId: 0, productName: '', quantity: 1, price: 0, receivedQuantity: 0 }],
    };

    const [formData, setFormData] = useState(initialFormState);
    
    useEffect(() => {
        if (isEditMode && existingPO) {
            setFormData(existingPO);
        } else {
            setFormData(initialFormState);
        }
    }, [id, existingPO, isEditMode, suppliers, warehouses]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name.includes('Id') ? parseInt(value) : value }));
    };

    const handleItemChange = (index: number, field: keyof PurchaseOrderItem, value: any) => {
        const newItems = [...formData.items];
        const item = { ...newItems[index] };

        const numericValue = parseFloat(value) || 0;
        
        if (field === 'productId') {
            item.productId = numericValue;
            const product = products.find(p => p.id === numericValue);
            if (product) {
                item.productName = product.name;
                item.price = product.price; // Set default price
            }
        } else if (field === 'quantity' || field === 'price') {
            item[field] = numericValue;
        }

        newItems[index] = item;
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setFormData(prev => ({...prev, items: [...prev.items, { productId: 0, productName: '', quantity: 1, price: 0, receivedQuantity: 0 }]}));
    };
    const removeItem = (index: number) => {
        setFormData(prev => ({...prev, items: prev.items.filter((_, i) => i !== index)}));
    };

    const totalAmount = useMemo(() => {
        return formData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    }, [formData.items]);

    const handleSave = (newStatus: PurchaseOrderStatus) => {
        const validItems = formData.items.filter(i => i.productId > 0 && i.quantity > 0);
        if (validItems.length === 0) {
            addToast("Lütfen en az bir geçerli ürün ekleyin.", "error");
            return;
        }

        if (isEditMode && existingPO) {
            updatePurchaseOrder({ ...existingPO, ...formData, items: validItems, status: newStatus, totalAmount });
        } else {
            addPurchaseOrder({ ...formData, items: validItems, status: newStatus, totalAmount });
        }
        navigate('/inventory/purchase-orders');
    };


    return (
        <Card>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-dark-border flex-wrap gap-4">
                    <h2 className="text-xl font-bold">{isEditMode ? `S.A. Siparişi: ${existingPO?.poNumber}` : 'Yeni Satın Alma Siparişi'}</h2>
                    <div className="flex gap-2">
                        <Button type="button" variant="secondary" onClick={() => navigate('/inventory/purchase-orders')}>
                             {isDraft ? 'İptal' : 'Listeye Dön'}
                        </Button>
                        {isDraft && canManageInventory && (
                            <>
                                <Button type="button" variant="secondary" onClick={() => handleSave(PurchaseOrderStatus.Draft)}>Taslağı Kaydet</Button>
                                <Button type="button" onClick={() => handleSave(PurchaseOrderStatus.Ordered)}>Siparişi Onayla</Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium">Tedarikçi *</label>
                        <select name="supplierId" value={formData.supplierId} onChange={handleInputChange} required disabled={!canEdit} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border disabled:bg-slate-100 dark:disabled:bg-slate-800">
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Hedef Depo *</label>
                        <select name="targetWarehouseId" value={formData.targetWarehouseId} onChange={handleInputChange} required disabled={!canEdit} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border disabled:bg-slate-100 dark:disabled:bg-slate-800">
                            {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Sipariş Tarihi</label>
                        <input type="date" name="orderDate" value={formData.orderDate} onChange={handleInputChange} disabled={!canEdit} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border disabled:bg-slate-100 dark:disabled:bg-slate-800"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Tahmini Teslim Tarihi</label>
                        <input type="date" name="expectedDate" value={formData.expectedDate} onChange={handleInputChange} disabled={!canEdit} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border disabled:bg-slate-100 dark:disabled:bg-slate-800"/>
                    </div>
                </div>
                
                <div className="border-t pt-4 dark:border-dark-border">
                    <h3 className="text-lg font-semibold mb-2">Ürünler</h3>
                    <div className="space-y-2">
                        {/* Header */}
                        <div className="grid grid-cols-[3fr_1fr_1fr_1fr_auto] gap-4 font-semibold text-sm px-2 pb-1 border-b dark:border-dark-border">
                           <span>Ürün</span>
                           <span className="text-right">Miktar</span>
                           <span className="text-right">Birim Fiyat</span>
                           <span className="text-right">Toplam</span>
                           <span></span>
                        </div>
                        {formData.items.map((item, index) => (
                            <div key={index} className="grid grid-cols-[3fr_1fr_1fr_1fr_auto] gap-4 items-center">
                                <ProductSelector products={products} value={item.productId} onChange={(productId) => handleItemChange(index, 'productId', productId)} disabled={!canEdit} />
                                <input type="number" min="1" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} disabled={!canEdit} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border text-right disabled:bg-slate-100 dark:disabled:bg-slate-800" />
                                <input type="number" step="0.01" value={item.price} onChange={e => handleItemChange(index, 'price', e.target.value)} disabled={!canEdit} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border text-right disabled:bg-slate-100 dark:disabled:bg-slate-800" />
                                <span className="text-right font-mono pr-2">${(item.quantity * item.price).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                {canEdit ? (
                                    <Button type="button" variant="danger" onClick={() => removeItem(index)} className="!p-2">{ICONS.trash}</Button>
                                ) : <div className="w-10 h-10"></div>}
                            </div>
                        ))}
                    </div>
                    {canEdit && <Button type="button" variant="secondary" onClick={addItem} className="mt-2 text-sm">
                       <span className="flex items-center gap-2">{ICONS.add} Ürün Ekle</span>
                    </Button>}
                </div>
                
                <div className="flex justify-end pt-4 mt-4 border-t dark:border-dark-border">
                    <div className="w-64 space-y-2">
                         <div className="flex justify-between font-bold text-xl">
                            <span>Genel Toplam:</span>
                            <span className="font-mono">${totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                        </div>
                    </div>
                </div>
            </form>
        </Card>
    );
};

export default PurchaseOrderForm;