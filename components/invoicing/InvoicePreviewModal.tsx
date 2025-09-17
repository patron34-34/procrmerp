
import React from 'react';
import { Invoice } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import InvoicePreview from './InvoicePreview';
import { ICONS } from '../../constants';

interface InvoicePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoice: Invoice | null;
}

const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({ isOpen, onClose, invoice }) => {
    
    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPdf = () => {
        alert('PDF indirme simülasyonu.');
    };
    
    if (!isOpen || !invoice) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Fatura Önizleme: ${invoice.invoiceNumber || 'TASLAK'}`} size="4xl">
            <div className="max-h-[70vh] overflow-y-auto bg-slate-200 dark:bg-slate-800 p-4 no-print">
                 <div className="w-[210mm] min-h-[297mm] mx-auto">
                    <InvoicePreview invoice={invoice} />
                 </div>
            </div>

            <div className="flex justify-end pt-4 gap-2 mt-4 border-t dark:border-dark-border no-print">
                <Button type="button" variant="secondary" onClick={onClose}>Kapat</Button>
                <Button type="button" variant="secondary" onClick={handleDownloadPdf}>
                    <span className="flex items-center gap-2">{ICONS.export} PDF Olarak İndir</span>
                </Button>
                <Button type="button" onClick={handlePrint}>
                     <span className="flex items-center gap-2">{ICONS.print} Yazdır</span>
                </Button>
            </div>
        </Modal>
    );
};
export default InvoicePreviewModal;
