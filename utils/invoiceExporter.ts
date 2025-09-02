import { Invoice, Bill, InvoiceLineItem, Supplier, Customer, InvoiceStatus, BillStatus } from '../types';
import { exportToCSV as generalExportToCSV } from './csvExporter';

const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

type CsvExportRow = {
    'FaturaNo': string;
    'Musteri/Tedarikci': string;
    'FaturaTarihi': string;
    'VadeTarihi': string;
    'Durum': InvoiceStatus | BillStatus;
    'UrunAdi'?: string;
    'Miktar'?: number;
    'BirimFiyat'?: number;
    'IskontoOrani'?: number;
    'KDVOrani'?: number;
    'ToplamTutar': number;
    'ParaBirimi': string;
};

export const exportInvoicesToCSV = (invoices: (Invoice | Bill)[], entities: (Customer | Supplier)[]) => {
    const dataToExport: CsvExportRow[] = invoices.flatMap((inv): CsvExportRow[] => {
        if ('supplierId' in inv) {
            const bill = inv as Bill;
            return [{
                'FaturaNo': bill.billNumber,
                'Musteri/Tedarikci': bill.supplierName,
                'FaturaTarihi': bill.issueDate,
                'VadeTarihi': bill.dueDate,
                'Durum': bill.status,
                'ToplamTutar': bill.totalAmount,
                'ParaBirimi': 'TRY' // Assuming bills are in TRY, adjust if necessary
            }];
        } else {
            const invoice = inv as Invoice;
            if (invoice.items && invoice.items.length > 0) {
                return invoice.items.map(item => ({
                    'FaturaNo': invoice.invoiceNumber,
                    'Musteri/Tedarikci': invoice.customerName,
                    'FaturaTarihi': invoice.issueDate,
                    'VadeTarihi': invoice.dueDate,
                    'Durum': invoice.status,
                    'UrunAdi': item.productName,
                    'Miktar': item.quantity,
                    'BirimFiyat': item.unitPrice,
                    'IskontoOrani': item.discountRate,
                    'KDVOrani': item.taxRate,
                    'ToplamTutar': item.vatIncludedPrice,
                    'ParaBirimi': invoice.documentCurrency || 'TRY'
                }));
            }
            // Fallback for invoices without items
            return [{
                'FaturaNo': invoice.invoiceNumber,
                'Musteri/Tedarikci': invoice.customerName,
                'FaturaTarihi': invoice.issueDate,
                'VadeTarihi': invoice.dueDate,
                'Durum': invoice.status,
                'ToplamTutar': invoice.grandTotal,
                'ParaBirimi': invoice.documentCurrency || 'TRY'
            }];
        }
    });

    generalExportToCSV(dataToExport, 'faturalar.csv');
};

const escapeXml = (unsafe: string | number | undefined): string => {
    if (unsafe === undefined || unsafe === null) return '';
    const str = String(unsafe);
    return str.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
};

const toXML = (invoice: Invoice | Bill): string => {
    const isBill = 'supplierId' in invoice;

    const invoiceNumber = isBill ? (invoice as Bill).billNumber : (invoice as Invoice).invoiceNumber;
    const partyName = isBill ? (invoice as Bill).supplierName : (invoice as Invoice).customerName;
    const items = 'items' in invoice ? (invoice as Invoice).items : [];
    const uuid = isBill ? '' : (invoice as Invoice).uuid;
    const currency = isBill ? 'TRY' : (invoice as Invoice).documentCurrency;
    const subTotal = isBill ? (invoice as Bill).totalAmount : (invoice as Invoice).subTotal;
    const totalDiscount = isBill ? 0 : (invoice as Invoice).totalDiscount;
    const totalTax = isBill ? 0 : (invoice as Invoice).totalTax;
    const grandTotal = isBill ? (invoice as Bill).totalAmount : (invoice as Invoice).grandTotal;


    const itemsXML = items.map(item => `
        <LineItem>
            <ProductName>${escapeXml(item.productName)}</ProductName>
            <Quantity>${item.quantity}</Quantity>
            <UnitPrice>${item.unitPrice}</UnitPrice>
            <DiscountRate>${item.discountRate}</DiscountRate>
            <TaxRate>${item.taxRate}</TaxRate>
            <Total>${item.vatIncludedPrice}</Total>
        </LineItem>`).join('');

    return `
    <Invoice>
        <InvoiceNumber>${escapeXml(invoiceNumber)}</InvoiceNumber>
        <UUID>${escapeXml(uuid)}</UUID>
        <PartyName>${escapeXml(partyName)}</PartyName>
        <IssueDate>${invoice.issueDate}</IssueDate>
        <DueDate>${invoice.dueDate}</DueDate>
        <Status>${escapeXml(invoice.status as string)}</Status>
        <Currency>${escapeXml(currency || 'TRY')}</Currency>
        <SubTotal>${subTotal}</SubTotal>
        <TotalDiscount>${totalDiscount}</TotalDiscount>
        <TotalTax>${totalTax}</TotalTax>
        <GrandTotal>${grandTotal}</GrandTotal>
        <LineItems>${itemsXML}</LineItems>
    </Invoice>`;
};

export const exportInvoicesToXML = (invoices: (Invoice | Bill)[]) => {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<Invoices>
    ${invoices.map(toXML).join('')}
</Invoices>`;

    downloadFile(xmlContent, 'faturalar.xml', 'application/xml');
};