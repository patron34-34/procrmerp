import React from 'react';
import { useApp } from '../../../context/AppContext';
import { BillStatus } from '../../../types';
import GenericInvoiceList from '../../invoicing/GenericInvoiceList';

const IncomingInvoiceArchive: React.FC = () => {
    const { bills, suppliers, bulkUpdateBillStatus } = useApp();

    const archivedBills = bills.filter(bill => bill.status === BillStatus.Archived);

    const handleUnarchive = (selectedIds: number[]) => {
        bulkUpdateBillStatus(selectedIds, BillStatus.Paid); 
    };

    return (
        <GenericInvoiceList
            title="Gelen Fatura Arşivi"
            invoices={archivedBills}
            entities={suppliers}
            entityType="supplier"
            entityLabel="Tedarikçi"
            showSelectAll={true}
            bulkActions={[
                { label: 'Arşivden Çıkar', handler: handleUnarchive }
            ]}
        />
    );
};

export default IncomingInvoiceArchive;