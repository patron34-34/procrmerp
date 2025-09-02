import React from 'react';
import { useApp } from '../../../context/AppContext';
import { InvoiceStatus } from '../../../types';
import GenericInvoiceList from '../../invoicing/GenericInvoiceList';

const OutgoingInvoiceArchive: React.FC = () => {
    const { invoices, customers, bulkUpdateInvoiceStatus } = useApp();

    const archivedInvoices = invoices.filter(inv => inv.status === InvoiceStatus.Archived);

    const handleUnarchive = (selectedIds: number[]) => {
        bulkUpdateInvoiceStatus(selectedIds, InvoiceStatus.Sent);
    };

    return (
        <GenericInvoiceList
            title="Giden Fatura Arşivi"
            invoices={archivedInvoices}
            entities={customers}
            entityType="customer"
            entityLabel="Müşteri"
            showSelectAll={true}
            bulkActions={[
                { label: 'Arşivden Çıkar', handler: handleUnarchive }
            ]}
        />
    );
};

export default OutgoingInvoiceArchive;