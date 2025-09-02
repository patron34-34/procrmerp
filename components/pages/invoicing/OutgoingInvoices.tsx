import React, { useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { InvoiceStatus } from '../../../types';
import GenericInvoiceList from '../../invoicing/GenericInvoiceList';
import Card from '../../ui/Card';

const OutgoingInvoices: React.FC = () => {
    const { invoices, customers, bulkUpdateInvoiceStatus } = useApp();

    const outgoingInvoices = invoices.filter(inv => 
        inv.status === InvoiceStatus.Sent || 
        inv.status === InvoiceStatus.Paid || 
        inv.status === InvoiceStatus.Overdue
    );
    
    const stats = useMemo(() => {
        const unpaidAmount = outgoingInvoices
            .filter(inv => inv.status === InvoiceStatus.Sent || inv.status === InvoiceStatus.Overdue)
            .reduce((sum, inv) => sum + inv.grandTotal, 0);

        const overdueCount = outgoingInvoices.filter(inv => inv.status === InvoiceStatus.Overdue).length;
        
        return { unpaidAmount, overdueCount };
    }, [outgoingInvoices]);


    const handleArchive = (selectedIds: number[]) => {
        bulkUpdateInvoiceStatus(selectedIds, InvoiceStatus.Archived);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <h4 className="text-text-secondary">Ödenmemiş Toplam Tutar</h4>
                    <p className="text-3xl font-bold text-orange-500">${stats.unpaidAmount.toLocaleString()}</p>
                </Card>
                <Card>
                    <h4 className="text-text-secondary">Vadesi Geçmiş Faturalar</h4>
                    <p className="text-3xl font-bold text-red-500">{stats.overdueCount}</p>
                </Card>
            </div>
            <GenericInvoiceList
                title="Giden Faturalar"
                invoices={outgoingInvoices}
                entities={customers}
                entityType="customer"
                entityLabel="Müşteri"
                showSelectAll={true}
                bulkActions={[
                    { label: 'Arşive Taşı', handler: handleArchive }
                ]}
            />
        </div>
    );
};

export default OutgoingInvoices;