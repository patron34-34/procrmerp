import React from 'react';
import { useApp } from '../../../context/AppContext';
import { BillStatus } from '../../../types';
import GenericInvoiceList from '../../invoicing/GenericInvoiceList';

const Bills: React.FC = () => {
    const { bills, suppliers, bulkUpdateBillStatus } = useApp();

    const activeBills = bills.filter(bill => bill.status !== BillStatus.Archived);

    const handleArchive = (selectedIds: number[]) => {
        bulkUpdateBillStatus(selectedIds, BillStatus.Archived);
    };

    return (
        <GenericInvoiceList
            title="Gelen Faturalar (Masraflar)"
            invoices={activeBills}
            entities={suppliers}
            entityType="supplier"
            entityLabel="Tedarikçi"
            showSelectAll={true}
            bulkActions={[
                { label: 'Arşive Taşı', handler: handleArchive }
            ]}
        />
    );
};

export default Bills;