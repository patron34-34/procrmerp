import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Bill, BillStatus } from '../../../types';
import GenericInvoiceList from '../../invoicing/GenericInvoiceList';
import ConfirmationModal from '../../ui/ConfirmationModal';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useNotification } from '../../../context/NotificationContext';

const Bills: React.FC = () => {
    const { bills, bulkUpdateBillStatus } = useApp();
    const { addToast } = useNotification();
    const [billToDelete, setBillToDelete] = useState<Bill | null>(null);
    
    const activeBills = useMemo(() => 
        bills.filter(b => b.status !== BillStatus.Archived), 
        [bills]
    );

    // Dummy delete for now as there's no deleteBill in context
    const handleDeleteConfirm = () => {
        if (billToDelete) {
            addToast(`Fatura silme işlemi henüz uygulanmadı: ${billToDelete.billNumber}`, 'info');
            setBillToDelete(null);
        }
    };

    return (
        <Card>
            <GenericInvoiceList
                title="Gelen Faturalar (Giderler)"
                items={activeBills}
                type="bill"
                statusFilterOptions={[BillStatus.Approved, BillStatus.Paid, BillStatus.Rejected, BillStatus.Archived]}
                onPreview={(item) => addToast(`Önizleme henüz uygulanmadı: ${'billNumber' in item ? item.billNumber : ''}`, 'info')}
                onDelete={(item) => setBillToDelete(item as Bill)}
                onBulkUpdateStatus={bulkUpdateBillStatus}
                emptyStateTitle="Gider Faturası Bulunamadı"
                emptyStateDescription="Tedarikçilerinizden gelen faturalar burada listelenir."
            />
            
            <ConfirmationModal
                isOpen={!!billToDelete}
                onClose={() => setBillToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Gider Faturası Sil"
                message={`'${billToDelete?.billNumber}' numaralı faturayı kalıcı olarak silmek istediğinizden emin misiniz?`}
            />
        </Card>
    );
};

export default Bills;