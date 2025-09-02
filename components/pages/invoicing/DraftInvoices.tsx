import React, { useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { InvoiceStatus } from '../../../types';
import GenericInvoiceList from '../../invoicing/GenericInvoiceList';
import Card from '../../ui/Card';

const DraftInvoices: React.FC = () => {
    const { invoices, customers, bulkUpdateInvoiceStatus, deleteInvoice } = useApp();

    const draftInvoices = invoices.filter(inv => inv.status === InvoiceStatus.Draft);

    const stats = useMemo(() => {
        const draftCount = draftInvoices.length;
        const draftTotalAmount = draftInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
        return { draftCount, draftTotalAmount };
    }, [draftInvoices]);


    const handleApprove = (selectedIds: number[]) => {
        bulkUpdateInvoiceStatus(selectedIds, InvoiceStatus.Sent);
    };

    const handleDelete = (selectedIds: number[]) => {
        selectedIds.forEach(id => deleteInvoice(id));
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <h4 className="text-text-secondary">Taslak Sayısı</h4>
                    <p className="text-3xl font-bold">{stats.draftCount}</p>
                </Card>
                <Card>
                    <h4 className="text-text-secondary">Taslak Toplam Tutarı</h4>
                    <p className="text-3xl font-bold">${stats.draftTotalAmount.toLocaleString()}</p>
                </Card>
            </div>
            <GenericInvoiceList
                title="Taslak Faturalar"
                invoices={draftInvoices}
                entities={customers}
                entityType="customer"
                entityLabel="Müşteri"
                showSelectAll={true}
                bulkActions={[
                    { label: 'Onayla', handler: handleApprove, variant: 'primary' },
                    { label: 'Sil', handler: handleDelete, variant: 'danger' }
                ]}
            />
        </div>
    );
};

export default DraftInvoices;