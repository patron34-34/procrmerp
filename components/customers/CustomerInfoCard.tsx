import React from 'react';
import { Customer } from '../../types';

const InfoRow: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => {
    if (value === undefined || value === null || value === '') return null;
    return (
        <div className="flex justify-between text-sm py-1.5 border-b border-slate-100 dark:border-slate-700/50 last:border-b-0">
            <dt className="text-text-secondary dark:text-dark-text-secondary">{label}</dt>
            <dd className="text-text-main dark:text-dark-text-main font-semibold text-right truncate" title={String(value)}>{value}</dd>
        </div>
    );
};

interface CustomerInfoCardProps {
    customer: Customer;
}

const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({ customer }) => {
    return (
        <div className="space-y-4">
             <dl>
                <InfoRow label="Cari Tipi" value={customer.accountType} />
                <InfoRow label="Cari Kodu" value={customer.accountCode} />
                <InfoRow label="Para Birimi" value={customer.currency} />
                <InfoRow label="Fiyat Listesi ID" value={customer.priceListId} />
                <InfoRow label="Açılış Bakiyesi" value={`${customer.openingBalance.toLocaleString()} ${customer.currency}`} />
            </dl>
            <dl>
                <InfoRow label="Vergi Dairesi" value={customer.taxOffice} />
                <InfoRow label="Vergi/TC No" value={customer.taxId} />
            </dl>
            <dl>
                 <InfoRow label="IBAN" value={customer.iban} />
                 <InfoRow label="IBAN 2" value={customer.iban2} />
            </dl>
             <dl>
                 <InfoRow label="e-Fatura Posta Kutusu" value={customer.eInvoiceMailbox} />
                 <InfoRow label="e-İrsaliye Posta Kutusu" value={customer.eDispatchMailbox} />
            </dl>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                    <h4 className="font-semibold mb-2">Fatura Adresi</h4>
                    <address className="not-italic">
                        {customer.billingAddress.streetAddress}<br/>
                        {customer.billingAddress.district}, {customer.billingAddress.city}<br/>
                        {customer.billingAddress.postalCode} {customer.billingAddress.country}
                    </address>
                </div>
                 <div>
                    <h4 className="font-semibold mb-2">Teslimat Adresi</h4>
                    <address className="not-italic">
                        {customer.shippingAddress.streetAddress}<br/>
                        {customer.shippingAddress.district}, {customer.shippingAddress.city}<br/>
                        {customer.shippingAddress.postalCode} {customer.shippingAddress.country}
                    </address>
                </div>
           </div>
        </div>
    );
};

export default CustomerInfoCard;