
import React, { useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Bill, BillStatus } from '../../../types';
import GenericInvoiceList from '../../invoicing/GenericInvoiceList';
import Card from '../../ui/Card';
import { useNotification } from '../../../context/NotificationContext';


const IncomingInvoiceArchive: React.FC = () => {
    const { bills, bulkUpdateBillStatus } = useApp();
    const { addToast } = useNotification();
    
    const archivedBills = useMemo(() => 
        bills.filter(b => b.status === BillStatus.Archived), 
        [bills]
    );
    
    return (
        <Card>
            <GenericInvoiceList
                title="Gelen Fatura Arşivi"
                items={archivedBills}
                type="bill"
                statusFilterOptions={[BillStatus.Approved, BillStatus.Paid]}
                onPreview={(item) => addToast(`Önizleme henüz uygulanmadı: ${'billNumber' in item ? item.billNumber : ''}`, 'info')}
                onDelete={() => addToast('Arşivden silme işlemi henüz uygulanmadı.', 'info')} // No delete from archive
                onBulkUpdateStatus={bulkUpdateBillStatus}
                emptyStateTitle="Arşivlenmiş Gider Faturası Yok"
                emptyStateDescription="Arşivlediğiniz gelen faturalarınız (giderler) burada listelenir."
            />
        </Card>
    );
};

export default IncomingInvoiceArchive;
