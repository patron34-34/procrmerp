import React from 'react';
import { useApp } from '../../context/AppContext';
import CustomerForm from './CustomerForm';

const CustomerFormModal: React.FC = () => {
    const { isCustomerFormOpen, setIsCustomerFormOpen, editingCustomer } = useApp();

    if (!isCustomerFormOpen) {
        return null;
    }

    return (
        <CustomerForm
            isOpen={isCustomerFormOpen}
            onClose={() => setIsCustomerFormOpen(false, null)}
            customer={editingCustomer}
            onSubmitSuccess={() => {
                setIsCustomerFormOpen(false, null);
            }}
        />
    );
};

export default CustomerFormModal;