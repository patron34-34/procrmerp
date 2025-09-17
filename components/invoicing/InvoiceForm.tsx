
import React, { useState, useEffect, useMemo, useRef, ReactNode } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice, InvoiceStatus, InvoiceLineItem, Customer, EInvoiceProfile, EInvoiceScenario, InvoiceType, Product, Unit } from '../../types';
import Button from '../ui/Button';
import { ICONS, INVOICE_TYPE_OPTIONS, PAYMENT_METHODS, TEVKIFAT_KODLARI } from '../../constants';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import InvoiceItemModal from './InvoiceItemModal';
import { numberToWords } from '../../utils/numberToWords';
import Dropdown, { DropdownItem } from '../ui/Dropdown';
import Card from '../ui/Card';

const AccordionSection: React.FC<{ title: string, children: ReactNode }> = ({ title, children }) => (
    <details open className="border-b dark:border-dark-border last:border-b-0">
        <summary className="font-semibold text-lg py-3 cursor-pointer">
            {title}
        </summary>
        <div className="pt-2 pb-4">
            {children}
        </div>
    </details>
);


const InvoiceForm: React.FC = () => {
    const { customers, products, addInvoice, updateInvoice, invoices, deleteInvoice } = useApp();
    const { addToast } = useNotification();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const location = useLocation();

    const isEditMode = !!id;
    const existingInvoice = isEditMode ? invoices.find(inv => inv.id === parseInt(id, 10)) : null;

    const [activeTab, setActiveTab] = useState('genel');
    
    const today = new Date();
    const currentTime = today.toTimeString().slice(0, 5);
    const initialFormState: Omit<Invoice, 'id' | 'invoiceNumber' | 'customerName' | 'subTotal' | 'totalDiscount' | 'totalTax' | 'grandTotal' | 'totalWithholding' | 'amountInWords'> = {
        customerId: 0,
        issueDate: today.toISOString().split('T')[0],
        issueTime: currentTime,
        dueDate: today.toISOString().split('T')[0],
        status: InvoiceStatus.Draft,
        items: [],
        notes: '',
        customizationId: 'TR1.2',
        scenario: EInvoiceScenario.EArsiv,
        invoiceType: 'Satış',
        eInvoiceType: EInvoiceProfile.Temel,
        documentCurrency: 'TRY',
    };

    const [formData, setFormData] = useState<Partial<Invoice>>(initialFormState);
    const [customerSearch, setCustomerSearch] = useState('');
    const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
    const customerDropdownRef = useRef<HTMLDivElement>(null);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<{ item: InvoiceLineItem, index: number } | null>(null);

    const selectedCustomer = useMemo(() => customers.find(c => c.id === formData.customerId), [customers, formData.customerId]);
    const filteredCustomers = useMemo(() => customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || (c.taxId && c.taxId.includes(customerSearch))), [customers, customerSearch]);
    
    useEffect(() => {
        let initialState: any = { ...initialFormState };
        let initialCustomer: Customer | undefined;
        const prefilledCustomerId = location.state?.customerId;

        if (existingInvoice) {
            initialState = { ...initialState, ...existingInvoice, items: existingInvoice.items.map(item => ({ ...item })) };
            initialCustomer = customers.find(c => c.id === existingInvoice.customerId);
        } else if (prefilledCustomerId) {
            initialState.customerId = prefilledCustomerId;
            initialCustomer = customers.find(c => c.id === prefilledCustomerId);
            if (initialCustomer) {
                 initialState.scenario = initialCustomer.eInvoiceMailbox ? EInvoiceScenario.EFatura : EInvoiceScenario.EArsiv;
            }
        }

        setFormData(initialState);
        if (initialCustomer) {
            setCustomerSearch(`${initialCustomer.taxId || ''} - ${initialCustomer.name}`);
        } else {
            setCustomerSearch('');
        }
    }, [existingInvoice, customers, location.state]);
    
     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (customerDropdownRef.current && !customerDropdownRef.current.contains(event.target as Node)) setIsCustomerDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCustomerSelect = (customer: Customer) => {
        setFormData(prev => ({
            ...prev,
            customerId: customer.id,
            scenario: customer.eInvoiceMailbox ? EInvoiceScenario.EFatura : EInvoiceScenario.EArsiv,
        }));
        setCustomerSearch(`${customer.taxId} - ${customer.name}`);
        setIsCustomerDropdownOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value as any }));
    };
    
    const handleSaveItem = (item: InvoiceLineItem, index: number) => {
        const newItems = [...(formData.items || [])];
        if (index > -1) {
            newItems[index] = item;
        } else {
            newItems.push(item);
        }
        setFormData(prev => ({ ...prev, items: newItems }));
        setIsItemModalOpen(false);
        setEditingItem(null);
    };

    const handleEditItem = (index: number) => {
        if (!formData.items) return;
        setEditingItem({ item: formData.items[index], index });
        setIsItemModalOpen(true);
    };

    const handleNewItem = () => {
        const newItem: InvoiceLineItem = {
            id: Date.now(),
            productId: 0,
            productName: '',
            quantity: 1,
            unit: Unit.Adet,
            unitPrice: 0,
            discountRate: 0,
            discountAmount: 0,
            taxRate: 20,
            taxAmount: 0,
            totalPrice: 0,
            vatIncludedPrice: 0,
        };
        setEditingItem({ item: newItem, index: -1 });
        setIsItemModalOpen(true);
    };
    
    const removeItem = (index: number) => {
        setFormData(prev => ({...prev, items: (prev.items || []).filter((_, i) => i !== index)}));
    };
    
    const { subTotal, totalDiscount, totalTax, grandTotal, totalWithholding } = useMemo(() => {
        const items = formData.items || [];
        const subTotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const totalDiscount = items.reduce((sum, item) => sum + item.discountAmount, 0);
        const totalTax = items.reduce((sum, item) => sum + item.taxAmount, 0);
        const totalWithholding = items.reduce((sum, item) => {
             if (formData.invoiceType === 'Tevkifat' && item.withholdingCode) {
                const tevkifatInfo = TEVKIFAT_KODLARI.find(t => t.code === item.withholdingCode);
                if (tevkifatInfo) {
                    return sum + item.taxAmount * tevkifatInfo.rate;
                }
            }
            return sum;
        }, 0);
        const grandTotal = subTotal - totalDiscount + totalTax - totalWithholding;
        return { subTotal, totalDiscount, totalTax, grandTotal, totalWithholding };
    }, [formData.items, formData.invoiceType]);
    
    const handleSubmit = (status: InvoiceStatus) => {
        const finalData = { ...formData, status, subTotal, totalDiscount, totalTax, grandTotal, totalWithholding, amountInWords: numberToWords(grandTotal, formData.documentCurrency || 'TRY') };
        if (existingInvoice) {
            updateInvoice({ ...existingInvoice, ...finalData } as Invoice);
        } else {
            addInvoice(finalData as Omit<Invoice, 'id' | 'invoiceNumber' | 'customerName'>);
        }
        navigate('/invoicing/outgoing');
    };

    const handleDelete = () => {
        if (existingInvoice) {
            deleteInvoice(existingInvoice.id);
            navigate('/invoicing/outgoing');
        } else {
            addToast("Silinecek bir taslak bulunamadı.", "warning");
        }
    };

    const handlePrint = () => { addToast("Bu özellik henüz tamamlanmadı.", "info"); };
    const handleCopy = () => { addToast("Bu özellik henüz tamamlanmadı.", "info"); };

    const renderTabs = () => {
        const tabs = [
            { id: 'genel', label: 'Genel Bilgiler' },
            { id: 'kalemler', label: 'Mal/Hizmet & Toplamlar' },
        ];
        return (
             <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center gap-1 mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 text-center py-2 px-3 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-card ${
                            activeTab === tab.id
                                ? 'bg-white dark:bg-slate-900/70 text-primary-600 shadow-sm'
                                : 'text-text-secondary hover:bg-white/50 dark:hover:bg-slate-900/20'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        )
    };
    
    const renderContent = () => {
        switch(activeTab) {
            case 'genel':
                return (
                     <div className="space-y-1">
                        <AccordionSection title="Genel Fatura Bilgileri">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <InputField label="ETTN" name="uuid" value={formData.uuid || ''} readOnly />
                                <InputField label="Özelleştirme Numarası" name="customizationId" value={formData.customizationId || ''} onChange={handleInputChange} />
                                <InputField label="Fatura Numarası" name="invoiceNumber" value={formData.invoiceNumber || (isEditMode ? '' : 'Kaydedince otomatik atanacak')} readOnly />
                                <div className="flex gap-2">
                                    <div className="flex-grow"><label className="block text-sm font-medium">Fatura Tarihi</label><input type="date" name="issueDate" value={formData.issueDate} onChange={handleInputChange} className="mt-1 w-full" /></div>
                                    <div><label className="block text-sm font-medium">Saat</label><input type="time" name="issueTime" value={formData.issueTime} onChange={handleInputChange} className="mt-1 w-full"/></div>
                                </div>
                                <SelectField label="Senaryo Tipi" name="scenario" value={formData.scenario} onChange={handleInputChange} options={Object.values(EInvoiceScenario)} />
                                <InputField label="Fatura Şablonu" name="invoiceTemplate" value={formData.invoiceTemplate || ''} onChange={handleInputChange} />
                                <SelectField label="Fatura Tipi" name="invoiceType" value={formData.invoiceType} onChange={handleInputChange} options={INVOICE_TYPE_OPTIONS} />
                                <SelectField label="Doküman Para Birimi" name="documentCurrency" value={formData.documentCurrency} onChange={handleInputChange} options={['TRY', 'USD', 'EUR']} />
                                {formData.documentCurrency !== 'TRY' && <InputField label="Döviz Kuru" name="exchangeRate" type="number" step="0.0001" value={formData.exchangeRate || ''} onChange={handleInputChange} />}
                                <div className="flex items-end pb-2"><CheckboxField label="İhracat" name="isExport" checked={formData.isExport || false} onChange={handleInputChange} /></div>
                            </div>
                        </AccordionSection>
                        <AccordionSection title="Alıcı Bilgileri">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                <div>
                                    <div className="relative mb-2" ref={customerDropdownRef}>
                                        <label className="block text-sm font-medium">Alıcı - VKN/TCKN ile arama yapınız</label>
                                        <input type="text" value={customerSearch} onChange={(e) => { setCustomerSearch(e.target.value); setIsCustomerDropdownOpen(true); }} onFocus={() => setIsCustomerDropdownOpen(true)} className="mt-1 block w-full" />
                                        {isCustomerDropdownOpen && <ul className="absolute z-10 w-full bg-card dark:bg-dark-card border dark:border-dark-border rounded-md mt-1 max-h-48 overflow-y-auto">{filteredCustomers.map(c => <li key={c.id} onClick={() => handleCustomerSelect(c)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">{c.taxId} - {c.name}</li>)}</ul>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                       <InputField label="VKN / TCKN" value={selectedCustomer?.taxId || ''} readOnly />
                                        <InputField label="Adı" value={selectedCustomer?.name.split(' ')[0] || ''} readOnly />
                                        <InputField label="Soyadı" value={selectedCustomer?.name.split(' ').slice(1).join(' ') || ''} readOnly />
                                        <InputField label="Ticaret Sicil No" value="" readOnly />
                                        <InputField label="Vergi Dairesi" value={selectedCustomer?.taxOffice || ''} readOnly />
                                    </div>
                                </div>
                                <div>
                                    <div className="grid grid-cols-2 gap-4">
                                       <InputField label="Ülke" value={selectedCustomer?.billingAddress.country || ''} readOnly />
                                       <InputField label="Şehir" value={selectedCustomer?.billingAddress.city || ''} readOnly />
                                       <InputField label="Mahalle/İlçe" value={selectedCustomer?.billingAddress.district || ''} readOnly />
                                       <div className="col-span-2"><InputField label="Cadde/Sokak" value={selectedCustomer?.billingAddress.streetAddress || ''} readOnly /></div>
                                       <InputField label="Bina/Kapı No" value={''} readOnly />
                                       <InputField label="Tel" value={selectedCustomer?.phone || ''} readOnly />
                                       <InputField label="E-posta" value={selectedCustomer?.email || ''} readOnly />
                                    </div>
                                </div>
                             </div>
                        </AccordionSection>
                    </div>
                );
            case 'kalemler':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-3">
                             <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-lg">Mal/Hizmet Bilgileri</h3>
                                <Button type="button" onClick={handleNewItem}>{ICONS.add} Mal/Hizmet Ekle</Button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="border-b dark:border-dark-border"><tr className="text-sm">
                                        <th className="p-2">Mal/Hizmet</th><th className="p-2">Miktar</th><th className="p-2">B.Fiyat</th><th className="p-2">İsk.Tutar</th><th className="p-2">KDV Tutar</th><th className="p-2">Toplam</th><th></th>
                                    </tr></thead>
                                    <tbody>
                                        {formData.items?.map((item, index) => (
                                            <tr key={item.id} className="border-b dark:border-dark-border last:border-b-0">
                                                <td className="p-2">{item.productName}</td><td className="p-2">{item.quantity}</td><td className="p-2">{item.unitPrice.toFixed(2)}</td><td className="p-2">{item.discountAmount.toFixed(2)}</td><td className="p-2">{item.taxAmount.toFixed(2)}</td><td className="p-2 font-semibold">{item.vatIncludedPrice.toFixed(2)}</td>
                                                <td className="p-2"><button type="button" onClick={() => handleEditItem(index)}>{ICONS.edit}</button><button type="button" onClick={() => removeItem(index)}>{ICONS.trash}</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="lg:col-span-3 grid grid-cols-2 gap-8 border-t dark:border-dark-border pt-4 mt-4">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Notlar</h3>
                                <textarea name="notes" value={formData.notes || ''} onChange={handleInputChange} rows={4} className="w-full" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Toplam Bilgileri</h3>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between"><span>Ara Toplam:</span> <span className="font-mono">{subTotal.toFixed(2)} {formData.documentCurrency}</span></div>
                                    <div className="flex justify-between"><span>İndirim:</span> <span className="font-mono text-red-500">-{totalDiscount.toFixed(2)} {formData.documentCurrency}</span></div>
                                    <div className="flex justify-between"><span>Vergi (KDV):</span> <span className="font-mono">{totalTax.toFixed(2)} {formData.documentCurrency}</span></div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2 dark:border-slate-600"><span>Genel Toplam:</span> <span className="font-mono">{grandTotal.toFixed(2)} {formData.documentCurrency}</span></div>
                                    <div className="text-right text-text-secondary mt-1">Yalnız #{numberToWords(grandTotal, formData.documentCurrency || 'TRY')}#</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    }


    return (
        <div className="space-y-4">
             {/* Page Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link to="/invoicing/outgoing" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-text-secondary hover:text-text-main">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </Link>
                    <h1 className="text-2xl font-bold">
                        {isEditMode ? `Faturayı Düzenle: ${existingInvoice?.invoiceNumber || 'Taslak'}` : 'Yeni Fatura Oluştur'}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button type="button" variant="secondary" onClick={() => handleSubmit(InvoiceStatus.Draft)}>
                        Taslak Olarak Kaydet
                    </Button>
                    <Button type="button" variant="primary" onClick={() => handleSubmit(InvoiceStatus.Sent)}>
                        Kaydet ve Onayla
                    </Button>
                    <Dropdown
                        trigger={
                            <Button variant="secondary" className="!p-2">
                                {ICONS.ellipsisVertical}
                            </Button>
                        }
                    >
                        <DropdownItem onClick={handlePrint}><span className="w-5">{ICONS.print}</span> Yazdır</DropdownItem>
                        <DropdownItem onClick={handleCopy}><span className="w-5">{ICONS.copy}</span> Kopyala</DropdownItem>
                        {isEditMode && <DropdownItem onClick={handleDelete}><span className="w-5">{ICONS.trash}</span> Sil</DropdownItem>}
                    </Dropdown>
                </div>
            </div>

            <Card>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                    {renderTabs()}
                    <div>
                        {renderContent()}
                    </div>
                </form>
            </Card>

            {isItemModalOpen && (
                <InvoiceItemModal
                    isOpen={isItemModalOpen}
                    onClose={() => {setIsItemModalOpen(false); setEditingItem(null);}}
                    item={editingItem?.item || null}
                    onSave={(item) => handleSaveItem(item, editingItem?.index ?? -1)}
                    invoiceType={formData.invoiceType!}
                />
            )}
        </div>
    );
};

const InputField: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium">{label}</label>
        <input {...props} className="mt-1 w-full" />
    </div>
);

const SelectField: React.FC<any> = ({ label, options, ...props }) => (
    <div>
        <label className="block text-sm font-medium">{label}</label>
        <select {...props} className="mt-1 w-full">
            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

const CheckboxField: React.FC<any> = ({ label, ...props }) => (
    <label className="flex items-center gap-2">
        <input type="checkbox" {...props} />
        <span>{label}</span>
    </label>
);

export default InvoiceForm;
