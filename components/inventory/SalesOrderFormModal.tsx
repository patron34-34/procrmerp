import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { SalesOrder, SalesOrderItem, SalesOrderStatus, Customer, Address } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ICONS } from '../../constants';
import { useNotification } from '../../context/NotificationContext';

interface SalesOrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: SalesOrder | null;
  prefilledData?: Partial<SalesOrderFormData> | null;
}

type SalesOrderFormData = Omit<SalesOrder, 'id' | 'orderNumber' | 'customerName' | 'subTotal' | 'totalDiscount' | 'totalTax' | 'grandTotal'>;

const SalesOrderFormModal: React.FC<SalesOrderFormModalProps> = ({ isOpen, onClose, order, prefilledData }) => {
    const { customers, products, addSalesOrder, updateSalesOrder } = useApp();
    const { addToast } = useNotification();
    
    const emptyAddress: Address = { country: 'Türkiye', city: '', district: '', streetAddress: '', postalCode: '', email: '', phone: '' };

    const initialFormState: SalesOrderFormData = {
        customerId: 0,
        orderDate: new Date().toISOString().split('T')[0],
        status: SalesOrderStatus.OnayBekliyor,
        items: [],
        shippingAddress: emptyAddress,
        billingAddress: emptyAddress,
        notes: '',
        shippingCost: 0,
    };

    const [formData, setFormData] = useState<SalesOrderFormData>(initialFormState);
    const [customerSearch, setCustomerSearch] = useState('');
    const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
    const customerDropdownRef = useRef<HTMLDivElement>(null);

    const filteredCustomers = useMemo(() =>
        customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase())),
        [customers, customerSearch]
    );

    useEffect(() => {
        const firstProduct = products[0];
        const defaultItem = firstProduct ? [{
            productId: firstProduct.id,
            productName: firstProduct.name,
            quantity: 1,
            price: firstProduct.price,
            discountRate: 0,
            taxRate: 20, // Default VAT
            committedStockItemIds: [],
            shippedQuantity: 0
        }] : [];
        
        let initialState = { ...initialFormState, items: defaultItem };
        let initialCustomer: Customer | undefined;

        if (order) {
            initialState = { ...initialState, ...order, shippingCost: order.shippingCost || 0 };
            initialCustomer = customers.find(c => c.id === order.customerId);
        } else if (prefilledData) {
            initialState = { ...initialState, ...prefilledData };
            initialCustomer = customers.find(c => c.id === prefilledData.customerId);
        }
        
        setFormData(initialState);
        if (initialCustomer) {
             setFormData(prev => ({ ...prev, customerId: initialCustomer!.id, billingAddress: initialCustomer!.billingAddress, shippingAddress: initialCustomer!.shippingAddress }));
             setCustomerSearch(initialCustomer.name);
        } else {
             setCustomerSearch('');
        }

    }, [order, prefilledData, isOpen, products, customers]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (customerDropdownRef.current && !customerDropdownRef.current.contains(event.target as Node)) {
                setIsCustomerDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const { subTotal, totalDiscount, totalTax, grandTotal } = useMemo(() => {
        const subTotal = formData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
        const totalDiscount = formData.items.reduce((sum, item) => sum + (item.quantity * item.price * (item.discountRate / 100)), 0);
        const totalTax = formData.items.reduce((sum, item) => {
            const priceAfterDiscount = (item.quantity * item.price) - (item.quantity * item.price * (item.discountRate / 100));
            return sum + (priceAfterDiscount * (item.taxRate / 100));
        }, 0);
        const grandTotal = subTotal - totalDiscount + totalTax + (formData.shippingCost || 0);
        return { subTotal, totalDiscount, totalTax, grandTotal };
    }, [formData.items, formData.shippingCost]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const isNumeric = ['customerId', 'shippingCost'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumeric ? parseFloat(value) || 0 : value }));
    };

    const handleItemChange = (index: number, field: keyof SalesOrderItem, value: any) => {
        const newItems = [...formData.items];
        const item = { ...newItems[index] };
        
        if (field === 'productId') {
            const product = products.find(p => p.id === parseInt(value, 10));
            if (product) {
                item.productId = product.id;
                item.productName = product.name;
                item.price = product.price;
            }
        } else {
            item[field as 'quantity' | 'price' | 'discountRate' | 'taxRate'] = parseFloat(value) || 0;
        }

        newItems[index] = item;
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const addNewItem = () => {
        if (products.length === 0) {
            addToast("Lütfen önce bir ürün ekleyin.", "warning");
            return;
        }
        const firstProduct = products[0];
        setFormData(prev => ({
            ...prev,
            items: [
                ...prev.items,
                { productId: firstProduct.id, productName: firstProduct.name, quantity: 1, price: firstProduct.price, discountRate: 0, taxRate: 20, committedStockItemIds: [], shippedQuantity: 0 }
            ]
        }));
    };

    const removeItem = (index: number) => {
        setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.customerId && formData.items.length > 0) {
            const orderData = { ...formData, subTotal, totalDiscount, totalTax, grandTotal };
            if (order) {
                updateSalesOrder({ ...order, ...orderData });
            } else {
                addSalesOrder(orderData);
            }
            onClose();
        } else {
            addToast("Lütfen bir müşteri seçin ve en az bir ürün ekleyin.", "error");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={order ? "Satış Siparişini Düzenle" : "Yeni Satış Siparişi"} size="4xl">
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div ref={customerDropdownRef}>
                        <label className="block text-sm font-medium">Müşteri *</label>
                        <div className="relative">
                            <input type="text" value={customerSearch} onChange={(e) => {setCustomerSearch(e.target.value); setIsCustomerDropdownOpen(true);}} onFocus={() => setIsCustomerDropdownOpen(true)} className="mt-1 block w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                            {isCustomerDropdownOpen && (
                                <ul className="absolute z-10 w-full bg-card dark:bg-dark-card border dark:border-dark-border rounded-md mt-1 max-h-48 overflow-y-auto">
                                    {filteredCustomers.map(c => (
                                        <li key={c.id} onClick={() => { setFormData(prev => ({ ...prev, customerId: c.id, billingAddress: c.billingAddress, shippingAddress: c.shippingAddress })); setCustomerSearch(c.name); setIsCustomerDropdownOpen(false); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">{c.name}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    <div><label className="block text-sm font-medium">Sipariş Tarihi</label><input type="date" name="orderDate" value={formData.orderDate} onChange={handleInputChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
                </div>

                <div className="border-t pt-4 dark:border-dark-border">
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                       {formData.items.map((item, index) => (
                           <div key={index} className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr_auto] gap-2 items-center">
                               <select value={item.productId} onChange={e => handleItemChange(index, 'productId', e.target.value)} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"><option value={0}>Ürün Seç</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                               <input type="number" placeholder="Miktar" min="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border text-right" />
                               <input type="number" step="0.01" placeholder="Birim Fiyat" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border text-right" />
                               <input type="number" step="0.01" placeholder="İndirim %" value={item.discountRate} onChange={(e) => handleItemChange(index, 'discountRate', e.target.value)} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border text-right" />
                               <input type="number" step="0.01" placeholder="Vergi %" value={item.taxRate} onChange={(e) => handleItemChange(index, 'taxRate', e.target.value)} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border text-right" />
                               <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-1">{ICONS.trash}</button>
                           </div>
                       ))}
                    </div>
                    <Button type="button" variant="secondary" onClick={addNewItem} className="mt-2 text-sm"><span className="flex items-center gap-2">{ICONS.add} Ürün Ekle</span></Button>
                </div>
                 <div className="flex justify-between items-start border-t pt-4 dark:border-dark-border">
                    <div>
                        <label className="block text-sm font-medium">Notlar</label>
                        <textarea name="notes" value={formData.notes || ''} onChange={handleInputChange} rows={3} className="mt-1 p-2 w-full max-w-sm border rounded-md dark:bg-slate-700 dark:border-dark-border"></textarea>
                    </div>
                    <div className="w-64 space-y-2 text-sm">
                        <div className="flex justify-between"><span>Ara Toplam:</span> <span className="font-mono">${subTotal.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>İndirim:</span> <span className="font-mono text-red-500">-${totalDiscount.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Vergi:</span> <span className="font-mono">${totalTax.toFixed(2)}</span></div>
                        <div className="flex justify-between items-center">
                            <label htmlFor="shippingCost">Kargo Ücreti:</label>
                            <input type="number" id="shippingCost" name="shippingCost" value={formData.shippingCost} onChange={handleInputChange} className="w-24 p-1 border rounded-md dark:bg-slate-700 dark:border-dark-border text-right font-mono" />
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2 dark:border-slate-600"><span>Genel Toplam:</span> <span className="font-mono">${grandTotal.toFixed(2)}</span></div>
                    </div>
                 </div>
                
                <div className="flex justify-end pt-4 gap-2">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit">{order ? "Güncelle" : "Sipariş Oluştur"}</Button>
                </div>
            </form>
        </Modal>
    );
};

export default SalesOrderFormModal;