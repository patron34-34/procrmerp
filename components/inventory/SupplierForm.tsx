import React, { useState, useEffect, ReactNode } from 'react';
import { useApp } from '../../context/AppContext';
import { Supplier, Address } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import TagInput from '../ui/TagInput';
import { ICONS } from '../../constants';

interface SupplierFormProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
}

const AddressFields: React.FC<{ address: Address, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ address, onChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium">Sokak Adresi</label><input name="address.streetAddress" value={address.streetAddress} onChange={onChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
        <div><label className="block text-sm font-medium">İlçe</label><input name="address.district" value={address.district} onChange={onChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
        <div><label className="block text-sm font-medium">Şehir</label><input name="address.city" value={address.city} onChange={onChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
        <div><label className="block text-sm font-medium">Posta Kodu</label><input name="address.postalCode" value={address.postalCode} onChange={onChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
        <div><label className="block text-sm font-medium">Ülke</label><input name="address.country" value={address.country} onChange={onChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
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

const SupplierForm: React.FC<SupplierFormProps> = ({ isOpen, onClose, supplier }) => {
    const { addSupplier, updateSupplier } = useApp();
    
    const initialFormData: Omit<Supplier, 'id' | 'avatar'> = {
        name: '', email: '', phone: '',
        tags: [],
        accountType: 'Tüzel Kişi',
        accountCode: '',
        taxId: '',
        taxOffice: '',
        address: { country: 'Türkiye', city: '', district: '', streetAddress: '', postalCode: '', email: '', phone: '', phone2: '' },
        iban: '',
        iban2: '',
        openingBalance: 0,
        currency: 'TRY',
        openingDate: new Date().toISOString().split('T')[0],
        eInvoiceMailbox: '',
        eDispatchMailbox: '',
    };

    const [formData, setFormData] = useState<Omit<Supplier, 'id' | 'avatar'>>(initialFormData);
    const [errors, setErrors] = useState<{ name?: string, email?: string }>({});

    useEffect(() => {
        if (supplier) {
            const { id, avatar, ...supplierData } = supplier;
            setFormData({ ...initialFormData, ...supplierData });
        } else {
            setFormData(initialFormData);
        }
        setErrors({});
    }, [supplier, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (name.includes('.')) {
            const [objectName, fieldName] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [objectName]: { ...(prev as any)[objectName], [fieldName]: value }
            }));
        } else {
            const isNumeric = ['openingBalance'].includes(name);
            setFormData(prev => ({ ...prev, [name]: isNumeric ? Number(value) || undefined : value as any }));
        }
    };
    
    const handleTagsChange = (newTags: string[]) => {
        setFormData(prev => ({ ...prev, tags: newTags }));
    };
    
    const validate = (): boolean => {
        const newErrors: { name?: string, email?: string } = {};
        if (!formData.name.trim()) newErrors.name = "Tedarikçi adı zorunludur.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Geçerli bir e-posta adresi girin.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent, saveAndNew = false) => {
        e.preventDefault();
        if (validate()) {
            if (supplier) {
                updateSupplier({ ...supplier, ...formData });
                onClose();
            } else {
                addSupplier(formData);
                if (saveAndNew) {
                    setFormData(initialFormData);
                } else {
                    onClose();
                }
            }
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={supplier ? "Tedarikçiyi Düzenle" : "Yeni Tedarikçi Ekle"} size="3xl">
            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                <div className="max-h-[70vh] overflow-y-auto pr-4">
                    <AccordionSection title="Temel Bilgiler">
                        <div className="grid grid-cols-2 gap-4">
                            <div><label>Tedarikçi Adı (Şirket/Kişi) *</label><input name="name" value={formData.name} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>{errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}</div>
                            <div><label>Cari Kodu</label><input name="accountCode" value={formData.accountCode} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
                            <div><label>E-posta *</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>{errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}</div>
                            <div><label>Telefon</label><input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
                            <div><label>Cari Tipi</label><select name="accountType" value={formData.accountType} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"><option value="Tüzel Kişi">Tüzel Kişi</option><option value="Gerçek Kişi">Gerçek Kişi</option></select></div>
                        </div>
                    </AccordionSection>
                    
                    <AccordionSection title="Adres Bilgileri">
                        <AddressFields address={formData.address} onChange={handleInputChange} />
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
                        </div>
                        <TagInput tags={formData.tags} setTags={handleTagsChange} label="Etiketler" />
                    </AccordionSection>
                </div>
                <div className="flex justify-end pt-4 gap-2 border-t dark:border-dark-border">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    {!supplier && (
                        <Button type="button" variant="secondary" onClick={(e) => handleSubmit(e, true)}>
                            <span className="flex items-center gap-2">{ICONS.saveAndNew} Kaydet ve Yeni</span>
                        </Button>
                    )}
                    <Button type="submit">
                        <span className="flex items-center gap-2">{ICONS.save} Kaydet</span>
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default SupplierForm;
