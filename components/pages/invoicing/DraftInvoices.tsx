import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Invoice, InvoiceStatus } from '../../../types';
import GenericInvoiceList from '../../invoicing/GenericInvoiceList';
import ConfirmationModal from '../../ui/ConfirmationModal';
import InvoicePreviewModal from '../../invoicing/InvoicePreviewModal';
import Card from '../../ui/Card';
import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button';

const DraftInvoices: React.FC = () => {
    const { invoices, deleteInvoice, bulkUpdateInvoiceStatus } = useApp();
    const navigate = useNavigate();
    const [invoiceToPreview, setInvoiceToPreview] = useState<Invoice | null>(null);
    const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
    
    const draftInvoices = useMemo(() => 
        invoices.filter(inv => inv.status === InvoiceStatus.Draft), 
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
                title="Taslak Faturalar"
                items={draftInvoices}
                type="invoice"
                statusFilterOptions={[InvoiceStatus.Sent, InvoiceStatus.Archived]}
                onPreview={(item) => setInvoiceToPreview(item as Invoice)}
                onDelete={(item) => setInvoiceToDelete(item as Invoice)}
                onBulkUpdateStatus={bulkUpdateInvoiceStatus}
                emptyStateTitle="Taslak Fatura Bulunamadı"
                emptyStateDescription="Oluşturduğunuz ama henüz onaylamadığınız faturalar burada listelenir."
                emptyStateAction={<Button onClick={() => navigate('/invoicing/new')}>Yeni Fatura Oluştur</Button>}
            />
            
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
                message={`'${invoiceToDelete?.invoiceNumber || 'Taslak'}' numaralı faturayı kalıcı olarak silmek istediğinizden emin misiniz?`}
            />
        </Card>
    );
};

export default DraftInvoices;