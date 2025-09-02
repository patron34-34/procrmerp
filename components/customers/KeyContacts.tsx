import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Contact } from '../../types';
import Button from '../ui/Button';
import ContactFormModal from './ContactFormModal';
import ConfirmationModal from '../ui/ConfirmationModal';
import { ICONS } from '../../constants';

interface KeyContactsProps {
    customerId: number;
}

const KeyContacts: React.FC<KeyContactsProps> = ({ customerId }) => {
    const { contacts, hasPermission, deleteContact } = useApp();
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
    const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

    const canManageCustomers = hasPermission('musteri:yonet');

    const customerContacts = useMemo(() => contacts.filter(c => c.customerId === customerId), [contacts, customerId]);

    const handleAddContact = () => {
        setContactToEdit(null);
        setIsContactModalOpen(true);
    };

    const handleEditContact = (contact: Contact) => {
        setContactToEdit(contact);
        setIsContactModalOpen(true);
    };

    const handleDeleteContactConfirm = () => {
        if(contactToDelete && canManageCustomers) {
            deleteContact(contactToDelete.id);
            setContactToDelete(null);
        }
    }

    return (
        <>
            <div className="space-y-4">
                {customerContacts.length > 0 ? customerContacts.map(contact => (
                    <div key={contact.id} className="mb-4 pb-4 border-b last:border-0 last:pb-0 last:mb-0 dark:border-dark-border">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold">{contact.name}</p>
                                <p className="text-sm text-text-secondary">{contact.title}</p>
                            </div>
                            {canManageCustomers && (
                                <div className="flex gap-2">
                                    <button onClick={() => handleEditContact(contact)} className="text-slate-400 hover:text-primary-500">{ICONS.edit}</button>
                                    <button onClick={() => setContactToDelete(contact)} className="text-slate-400 hover:text-red-500">{ICONS.trash}</button>
                                </div>
                            )}
                        </div>
                        <p className="text-sm mt-2">{contact.email}</p>
                        <p className="text-sm">{contact.phone}</p>
                    </div>
                )) : <p className="text-sm text-text-secondary">Henüz kişi eklenmemiş.</p>}
                
                {canManageCustomers && <Button size="sm" onClick={handleAddContact} variant="secondary" className="w-full justify-center">Yeni Kişi Ekle</Button>}
            </div>

            <ContactFormModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                customerId={customerId}
                contact={contactToEdit}
            />

            <ConfirmationModal
                isOpen={!!contactToDelete}
                onClose={() => setContactToDelete(null)}
                onConfirm={handleDeleteContactConfirm}
                title="Kişiyi Sil"
                message={`'${contactToDelete?.name}' adlı kişiyi kalıcı olarak silmek istediğinizden emin misiniz?`}
            />
        </>
    );
};

export default KeyContacts;