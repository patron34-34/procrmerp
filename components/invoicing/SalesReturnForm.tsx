import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SalesReturn, SalesReturnStatus, InvoiceLineItem, Product, Unit } from '../../types';
import Button from '../ui/Button';
import { ICONS } from '../../constants';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Card from '../ui/Card';

const SalesReturnForm: React.FC = () => {
    const { customers, products, addSalesReturn, updateSalesReturn, salesReturns } = useApp();
    const { addToast } = useNotification();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const isEditMode = !!id;
    const existingReturn = isEditMode ? salesReturns.find(sr => sr.id === parseInt(id, 10)) : null;

    const initialFormState: Omit<SalesReturn, 'id' | 'returnNumber' | 'customerName' | 'subTotal' | 'totalTax' | 'grandTotal'> = {
        customerId: customers[0]?.id || 0,
        issueDate: new Date().toISOString().split('T')[0],
        status: SalesReturnStatus.Draft,
        items: [],
        reason: '',
    };
    const [formData, setFormData] = useState<Partial<SalesReturn>>(initialFormState);

    useEffect(() => {
        if (existingReturn) {
            setFormData(existingReturn);
        } else {
            setFormData(initialFormState);
        }
    }, [existingReturn]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'customerId' ? parseInt(value) : value }));
    };

    const handleItemChange = (index: number, field: keyof InvoiceLineItem, value: any) => {
        const newItems = [...(formData.items || [])];
        const item = { ...newItems[index] };

        if (field === 'productId') {
            const product = products.find(p => p.id === parseInt(value));
            if (product) {
                item.productId = product.id;
                item.productName = product.name;
                item.unitPrice = product.price;
                item.taxRate = product.financials.vatRate;
            }
        } else {
            (item as any)[field] = parseFloat(value) || 0;
        }
        newItems[index] = item;
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const addNewItem = () => {
        const newItem: InvoiceLineItem = { id: Date.now(), productId: 0, productName: '', quantity: 1, unit: Unit.Adet, unitPrice: 0, discountRate: 0, taxRate: 20, discountAmount: 0, taxAmount: 0, totalPrice: 0, vatIncludedPrice: 0 };
        setFormData(prev => ({ ...prev, items: [...(prev.items || []), newItem] }));
    };
    
    const removeItem = (index: number) => {
        setFormData(prev => ({ ...prev, items: (prev.items || []).filter((_, i) => i !== index) }));
    };

    const totals = useMemo(() => {
        const items = formData.items || [];
        const subTotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
        const totalTax = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * (item.taxRate / 100)), 0);
        const grandTotal = subTotal + totalTax;
        return { subTotal, totalTax, grandTotal };
    }, [formData.items]);

    const handleSubmit = (status: SalesReturnStatus) => {
        if (!formData.customerId || !formData.items || formData.items.length === 0) {
            addToast('Lütfen müşteri seçin ve en az bir ürün ekleyin.', 'error');
            return;
        }

        const finalData = {
            ...formData,
            status,
            ...totals,
            items: formData.items,
        };

        if (isEditMode) {
            updateSalesReturn(finalData as SalesReturn);
        } else {
            addSalesReturn(finalData as Omit<SalesReturn, 'id' | 'returnNumber' | 'customerName'>);
        }
        navigate('/invoicing/returns');
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-dark-border">
                <h2 className="text-xl font-bold">{isEditMode ? 'Satış İadesini Düzenle' : 'Yeni Satış İadesi'}</h2>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => navigate('/invoicing/returns')}>İptal</Button>
                    <Button variant="secondary" onClick={() => handleSubmit(SalesReturnStatus.Draft)}>Taslak Kaydet</Button>
                    <Button onClick={() => handleSubmit(SalesReturnStatus.Approved)}>Onayla</Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium">Müşteri</label>
                    <select name="customerId" value={formData.customerId} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">İade Tarihi</label>
                    <input type="date" name="issueDate" value={formData.issueDate} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium">İade Nedeni</label>
                    <input name="reason" value={formData.reason} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                </div>
            </div>
            <div className="border-t pt-4 dark:border-dark-border">
                 <h3 className="text-lg font-semibold mb-2">İade Edilen Ürünler</h3>
                 <div className="space-y-2">
                    {formData.items?.map((item, index) => (
                         <div key={index} className="grid grid-cols-[3fr_1fr_1fr_auto] gap-2 items-center">
                            <select value={item.productId} onChange={e => handleItemChange(index, 'productId', e.target.value)} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border text-sm">
                                <option value={0}>Ürün Seçin</option>
                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            <input type="number" placeholder="Miktar" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className="w-full p-2 border rounded-md text-right dark:bg-slate-700 dark:border-dark-border text-sm" />
                            <input type="number" placeholder="Birim Fiyat" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', e.target.value)} className="w-full p-2 border rounded-md text-right dark:bg-slate-700 dark:border-dark-border text-sm" />
                            <Button type="button" variant="danger" onClick={() => removeItem(index)} className="!p-2">{ICONS.trash}</Button>
                        </div>
                    ))}
                 </div>
                 <Button type="button" variant="secondary" onClick={addNewItem} className="mt-2 text-sm">
                    <span className="flex items-center gap-2">{ICONS.add} Ürün Ekle</span>
                </Button>
            </div>
            <div className="flex justify-end pt-4 mt-4 border-t dark:border-dark-border">
                <div className="w-64 space-y-2 text-sm">
                    <div className="flex justify-between"><span>Ara Toplam:</span> <span className="font-mono">${totals.subTotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Vergi (KDV):</span> <span className="font-mono">${totals.totalTax.toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2 dark:border-slate-600"><span>Toplam İade Tutarı:</span> <span className="font-mono">${totals.grandTotal.toFixed(2)}</span></div>
                </div>
            </div>
        </Card>
    );
};

export default SalesReturnForm;
