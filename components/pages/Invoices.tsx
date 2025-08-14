


import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice, InvoiceStatus, InvoiceLineItem } from '../../types';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import ConfirmationModal from '../ui/ConfirmationModal';
import { ICONS } from '../../constants';
import { useNotification } from '../../context/NotificationContext';

const Invoices: React.FC = () => {
    const { invoices, customers, products, addInvoice, updateInvoice, deleteInvoice, hasPermission } = useApp();
    const { addToast } = useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
    const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);

    const canManageInvoices = hasPermission('fatura:yonet');

    const today = new Date().toISOString().split('T')[0];
    const initialFormState: Omit<Invoice, 'id' | 'invoiceNumber' | 'customerName' | 'subTotal' | 'totalDiscount' | 'totalTax' | 'grandTotal'> = {
        customerId: customers[0]?.id || 0,
        issueDate: today,
        dueDate: today,
        status: InvoiceStatus.Draft,
        items: [],
        notes: '',
    };
    const [formData, setFormData] = useState(initialFormState);

    const resetForm = () => {
        setFormData(initialFormState);
        setEditingInvoice(null);
    };

    const openModalForNew = () => {
        if (!canManageInvoices) return;
        resetForm();
        // Add one default item line
        const firstProduct = products[0];
        if (firstProduct) {
            setFormData({
                ...initialFormState,
                items: [{
                    id: Date.now(),
                    productId: firstProduct.id,
                    productName: firstProduct.name,
                    quantity: 1,
                    unit: 'Adet',
                    unitPrice: firstProduct.price,
                    discountRate: 0,
                    taxRate: 20, // Default tax rate
                }]
            });
        }
        setIsModalOpen(true);
    };

    const openModalForEdit = (invoice: Invoice) => {
        if (!canManageInvoices) return;
        setEditingInvoice(invoice);
        setFormData({
            customerId: invoice.customerId,
            issueDate: invoice.issueDate,
            dueDate: invoice.dueDate,
            status: invoice.status,
            items: invoice.items.map(item => ({...item})), // Create a deep copy to avoid direct state mutation
            notes: invoice.notes,
        });
        setIsModalOpen(true);
    };

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

    const { subTotal, totalDiscount, totalTax, grandTotal } = useMemo(() => {
        let subTotal = 0, totalDiscount = 0, totalTax = 0, grandTotal = 0;
        formData.items.forEach(item => {
            const lineTotal = item.quantity * item.unitPrice;
            const discountAmount = lineTotal * (item.discountRate / 100);
            const priceAfterDiscount = lineTotal - discountAmount;
            const taxAmount = priceAfterDiscount * (item.taxRate / 100);
            
            subTotal += lineTotal;
            totalDiscount += discountAmount;
            totalTax += taxAmount;
            grandTotal += priceAfterDiscount + taxAmount;
        });
        return { subTotal, totalDiscount, totalTax, grandTotal };
    }, [formData.items]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.customerId && formData.items.length > 0) {
            const invoiceData = {
                ...formData,
                subTotal,
                totalDiscount,
                totalTax,
                grandTotal
            }
            if (editingInvoice) {
                updateInvoice({ ...editingInvoice, ...invoiceData });
            } else {
                addInvoice(invoiceData);
            }
            setIsModalOpen(false);
            resetForm();
        } else {
            addToast("Lütfen bir müşteri seçin ve en az bir fatura kalemi ekleyin.", "error");
        }
    };
    
    const handleDeleteConfirm = () => {
        if(invoiceToDelete) {
            deleteInvoice(invoiceToDelete.id);
            setInvoiceToDelete(null);
        }
    };

    const getStatusBadge = (status: InvoiceStatus) => {
        const styles: { [key in InvoiceStatus]: string } = {
            [InvoiceStatus.Paid]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            [InvoiceStatus.Sent]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            [InvoiceStatus.Overdue]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            [InvoiceStatus.Draft]: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };

    return (
        <>
            <Card
                title="Tüm Faturalar"
                action={canManageInvoices ? <Button onClick={openModalForNew}><span className="flex items-center gap-2">{ICONS.add} Yeni Fatura</span></Button> : undefined}
            >
                <div className="overflow-x-auto">
                    {invoices.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-200 dark:border-dark-border">
                                <tr className="bg-slate-50 dark:bg-slate-900/50">
                                    <th className="p-4 font-semibold">Fatura No</th>
                                    <th className="p-4 font-semibold">Müşteri</th>
                                    <th className="p-4 font-semibold">Fatura Tarihi</th>
                                    <th className="p-4 font-semibold">Vade Tarihi</th>
                                    <th className="p-4 font-semibold">Tutar</th>
                                    <th className="p-4 font-semibold">Durum</th>
                                    {canManageInvoices && <th className="p-4 font-semibold">Eylemler</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((invoice) => (
                                    <tr key={invoice.id} className="border-b border-slate-200 hover:bg-slate-50 dark:border-dark-border dark:hover:bg-slate-800/50">
                                        <td className="p-4 font-medium">{invoice.invoiceNumber}</td>
                                        <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{invoice.customerName}</td>
                                        <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{invoice.issueDate}</td>
                                        <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{invoice.dueDate}</td>
                                        <td className="p-4 font-semibold text-text-main dark:text-dark-text-main">${invoice.grandTotal.toLocaleString()}</td>
                                        <td className="p-4">{getStatusBadge(invoice.status)}</td>
                                        {canManageInvoices && <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => openModalForEdit(invoice)} className="text-slate-500 hover:text-primary-600 dark:hover:text-primary-400">{ICONS.edit}</button>
                                                <button onClick={() => setInvoiceToDelete(invoice)} className="text-slate-500 hover:text-red-600 dark:hover:text-red-500">{ICONS.trash}</button>
                                            </div>
                                        </td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                         <EmptyState
                            icon={ICONS.invoices}
                            title="Henüz Fatura Yok"
                            description="İlk faturanızı oluşturarak başlayın."
                            action={canManageInvoices ? <Button onClick={openModalForNew}>Fatura Oluştur</Button> : undefined}
                        />
                    )}
                </div>
            </Card>

            {canManageInvoices && <Modal size="4xl" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingInvoice ? "Faturayı Düzenle" : "Yeni Fatura Oluştur"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Header */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                         <div><label htmlFor="customerId" className="block text-sm font-medium">Müşteri *</label><select name="customerId" id="customerId" value={formData.customerId} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"><option value={0} disabled>Seçiniz...</option>{customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                         <div><label htmlFor="issueDate" className="block text-sm font-medium">Fatura Tarihi</label><input type="date" name="issueDate" id="issueDate" value={formData.issueDate} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" /></div>
                         <div><label htmlFor="dueDate" className="block text-sm font-medium">Vade Tarihi</label><input type="date" name="dueDate" id="dueDate" value={formData.dueDate} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" /></div>
                         <div><label htmlFor="status" className="block text-sm font-medium">Durum</label><select name="status" id="status" value={formData.status} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">{Object.values(InvoiceStatus).map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                    </div>
                    
                    {/* Line Items */}
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

                    {/* Footer with totals */}
                     <div className="flex justify-between items-start border-t pt-4 dark:border-dark-border">
                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium">Notlar</label>
                            <textarea name="notes" id="notes" value={formData.notes} onChange={handleInputChange} rows={3} className="mt-1 p-2 w-full max-w-sm border rounded-md dark:bg-slate-700 dark:border-dark-border"></textarea>
                        </div>
                        <div className="w-64 space-y-2 text-sm">
                            <div className="flex justify-between"><span>Ara Toplam:</span> <span className="font-mono">${subTotal.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>İndirim:</span> <span className="font-mono">-${totalDiscount.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Vergi (KDV):</span> <span className="font-mono">${totalTax.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t dark:border-slate-600"><span>Genel Toplam:</span> <span className="font-mono">${grandTotal.toFixed(2)}</span></div>
                        </div>
                     </div>

                    <div className="flex justify-end pt-4 gap-2">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>İptal</Button>
                        <Button type="submit">{editingInvoice ? "Güncelle" : "Oluştur"}</Button>
                    </div>
                </form>
            </Modal>}

            {canManageInvoices && <ConfirmationModal 
                isOpen={!!invoiceToDelete}
                onClose={() => setInvoiceToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Faturayı Sil"
                message={`'${invoiceToDelete?.invoiceNumber}' numaralı faturayı kalıcı olarak silmek istediğinizden emin misiniz?`}
            />}
        </>
    );
};

export default Invoices;
