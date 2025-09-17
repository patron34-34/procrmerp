import React, { useMemo } from 'react';
import { useApp } from '../../../../context/AppContext';
import Card from '../../../ui/Card';
import { InvoiceStatus } from '../../../../types';
import FeedbackCard from './FeedbackCard';

const CustomerInvoices: React.FC = () => {
    const { currentUser, customers, contacts, invoices } = useApp();

    const customerInvoices = useMemo(() => {
        const contact = contacts.find(c => c.id === currentUser.contactId);
        if (!contact) return [];
        return invoices.filter(i => i.customerId === contact.customerId)
            .sort((a,b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
    }, [currentUser, contacts, invoices]);

    return (
        <div className="space-y-6">
            <Card title="Faturalarım">
                 <table className="w-full text-left">
                    <thead className="border-b dark:border-dark-border">
                        <tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-3">Fatura No</th><th className="p-3">Tarih</th><th className="p-3">Vade Tarihi</th><th className="p-3 text-right">Tutar</th><th className="p-3">Durum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customerInvoices.map(invoice => (
                            <tr key={invoice.id} className="border-b dark:border-dark-border">
                                <td className="p-3 font-mono">{invoice.invoiceNumber}</td>
                                <td className="p-3">{invoice.issueDate}</td>
                                <td className="p-3">{invoice.dueDate}</td>
                                <td className="p-3 text-right font-mono">${invoice.grandTotal.toLocaleString()}</td>
                                <td className="p-3">{invoice.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
            <FeedbackCard />
        </div>
    );
};

export default CustomerInvoices;
