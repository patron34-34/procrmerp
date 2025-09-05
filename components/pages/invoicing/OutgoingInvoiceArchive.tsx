import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Invoice, InvoiceStatus } from '../../../types';
import GenericInvoiceList from '../../invoicing/GenericInvoiceList';
import InvoicePreviewModal from '../../invoicing/InvoicePreviewModal';
import Card from '../../ui/Card';
import ConfirmationModal from '../../ui/ConfirmationModal';

const OutgoingInvoiceArchive: React.FC = () => {
    const { invoices, bulkUpdateInvoiceStatus, deleteInvoice } = useApp();
    const [invoiceToPreview, setInvoiceToPreview] = useState<Invoice | null>(null);
    const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
    
    const archivedInvoices = useMemo(() => 
        invoices.filter(inv => inv.status === InvoiceStatus.Archived), 
        [invoices]
    );

    const handleDeleteConfirm = () => {
        if (invoiceToDelete) {
            deleteInvoice(invoiceToDelete.id);
            setInvoiceToDelete(null);
        }
    };
    
    return (
        <Card>
            <GenericInvoiceList
                title="Giden Fatura Arşivi"
                items={archivedInvoices}
                type="invoice"
                statusFilterOptions={[InvoiceStatus.Sent, InvoiceStatus.Paid, InvoiceStatus.Draft]}
                onPreview={(item) => setInvoiceToPreview(item as Invoice)}
                onDelete={(item) => setInvoiceToDelete(item as Invoice)}
                onBulkUpdateStatus={bulkUpdateInvoiceStatus}
                emptyStateTitle="Arşivlenmiş Fatura Yok"
                emptyStateDescription="Arşivlediğiniz giden faturalarınız burada listelenir."
            />
            
            {invoiceToPreview && (
                <InvoicePreviewModal 
                    isOpen={!!invoiceToPreview}
                    onClose={() => setInvoiceToPreview(null)}
                    invoice={invoiceToPreview}
                />
            )}
             {/* Note: Delete from archive might not be a standard feature, but implemented for completeness */}
             <ConfirmationModal
                isOpen={!!invoiceToDelete}
                onClose={() => setInvoiceToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Faturayı Kalıcı Olarak Sil"
                message={`'${invoiceToDelete?.invoiceNumber}' numaralı faturayı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
            />
        </Card>
    );
};

export default OutgoingInvoiceArchive;