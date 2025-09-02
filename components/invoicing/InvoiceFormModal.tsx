import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice, InvoiceStatus, InvoiceLineItem, EInvoiceScenario, InvoiceType, EInvoiceProfile } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ICONS, TEVKIFAT_KODLARI } from '../../constants';
import { useNotification } from '../../context/NotificationContext';
import { numberToWords } from '../../utils/numberToWords';

interface InvoiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  prefilledData?: Partial<Omit<Invoice, 'id' | 'invoiceNumber' | 'customerName'>> | null;
}

const InvoiceFormModal: React.FC<InvoiceFormModalProps> = ({ isOpen, onClose, invoice, prefilledData }) => {
    const { customers, products, addInvoice, updateInvoice } = useApp();
    const { addToast } = useNotification();

    const today = new Date();
    const currentTime = today.toTimeString().slice(0, 5);
    const initialFormState: Omit<Invoice, 'id' | 'invoiceNumber' | 'customerName' | 'subTotal' | 'totalDiscount' | 'totalTax' | 'grandTotal' | 'totalWithholding' | 'amountInWords'> = {
        customerId: customers[0]?.id || 0,
        issueDate: today.toISOString().split('T')[0],
        issueTime: currentTime,
        dueDate: today.toISOString().split('T')[0],
        status: InvoiceStatus.Draft,
        items: [],
        notes: '',
        scenario: EInvoiceScenario.EArsiv,
        invoiceType: 'Satış',
        documentCurrency: 'TRY',
        customizationId: 'TR1.2',
        eInvoiceType: EInvoiceProfile.Temel
    };
    const [formData, setFormData] = useState(initialFormState);

    const [totals, setTotals] = useState({
        subTotal: 0,
        totalDiscount: 0,
        totalTax: 0,
        totalWithholding: 0,
        grandTotal: 0
    });

    useEffect(() => {
        const firstProduct = products[0];
        const defaultItem: InvoiceLineItem[] = firstProduct ? [{
            id: Date.now(),
            productId: firstProduct.id,
            productName: firstProduct.name,
            quantity: 1,
            unit: 'Adet',
            unitPrice: firstProduct.price,
            discountRate: 0,
            taxRate: 20,
            discountAmount: 0,
            totalPrice: firstProduct.price,
            taxAmount: firstProduct.price * 0.20,
            vatIncludedPrice: firstProduct.price * 1.20,
        }] : [];

        let initialState: any = { ...initialFormState, items: defaultItem };

        if (invoice) {
            initialState = {
                ...initialState,
                ...invoice,
                items: invoice.items.map(item => ({...item})), // Create deep copy
            };
        } else if (prefilledData) {
            initialState = { ...initialState, ...prefilledData };
        }
        
        setFormData(initialState);
    }, [invoice, prefilledData, isOpen, products, customers]);

    useEffect(() => {
        const items = formData.items || [];
        let subTotal = 0, totalDiscount = 0, totalTax = 0, totalWithholding = 0;

        items.forEach(item => {
            const lineTotal = (item.quantity || 0) * (item.unitPrice || 0);
            const discountAmount = lineTotal * ((item.discountRate || 0) / 100);
            const priceAfterDiscount = lineTotal - discountAmount;
            const taxAmount = priceAfterDiscount * ((item.taxRate || 0) / 100);
            
            subTotal += lineTotal;
            totalDiscount += discountAmount;
            totalTax += taxAmount;
            
            if (formData.invoiceType === 'Tevkifat' && item.withholdingCode) {
                const tevkifatInfo = TEVKIFAT_KODLARI.find(t => t.code === item.withholdingCode);
                if (tevkifatInfo) {
                    totalWithholding += taxAmount * tevkifatInfo.rate;
                }
            }
        });

        const grandTotal = subTotal - totalDiscount + totalTax - totalWithholding;

        setTotals({ subTotal, totalDiscount, totalTax, totalWithholding, grandTotal });

    }, [formData.items, formData.invoiceType]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const parsedValue = ['customerId'].includes(name) ? parseInt(value) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleItemChange = (index: number, field: keyof InvoiceLineItem, value: any) => {
        const newItems = [...formData.items];
        const item = { ...newItems[index] };
        
        if (field === 'productId') {
            const product = products.find(p => p.id === parseInt(value));
            if (product) {
                item.productId = product.id;
                item.productName = product.name;
                item.unitPrice = product.price;
            }
        } else {
            (item as any)[field] = (field === 'unit' || field === 'productName') ? value : parseFloat(value) || 0;
        }
        newItems[index] = item;
        setFormData(prev => ({ ...prev, items: newItems }));
    };
    
    const addNewItem = () => {
        const firstProduct = products[0];
        if (!firstProduct) {
            addToast("Lütfen önce bir ürün ekleyin.", "warning");
            return;
        }
        const newItem: InvoiceLineItem = {
            id: Date.now(),
            productId: firstProduct.id,
            productName: firstProduct.name,
            quantity: 1,
            unit: 'Adet',
            unitPrice: firstProduct.price,
            discountRate: 0,
            taxRate: 20,
            discountAmount: 0,
            totalPrice: firstProduct.price,
            taxAmount: firstProduct.price * 0.20,
            vatIncludedPrice: firstProduct.price * 1.20
        };
        setFormData(prev => ({...prev, items: [...prev.items, newItem]}));
    };

    const removeItem = (index: number) => {
        if(formData.items.length <= 1) {
            addToast("Faturada en az bir kalem olmalıdır.", "warning");
            return;
        }
        setFormData(prev => ({...prev, items: prev.items.filter((_, i) => i !== index)}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.customerId && formData.items.length > 0) {
            const { subTotal, totalDiscount, totalTax, grandTotal, totalWithholding } = totals;
            const invoiceData = {
                ...formData,
                subTotal,
                totalDiscount,
                totalTax,
                grandTotal,
                totalWithholding,
                amountInWords: numberToWords(grandTotal, formData.documentCurrency || 'TRY'),
            }
            if (invoice) {
                updateInvoice({ ...invoice, ...invoiceData });
            } else {
                addInvoice(invoiceData as Omit<Invoice, 'id' | 'invoiceNumber' | 'customerName'>);
            }
            onClose();
        } else {
            addToast("Lütfen bir müşteri seçin ve en az bir fatura kalemi ekleyin.", "error");
        }
    };

    const { subTotal, totalDiscount, totalTax, grandTotal } = totals;

    return (
        <Modal size="4xl" isOpen={isOpen} onClose={onClose} title={invoice ? "Faturayı Düzenle" : "Yeni Fatura Oluştur"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                     <div><label htmlFor="customerId" className="block text-sm font-medium">Müşteri *</label><select name="customerId" id="customerId" value={formData.customerId} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"><option value={0} disabled>Seçiniz...</option>{customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                     <div><label htmlFor="issueDate" className="block text-sm font-medium">Fatura Tarihi</label><input type="date" name="issueDate" id="issueDate" value={formData.issueDate} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" /></div>
                     <div><label htmlFor="dueDate" className="block text-sm font-medium">Vade Tarihi</label><input type="date" name="dueDate" id="dueDate" value={formData.dueDate} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" /></div>
                     <div><label htmlFor="status" className="block text-sm font-medium">Durum</label><select name="status" id="status" value={formData.status} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">{Object.values(InvoiceStatus).map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                </div>
                
                <div className="border-t pt-4 dark:border-dark-border">
                     <h4 className="text-lg font-medium mb-2">Fatura Kalemleri</h4>
                     <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {formData.items.map((item, index) => (
                            <div key={item.id} className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr_auto] gap-2 items-center">
                                <select value={item.productId} onChange={e => handleItemChange(index, 'productId', e.target.value)} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border text-sm"><option value={0}>Ürün Seçin</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                                <input type="number" placeholder="Miktar" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className="w-full p-2 border rounded-md text-right dark:bg-slate-700 dark:border-dark-border text-sm" />
                                <input type="text" placeholder="Birim" value={item.unit} onChange={e => handleItemChange(index, 'unit', e.target.value)} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border text-sm" />
                                <input type="number" placeholder="Birim Fiyat" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', e.target.value)} className="w-full p-2 border rounded-md text-right dark:bg-slate-700 dark:border-dark-border text-sm" />
                                <input type="number" placeholder="İsk. %" value={item.discountRate} onChange={e => handleItemChange(index, 'discountRate', e.target.value)} className="w-full p-2 border rounded-md text-right dark:bg-slate-700 dark:border-dark-border text-sm" />
                                <input type="number" placeholder="KDV %" value={item.taxRate} onChange={e => handleItemChange(index, 'taxRate', e.target.value)} className="w-full p-2 border rounded-md text-right dark:bg-slate-700 dark:border-dark-border text-sm" />
                                <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-1">{ICONS.trash}</button>
                            </div>
                        ))}
                     </div>
                     <Button type="button" variant="secondary" onClick={addNewItem} className="mt-2 text-sm"><span className="flex items-center gap-2">{ICONS.add} Kalem Ekle</span></Button>
                </div>

                 <div className="flex justify-between items-start border-t pt-4 dark:border-dark-border">
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium">Notlar</label>
                        <textarea name="notes" id="notes" value={formData.notes || ''} onChange={handleInputChange} rows={3} className="mt-1 p-2 w-full max-w-sm border rounded-md dark:bg-slate-700 dark:border-dark-border"></textarea>
                    </div>
                    <div className="w-64 space-y-2 text-sm">
                        <div className="flex justify-between"><span>Ara Toplam:</span> <span className="font-mono">${subTotal.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>İndirim:</span> <span className="font-mono">-${totalDiscount.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Vergi (KDV):</span> <span className="font-mono">${totalTax.toFixed(2)}</span></div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t dark:border-slate-600"><span>Genel Toplam:</span> <span className="font-mono">${grandTotal.toFixed(2)}</span></div>
                    </div>
                 </div>

                <div className="flex justify-end pt-4 gap-2">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit">{invoice ? "Güncelle" : "Oluştur"}</Button>
                </div>
            </form>
        </Modal>
    );
};

export default InvoiceFormModal;
