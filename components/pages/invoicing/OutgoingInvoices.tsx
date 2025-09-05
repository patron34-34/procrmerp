import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Invoice, InvoiceStatus } from '../../../types';
import GenericInvoiceList from '../../invoicing/GenericInvoiceList';
import ConfirmationModal from '../../ui/ConfirmationModal';
import InvoicePreviewModal from '../../invoicing/InvoicePreviewModal';
import Card from '../../ui/Card';
import { Link } from 'react-router-dom';
import Button from '../../ui/Button';

const OutgoingInvoices: React.FC = () => {
    const { invoices, deleteInvoice, bulkUpdateInvoiceStatus } = useApp();
    const [invoiceToPreview, setInvoiceToPreview] = useState<Invoice | null>(null);
    const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
    
    const outgoingInvoices = useMemo(() => 
        invoices.filter(inv => inv.status !== InvoiceStatus.Draft && inv.status !== InvoiceStatus.Archived), 
        [invoices]
    );

    const stats = useMemo(() => {
        const unpaidAmount = outgoingInvoices
            .filter(inv => inv.status === InvoiceStatus.Sent || inv.status === InvoiceStatus.Overdue)
            .reduce((sum, inv) => sum + inv.grandTotal, 0);

        const overdueCount = outgoingInvoices.filter(inv => inv.status === InvoiceStatus.Overdue).length;

        return { unpaidAmount, overdueCount };
    }, [outgoingInvoices]);

    const handleDeleteConfirm = () => {
        if (invoiceToDelete) {
            deleteInvoice(invoiceToDelete.id);
            setInvoiceToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <h4 className="text-text-secondary">Ödenmemiş Tutar</h4>
                    <p className="text-3xl font-bold text-orange-500">${stats.unpaidAmount.toLocaleString()}</p>
                </Card>
                <Card>
                    <h4 className="text-text-secondary">Gecikmiş Faturalar</h4>
                    <p className="text-3xl font-bold text-red-500">{stats.overdueCount}</p>
                </Card>
            </div>
            <Card>
                <GenericInvoiceList
                    title="Giden Faturalar"
                    items={outgoingInvoices}
                    type="invoice"
                    statusFilterOptions={[InvoiceStatus.Sent, InvoiceStatus.Paid, InvoiceStatus.Overdue, InvoiceStatus.Archived]}
                    onPreview={(item) => setInvoiceToPreview(item as Invoice)}
                    onDelete={(item) => setInvoiceToDelete(item as Invoice)}
                    onBulkUpdateStatus={bulkUpdateInvoiceStatus}
                    emptyStateTitle="Giden Fatura Bulunamadı"
                    emptyStateDescription="Onaylanmış faturalarınız burada listelenir."
                    emptyStateAction={<Link to="/invoicing/new"><Button>Fatura Oluştur</Button></Link>}
                />
            </Card>
            
            {invoiceToPreview && (
                <InvoicePreviewModal 
                    isOpen={!!invoiceToPreview}
                    onClose={() => setInvoiceToPreview(null)}
                    invoice={invoiceToPreview}
                />
            )}
            
            <ConfirmationModal
                isOpen={!!invoiceToDelete}
                onClose={() => setInvoiceToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Faturayı Sil"
                message={`'${invoiceToDelete?.invoiceNumber}' numaralı faturayı kalıcı olarak silmek istediğinizden emin misiniz?`}
            />
        </div>
    );
};

export default OutgoingInvoices;