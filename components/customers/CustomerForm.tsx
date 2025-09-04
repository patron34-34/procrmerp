import React, { useState, useEffect, ReactNode } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer, Address } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import TagInput from '../ui/TagInput';
import { ICONS } from '../../constants';

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

const AddressFields: React.FC<{ address: Address, type: 'billing' | 'shipping', onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ address, type, onChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium">Sokak Adresi</label><input name={`${type}Address.streetAddress`} value={address.streetAddress} onChange={onChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
        <div><label className="block text-sm font-medium">İlçe</label><input name={`${type}Address.district`} value={address.district} onChange={onChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
        <div><label className="block text-sm font-medium">Şehir</label><input name={`${type}Address.city`} value={address.city} onChange={onChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
        <div><label className="block text-sm font-medium">Posta Kodu</label><input name={`${type}Address.postalCode`} value={address.postalCode} onChange={onChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
        <div><label className="block text-sm font-medium">Ülke</label><input name={`${type}Address.country`} value={address.country} onChange={onChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
    </div>
);

const AccordionSection: React.FC<{ title: string, children: ReactNode }> = ({ title, children }) => (
    <details className="border-b dark:border-dark-border last:border-b-0" open>
        <summary className="font-semibold text-lg py-3 cursor-pointer">{title}</summary>
        <div className="pb-4 pt-2 space-y-4">
            {children}
        </div>
    </details>
);

const CustomerForm: React.FC<CustomerFormProps> = ({ isOpen, onClose, customer }) => {
    const { employees, api, systemLists, priceLists } = useApp();
    const [isLoading, setIsLoading] = useState(false);
    
    const initialFormData: Omit<Customer, 'id' | 'avatar' | 'healthScore' | 'customFields'> = {
        name: '', email: '', company: '', phone: '',
        status: (systemLists.customerStatus[0]?.id as Customer['status']) || 'potensiyel',
        lastContact: new Date().toISOString().split('T')[0],
        industry: '',
        tags: [],
        assignedToId: employees.find(e => e.role === 'Satış')?.id || employees[0]?.id || 0,
        leadSource: systemLists.leadSource[0]?.id || 'Website',
        priceListId: priceLists.find(p => p.isDefault)?.id,
        accountType: 'Tüzel Kişi',
        accountCode: '',
        taxId: '',
        taxOffice: '',
        billingAddress: { country: 'Türkiye', city: '', district: '', streetAddress: '', postalCode: '', email: '', phone: '', phone2: '' },
        shippingAddress: { country: 'Türkiye', city: '', district: '', streetAddress: '', postalCode: '', email: '', phone: '', phone2: '' },
        iban: '',
        iban2: '',
        openingBalance: 0,
        currency: 'TRY',
        openingDate: new Date().toISOString().split('T')[0],
        eInvoiceMailbox: '',
        eDispatchMailbox: '',
    };

    const [formData, setFormData] = useState<Omit<Customer, 'id' | 'avatar' | 'healthScore' | 'customFields'>>(initialFormData);
    const [errors, setErrors] = useState<{ name?: string, email?: string }>({});

    useEffect(() => {
        if (customer) {
            const { id, avatar, healthScore, customFields, ...customerData } = customer;
            setFormData({ ...initialFormData, ...customerData });
        } else {
            setFormData(initialFormData);
        }
        setErrors({});
    }, [customer, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (name.includes('.')) {
            const [objectName, fieldName] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [objectName]: { ...(prev as any)[objectName], [fieldName]: value }
            }));
        } else {
            const isNumeric = ['assignedToId', 'priceListId', 'openingBalance'].includes(name);
            setFormData(prev => ({ ...prev, [name]: isNumeric ? Number(value) || undefined : value as any }));
        }
    };
    
    const handleTagsChange = (newTags: string[]) => {
        setFormData(prev => ({ ...prev, tags: newTags }));
    };
    
    const copyBillingToShipping = () => {
        setFormData(prev => ({ ...prev, shippingAddress: { ...prev.billingAddress } }));
    };

    const validate = (): boolean => {
        const newErrors: { name?: string, email?: string } = {};
        if (!formData.name.trim()) newErrors.name = "Müşteri adı zorunludur.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Geçerli bir e-posta adresi girin.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent, saveAndNew = false) => {
        e.preventDefault();
        if (validate()) {
            setIsLoading(true);
            const customerData = { ...formData, company: formData.company || formData.name };
            if (customer) {
                await api.updateCustomer({ ...customer, ...customerData });
                onClose();
            } else {
                await api.addCustomer(customerData);
                if (saveAndNew) {
                    setFormData(initialFormData);
                } else {
                    onClose();
                }
            }
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={customer ? "Müşteriyi Düzenle" : "Yeni Müşteri Ekle"} size="3xl">
            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                <div className="max-h-[70vh] overflow-y-auto pr-4">
                    <AccordionSection title="Temel Bilgiler">
                        <div className="grid grid-cols-2 gap-4">
                            <div><label>Müşteri Adı (Şirket/Kişi) *</label><input name="name" value={formData.name} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>{errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}</div>
                            <div><label>Şirket Adı (Fatura için)</label><input name="company" value={formData.company} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
                            <div><label>E-posta *</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>{errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}</div>
                            <div><label>Telefon</label><input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
                            <div><label>Cari Tipi</label><select name="accountType" value={formData.accountType} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"><option value="Tüzel Kişi">Tüzel Kişi</option><option value="Gerçek Kişi">Gerçek Kişi</option></select></div>
                            <div><label>Cari Kodu</label><input name="accountCode" value={formData.accountCode} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
                            <div><label>Durum</label><select name="status" value={formData.status} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">{systemLists.customerStatus.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</select></div>
                             <div><label>Sektör</label><input name="industry" value={formData.industry} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
                        </div>
                    </AccordionSection>
                    
                    <AccordionSection title="Fatura Adresi">
                        <AddressFields address={formData.billingAddress} type="billing" onChange={handleInputChange} />
                    </AccordionSection>
                    
                    <AccordionSection title="Teslimat Adresi">
                        <div className="mb-2"><Button type="button" variant="secondary" onClick={copyBillingToShipping}>Fatura Adresini Kopyala</Button></div>
                        <AddressFields address={formData.shippingAddress} type="shipping" onChange={handleInputChange} />
                    </AccordionSection>
                    
                    <AccordionSection title="Finansal Bilgiler">
                         <div className="grid grid-cols-2 gap-4">
                            <div><label>Vergi Dairesi</label><input name="taxOffice" value={formData.taxOffice} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
                            <div><label>Vergi/TC Kimlik No</label><input name="taxId" value={formData.taxId} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
                            <div><label>IBAN</label><input name="iban" value={formData.iban} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
                            <div><label>IBAN 2</label><input name="iban2" value={formData.iban2 || ''} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
                            <div><label>Açılış Bakiyesi</label><input type="number" step="0.01" name="openingBalance" value={formData.openingBalance} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
                            <div><label>Para Birimi</label><select name="currency" value={formData.currency} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"><option value="TRY">TRY</option><option value="USD">USD</option><option value="EUR">EUR</option></select></div>
                            <div><label>Açılış Tarihi</label><input type="date" name="openingDate" value={formData.openingDate} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
                        </div>
                    </AccordionSection>

                    <AccordionSection title="Diğer Bilgiler">
                        <div className="grid grid-cols-2 gap-4">
                            <div><label>e-Fatura Posta Kutusu</label><input name="eInvoiceMailbox" value={formData.eInvoiceMailbox || ''} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
                            <div><label>e-İrsaliye Posta Kutusu</label><input name="eDispatchMailbox" value={formData.eDispatchMailbox || ''} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
                            <div><label>Sorumlu</label><select name="assignedToId" value={formData.assignedToId} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">{employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select></div>
                            <div><label>Kaynak</label><select name="leadSource" value={formData.leadSource} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">{systemLists.leadSource.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</select></div>
                        </div>
                        <TagInput tags={formData.tags} setTags={handleTagsChange} label="Etiketler" />
                    </AccordionSection>
                </div>
                <div className="flex justify-end pt-4 gap-2 border-t dark:border-dark-border">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>İptal</Button>
                    {!customer && (
                        <Button type="button" variant="secondary" onClick={(e) => handleSubmit(e, true)} disabled={isLoading}>
                             <span className="flex items-center gap-2">{isLoading ? <div className="spinner !w-4 !h-4"></div> : ICONS.saveAndNew} Kaydet ve Yeni</span>
                        </Button>
                    )}
                    <Button type="submit" disabled={isLoading}>
                        <span className="flex items-center gap-2">{isLoading ? <div className="spinner !w-4 !h-4"></div> : ICONS.save} Kaydet</span>
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CustomerForm;