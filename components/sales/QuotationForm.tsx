import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Quotation, QuotationLineItem, QuotationStatus, Customer, Product, Unit } from '../../types';
import Button from '../ui/Button';
import { ICONS } from '../../constants';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import Card from '../ui/Card';

const QuotationForm: React.FC = () => {
    const { quotations, customers, products, addQuotation, updateQuotation, deals, convertQuotationToSalesOrder } = useApp();
    const { addToast } = useNotification();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const location = useLocation();

    const isEditMode = !!id;
    const existingQuotation = isEditMode ? quotations.find(q => q.id === parseInt(id, 10)) : null;

    const initialFormState: Omit<Quotation, 'id' | 'quotationNumber' | 'customerName' | 'subTotal' | 'totalDiscount' | 'totalTax' | 'grandTotal'> = {
        customerId: 0,
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0], // Default 30 days validity
        status: QuotationStatus.Draft,
        items: [],
    };

    const [formData, setFormData] = useState<Partial<Quotation>>(initialFormState);
    const [customerSearch, setCustomerSearch] = useState('');
    const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
    const customerDropdownRef = useRef<HTMLDivElement>(null);
    
    const selectedCustomer = useMemo(() => customers.find(c => c.id === formData.customerId), [customers, formData.customerId]);
    const filteredCustomers = useMemo(() => customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase())), [customers, customerSearch]);

    useEffect(() => {
        let initialState: Partial<Quotation> = { ...initialFormState };
        let initialCustomer: Customer | undefined;
        const dealIdFromState = location.state?.dealId;

        if (existingQuotation) {
            initialState = { ...initialState, ...existingQuotation };
            initialCustomer = customers.find(c => c.id === existingQuotation.customerId);
        } else if (dealIdFromState) {
            const deal = deals.find(d => d.id === dealIdFromState);
            if(deal) {
                initialState.dealId = deal.id;
                initialState.customerId = deal.customerId;
                initialState.items = deal.lineItems.map((li, index) => ({
                    id: Date.now() + index,
                    productId: li.productId,
                    productName: li.productName,
                    quantity: li.quantity,
                    unit: products.find(p => p.id === li.productId)?.unit || Unit.Adet,
                    unitPrice: li.price,
                    discountRate: 0,
                    taxRate: products.find(p => p.id === li.productId)?.financials.vatRate || 20,
                    totalPrice: 0, // will be recalculated
                }));
                initialCustomer = customers.find(c => c.id === deal.customerId);
            }
        }
        
        setFormData(initialState);
        if (initialCustomer) {
            setCustomerSearch(initialCustomer.name);
        } else {
            setCustomerSearch('');
        }
    }, [existingQuotation, deals, customers, products, location.state]);

    const { subTotal, totalDiscount, totalTax, grandTotal } = useMemo(() => {
        const items = formData.items || [];
        const subTotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const totalDiscount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * (item.discountRate / 100)), 0);
        const totalTax = items.reduce((sum, item) => {
            const priceAfterDiscount = (item.quantity * item.unitPrice) * (1 - (item.discountRate / 100));
            return sum + (priceAfterDiscount * (item.taxRate / 100));
        }, 0);
        const grandTotal = subTotal - totalDiscount + totalTax;
        return { subTotal, totalDiscount, totalTax, grandTotal };
    }, [formData.items]);

    const handleCustomerSelect = (customer: Customer) => {
        setFormData(prev => ({...prev, customerId: customer.id}));
        setCustomerSearch(customer.name);
        setIsCustomerDropdownOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleItemChange = (index: number, field: keyof QuotationLineItem, value: any) => {
        const newItems = [...(formData.items || [])];
        const item = { ...newItems[index] };
        
        if (field === 'productId') {
            const product = products.find(p => p.id === parseInt(value));
            if (product) {
                item.productId = product.id;
                item.productName = product.name;
                item.unitPrice = product.price;
                item.taxRate = product.financials.vatRate;
                item.unit = product.unit;
            }
        } else {
            (item as any)[field] = parseFloat(value) || 0;
        }
        newItems[index] = item;
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const addNewItem = () => {
        const newItem: QuotationLineItem = { id: Date.now(), productId: 0, productName: '', quantity: 1, unit: Unit.Adet, unitPrice: 0, discountRate: 0, taxRate: 20, totalPrice: 0 };
        setFormData(prev => ({ ...prev, items: [...(prev.items || []), newItem] }));
    };

    const removeItem = (index: number) => {
        setFormData(prev => ({ ...prev, items: (prev.items || []).filter((_, i) => i !== index) }));
    };

    const handleSave = (status: QuotationStatus) => {
        if (!formData.customerId || !formData.items || formData.items.length === 0) {
            addToast('Lütfen müşteri seçin ve en az bir ürün ekleyin.', 'error');
            return;
        }
        const dataToSave = { ...formData, status, subTotal, totalDiscount, totalTax, grandTotal };

        if (isEditMode) {
            updateQuotation(dataToSave as Quotation);
        } else {
            addQuotation(dataToSave as Omit<Quotation, 'id' | 'quotationNumber' | 'customerName'>);
        }
        navigate('/sales/quotations');
    };

    const handleStatusChange = (newStatus: QuotationStatus) => {
        if (existingQuotation) {
            updateQuotation({ ...existingQuotation, status: newStatus });
        }
    };
    
    const handleConvertToOrder = () => {
        if (existingQuotation) {
           const newOrder = convertQuotationToSalesOrder(existingQuotation.id);
           if(newOrder) {
               addToast(`Satış Siparişi #${newOrder.orderNumber} oluşturuldu.`, 'success');
               navigate(`/inventory/sales-orders/${newOrder.id}`);
           }
        }
    }

    return (
        <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{isEditMode ? `Teklifi Düzenle: ${existingQuotation?.quotationNumber}` : "Yeni Teklif Oluştur"}</h1>
                <div className="flex gap-2">
                    {formData.status === QuotationStatus.Draft && <Button variant="secondary" onClick={() => handleSave(QuotationStatus.Sent)}>Kaydet ve Gönder</Button>}
                    {formData.status === QuotationStatus.Sent && <Button variant="secondary" onClick={() => handleStatusChange(QuotationStatus.Accepted)}>Kabul Edildi Olarak İşaretle</Button>}
                    {formData.status === QuotationStatus.Sent && <Button variant="secondary" onClick={() => handleStatusChange(QuotationStatus.Rejected)}>Reddedildi Olarak İşaretle</Button>}
                    {formData.status === QuotationStatus.Accepted && <Button variant="primary" onClick={handleConvertToOrder}>Siparişe Dönüştür</Button>}
                    <Button onClick={() => handleSave(formData.status || QuotationStatus.Draft)}>Kaydet</Button>
                </div>
            </div>
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
                    <div ref={customerDropdownRef}>
                        <label className="block text-sm font-medium">Müşteri *</label>
                        <div className="relative">
                            <input type="text" value={customerSearch} onChange={(e) => {setCustomerSearch(e.target.value); setIsCustomerDropdownOpen(true);}} onFocus={() => setIsCustomerDropdownOpen(true)} className="mt-1 block w-full"/>
                            {isCustomerDropdownOpen && <ul className="absolute z-10 w-full bg-card border rounded-md mt-1 max-h-48 overflow-y-auto">{filteredCustomers.map(c => <li key={c.id} onClick={() => handleCustomerSelect(c)} className="p-2 hover:bg-slate-100 cursor-pointer">{c.name}</li>)}</ul>}
                        </div>
                    </div>
                    <div><label className="block text-sm font-medium">Teklif Tarihi</label><input type="date" name="issueDate" value={formData.issueDate} onChange={handleInputChange} className="mt-1 w-full"/></div>
                    <div><label className="block text-sm font-medium">Geçerlilik Tarihi</label><input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} className="mt-1 w-full"/></div>
                    <div><label className="block text-sm font-medium">Durum</label><input type="text" value={formData.status} readOnly className="mt-1 w-full bg-slate-100 dark:bg-slate-800"/></div>
                </div>

                <div className="p-4 border-t dark:border-dark-border">
                     <h3 className="text-lg font-semibold mb-2">Ürünler</h3>
                     <div className="space-y-2">
                        {formData.items?.map((item, index) => (
                            <div key={item.id} className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr_auto] gap-2 items-center">
                                <select value={item.productId} onChange={e => handleItemChange(index, 'productId', e.target.value)} className="w-full p-2 border rounded-md text-sm"><option value={0}>Ürün Seç</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                                <input type="number" placeholder="Miktar" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className="w-full p-2 border rounded-md text-right text-sm" />
                                <input type="number" step="0.01" placeholder="Birim Fiyat" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', e.target.value)} className="w-full p-2 border rounded-md text-right text-sm" />
                                <input type="number" step="0.01" placeholder="İndirim %" value={item.discountRate} onChange={e => handleItemChange(index, 'discountRate', e.target.value)} className="w-full p-2 border rounded-md text-right text-sm" />
                                <input type="number" step="0.01" placeholder="Vergi %" value={item.taxRate} onChange={e => handleItemChange(index, 'taxRate', e.target.value)} className="w-full p-2 border rounded-md text-right text-sm" />
                                <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-1">{ICONS.trash}</button>
                            </div>
                        ))}
                     </div>
                     <Button type="button" variant="secondary" onClick={addNewItem} className="mt-2 text-sm"><span className="flex items-center gap-2">{ICONS.add} Ürün Ekle</span></Button>
                </div>
                 <div className="flex justify-between items-start p-4 border-t dark:border-dark-border">
                    <div>
                        <div><label className="block text-sm font-medium">Notlar</label><textarea name="notes" value={formData.notes || ''} onChange={handleInputChange} rows={2} className="mt-1 p-2 w-full max-w-sm border rounded-md"></textarea></div>
                        <div><label className="block text-sm font-medium mt-2">Şartlar ve Koşullar</label><textarea name="terms" value={formData.terms || ''} onChange={handleInputChange} rows={2} className="mt-1 p-2 w-full max-w-sm border rounded-md"></textarea></div>
                    </div>
                    <div className="w-64 space-y-2 text-sm">
                        <div className="flex justify-between"><span>Ara Toplam:</span> <span className="font-mono">${subTotal.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>İndirim:</span> <span className="font-mono text-red-500">-${totalDiscount.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Vergi:</span> <span className="font-mono">${totalTax.toFixed(2)}</span></div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2 dark:border-slate-600"><span>Genel Toplam:</span> <span className="font-mono">${grandTotal.toFixed(2)}</span></div>
                    </div>
                 </div>
            </Card>
        </div>
    );
};

export default QuotationForm;
