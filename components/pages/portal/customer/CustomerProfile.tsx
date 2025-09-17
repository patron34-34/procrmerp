import React, { useMemo, useState, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { useNotification } from '../../../../context/NotificationContext';
import Card from '../../../ui/Card';
import Button from '../../../ui/Button';
import { Customer, Contact, Address } from '../../../../types';
import FeedbackCard from './FeedbackCard';

// Reusable InputField component
const InputField: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary">{label}</label>
        <input {...props} className="mt-1 w-full" />
    </div>
);

// Reusable InfoRow component for view mode
const InfoRow: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
        <dt className="text-text-secondary">{label}</dt>
        <dd className="col-span-2 text-text-main font-medium">{value || '-'}</dd>
    </div>
);

// Address form component for edit mode
const AddressFields: React.FC<{
    address: Address;
    type: 'billing' | 'shipping';
    onChange: (type: 'billing' | 'shipping', field: keyof Address, value: string) => void;
}> = ({ address, type, onChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Sokak Adresi" value={address.streetAddress} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(type, 'streetAddress', e.target.value)} />
        <InputField label="İlçe" value={address.district} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(type, 'district', e.target.value)} />
        <InputField label="Şehir" value={address.city} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(type, 'city', e.target.value)} />
        <InputField label="Posta Kodu" value={address.postalCode} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(type, 'postalCode', e.target.value)} />
        <InputField label="Ülke" value={address.country} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(type, 'country', e.target.value)} />
    </div>
);


const CustomerProfile: React.FC = () => {
    const { currentUser, customers, contacts, updateCustomer, updateContact } = useApp();
    const { addToast } = useNotification();
    const [isEditing, setIsEditing] = useState(false);
    const [customerForm, setCustomerForm] = useState<Customer | null>(null);
    const [contactForm, setContactForm] = useState<Contact | null>(null);

    const { customer, contact } = useMemo(() => {
        const currentContact = contacts.find(c => c.id === currentUser.contactId);
        if (!currentContact) return { customer: null, contact: null };
        const currentCustomer = customers.find(c => c.id === currentContact.customerId);
        return { customer: currentCustomer || null, contact: currentContact };
    }, [currentUser, customers, contacts]);
    
    useEffect(() => {
        if (customer && contact) {
            // Deep copy to avoid direct state mutation
            setCustomerForm(JSON.parse(JSON.stringify(customer)));
            setContactForm(JSON.parse(JSON.stringify(contact)));
        }
    }, [customer, contact]);

    if (!customer || !contact) {
        return <Card title="Hata"><p>Profil bilgileri bulunamadı.</p></Card>;
    }
    
    if (!customerForm || !contactForm) {
        return <Card title="Yükleniyor..."><p>Profil bilgileri yükleniyor...</p></Card>;
    }
    
    const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomerForm(prev => prev ? { ...prev, [name]: value } : null);
    };
    
     const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setContactForm(prev => prev ? { ...prev, [name]: value } : null);
    };
    
    const handleAddressChange = (type: 'billing' | 'shipping', field: keyof Address, value: string) => {
        setCustomerForm(prev => {
            if (!prev) return null;
            return {
                ...prev,
                [`${type}Address`]: {
                    ...prev[`${type}Address`],
                    [field]: value
                }
            };
        });
    };
    
    const copyBillingToShipping = () => {
        setCustomerForm(prev => {
            if (!prev) return null;
            return {
                ...prev,
                shippingAddress: { ...prev.billingAddress }
            };
        });
    };

    const handleSave = () => {
        if (customerForm && contactForm) {
            updateCustomer(customerForm);
            updateContact(contactForm);
            addToast('Profil bilgileri başarıyla güncellendi.', 'success');
            setIsEditing(false);
        }
    };
    
    const handleCancel = () => {
        // Reset form data to original state
        setCustomerForm(JSON.parse(JSON.stringify(customer)));
        setContactForm(JSON.parse(JSON.stringify(contact)));
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            <Card 
                title="Profilim" 
                action={
                    !isEditing ? (
                        <Button onClick={() => setIsEditing(true)}>Düzenle</Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={handleCancel}>İptal</Button>
                            <Button onClick={handleSave}>Kaydet</Button>
                        </div>
                    )
                }
            >
                {isEditing ? (
                    <div className="space-y-6">
                        <Card title="İletişim Bilgilerim">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Ad Soyad" name="name" value={contactForm.name} onChange={handleContactChange} />
                                <InputField label="Unvan" name="title" value={contactForm.title} onChange={handleContactChange} />
                                <InputField label="E-posta" name="email" type="email" value={contactForm.email} onChange={handleContactChange} />
                                <InputField label="Telefon" name="phone" value={contactForm.phone} onChange={handleContactChange} />
                            </div>
                        </Card>
                        <Card title="Şirket Bilgileri">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Şirket Adı" name="name" value={customerForm.name} onChange={handleCustomerChange} />
                                <InputField label="Şirket Telefonu" name="phone" value={customerForm.phone} onChange={handleCustomerChange} />
                                <InputField label="Şirket E-postası" name="email" type="email" value={customerForm.email} onChange={handleCustomerChange} />
                                <InputField label="Vergi Dairesi" name="taxOffice" value={customerForm.taxOffice} onChange={handleCustomerChange} />
                                <InputField label="VKN/TCKN" name="taxId" value={customerForm.taxId} onChange={handleCustomerChange} />
                            </div>
                        </Card>
                         <Card title="Fatura Adresi">
                           <AddressFields address={customerForm.billingAddress} type="billing" onChange={handleAddressChange} />
                        </Card>
                        <Card title="Teslimat Adresi">
                           <Button variant="secondary" size="sm" className="mb-4" onClick={copyBillingToShipping}>Fatura Adresini Kopyala</Button>
                           <AddressFields address={customerForm.shippingAddress} type="shipping" onChange={handleAddressChange} />
                        </Card>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <Card title="İletişim Bilgilerim">
                            <dl>
                                <InfoRow label="Ad Soyad" value={contact.name} />
                                <InfoRow label="Unvan" value={contact.title} />
                                <InfoRow label="E-posta" value={contact.email} />
                                <InfoRow label="Telefon" value={contact.phone} />
                            </dl>
                        </Card>
                        <Card title="Şirket Bilgileri">
                             <dl>
                                <InfoRow label="Şirket Adı" value={customer.name} />
                                <InfoRow label="Telefon" value={customer.phone} />
                                <InfoRow label="E-posta" value={customer.email} />
                                <InfoRow label="Vergi Dairesi" value={customer.taxOffice} />
                                <InfoRow label="VKN/TCKN" value={customer.taxId} />
                            </dl>
                        </Card>
                         <Card title="Adres Bilgileri">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                <div>
                                    <h4 className="font-semibold mb-2">Fatura Adresi</h4>
                                    <address className="not-italic">
                                        {customer.billingAddress.streetAddress}<br/>
                                        {customer.billingAddress.district}, {customer.billingAddress.city}<br/>
                                        {customer.billingAddress.postalCode} {customer.billingAddress.country}
                                    </address>
                                </div>
                                 <div>
                                    <h4 className="font-semibold mb-2">Teslimat Adresi</h4>
                                    <address className="not-italic">
                                        {customer.shippingAddress.streetAddress}<br/>
                                        {customer.shippingAddress.district}, {customer.shippingAddress.city}<br/>
                                        {customer.shippingAddress.postalCode} {customer.shippingAddress.country}
                                    </address>
                                </div>
                           </div>
                        </Card>
                    </div>
                )}
            </Card>
            <FeedbackCard />
        </div>
    );
};

export default CustomerProfile;
