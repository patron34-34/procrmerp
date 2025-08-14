

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Contact } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: number;
  contact: Contact | null;
}

const ContactFormModal: React.FC<ContactFormModalProps> = ({ isOpen, onClose, customerId, contact }) => {
    const { addContact, updateContact } = useApp();
    
    const initialFormData: Omit<Contact, 'id' | 'customerId'> = {
        name: '',
        title: '',
        email: '',
        phone: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    
    useEffect(() => {
        if (contact) {
            setFormData({
                name: contact.name,
                title: contact.title,
                email: contact.email,
                phone: contact.phone,
            });
        } else {
            setFormData(initialFormData);
        }
    }, [contact, isOpen]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.email) {
            if (contact) {
                updateContact({ ...contact, ...formData });
            } else {
                addContact({ ...formData, customerId });
            }
            onClose();
        } else {
            alert("Lütfen isim ve e-posta alanlarını doldurun.");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={contact ? "Kişiyi Düzenle" : "Yeni Kişi Ekle"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">İsim Soyisim *</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                    </div>
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Unvan</label>
                        <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                    </div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">E-posta *</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Telefon</label>
                        <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                    </div>
                </div>
                <div className="flex justify-end pt-4 gap-2">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit">Kaydet</Button>
                </div>
            </form>
        </Modal>
    );
};

export default ContactFormModal;