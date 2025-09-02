import React from 'react';
import { Invoice, Bill } from '../../types';
import InvoicePreview from './InvoicePreview';

interface PrintableInvoiceListProps {
    invoices: (Invoice | Bill)[];
}

const PrintableInvoiceList: React.FC<PrintableInvoiceListProps> = ({ invoices }) => {
    return (
        <div className="printable-area">
            {invoices.map((invoice) => (
                <div key={invoice.id} className="page-break-container">
                    {'invoiceNumber' in invoice && <InvoicePreview invoice={invoice as Invoice} />}
                </div>
            ))}
        </div>
    );
};

export default PrintableInvoiceList;