import React from 'react';
import { Invoice } from '../../types';
import { useApp } from '../../context/AppContext';
import { Logo } from '../../constants';

interface InvoicePreviewProps {
    invoice: Invoice;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
    const { companyInfo, customers } = useApp();
    const customer = customers.find(c => c.id === invoice.customerId);

    const formatCurrency = (amount: number) => {
         return amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    return (
        <div className="bg-white text-black p-12 font-sans text-xs w-full h-full shadow-lg">
            <div className="flex justify-between items-start pb-4 border-b border-gray-200">
                <div>
                    <Logo className="h-12 text-black" />
                    <p className="font-bold text-base mt-2">{companyInfo.name}</p>
                    <p className="text-gray-600">{companyInfo.address}</p>
                    <p className="text-gray-600">{companyInfo.phone} | {companyInfo.email}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-bold uppercase text-gray-700">FATURA</h2>
                    <p><strong>Fatura No:</strong> {invoice.invoiceNumber || 'TASLAK'}</p>
                    {invoice.uuid && <p className="text-xs"><strong>ETTN:</strong> {invoice.uuid}</p>}
                    <p><strong>Tarih:</strong> {invoice.issueDate} {invoice.issueTime}</p>
                    <p><strong>Vade:</strong> {invoice.dueDate}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 pb-4 border-b border-gray-200">
                <div>
                    <h3 className="font-bold text-gray-600 mb-1">SATICI</h3>
                    <p>{companyInfo.name}</p>
                    <p>Maslak V.D. - 1234567890</p>
                </div>
                <div className="text-right">
                    <h3 className="font-bold text-gray-600 mb-1">ALICI</h3>
                    <p className="font-semibold">{customer?.name}</p>
                    <p>{customer?.billingAddress.streetAddress}</p>
                    <p>{customer?.billingAddress.district}, {customer?.billingAddress.city}</p>
                    <p><strong>Vergi Dairesi:</strong> {customer?.taxOffice}</p>
                    <p><strong>VKN/TCKN:</strong> {customer?.taxId}</p>
                </div>
            </div>

            <div className="mt-6">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border font-semibold">#</th>
                            <th className="p-2 border font-semibold">Mal/Hizmet</th>
                            <th className="p-2 border font-semibold text-right">Miktar</th>
                            <th className="p-2 border font-semibold text-right">Birim Fiyat</th>
                            <th className="p-2 border font-semibold text-right">İskonto</th>
                            <th className="p-2 border font-semibold text-right">KDV</th>
                            <th className="p-2 border font-semibold text-right">Tutar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, index) => (
                            <tr key={item.id}>
                                <td className="p-2 border">{index + 1}</td>
                                <td className="p-2 border">{item.productName}</td>
                                <td className="p-2 border text-right">{item.quantity} {item.unit}</td>
                                <td className="p-2 border text-right">{formatCurrency(item.unitPrice)}</td>
                                <td className="p-2 border text-right">{formatCurrency(item.discountAmount)} (%{item.discountRate})</td>
                                <td className="p-2 border text-right">{formatCurrency(item.taxAmount)} (%{item.taxRate})</td>
                                <td className="p-2 border text-right font-semibold">{formatCurrency(item.vatIncludedPrice)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end mt-4">
                <div className="w-1/2">
                    <div className="flex justify-between p-1"><span>Ara Toplam:</span> <span className="font-mono">{formatCurrency(invoice.subTotal)}</span></div>
                    <div className="flex justify-between p-1"><span>İndirim Toplamı:</span> <span className="font-mono text-red-600">-{formatCurrency(invoice.totalDiscount)}</span></div>
                    <div className="flex justify-between p-1"><span>Hesaplanan KDV:</span> <span className="font-mono">{formatCurrency(invoice.totalTax)}</span></div>
                    {invoice.totalWithholding > 0 && <div className="flex justify-between p-1"><span>Tevkifat:</span> <span className="font-mono text-red-600">-{formatCurrency(invoice.totalWithholding)}</span></div>}
                    <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-gray-400"><span>ÖDENECEK TOPLAM:</span> <span className="font-mono">{formatCurrency(invoice.grandTotal)} {invoice.documentCurrency}</span></div>
                </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs"><strong>Yalnız:</strong> #{invoice.amountInWords}#</p>
                {invoice.notes && <p className="text-xs mt-2"><strong>Notlar:</strong> {invoice.notes}</p>}
            </div>
        </div>
    );
};

export default InvoicePreview;
