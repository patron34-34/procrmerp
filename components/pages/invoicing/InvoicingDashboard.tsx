
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../ui/Card';
import { ICONS } from '../../../constants';
import { useApp } from '../../../context/AppContext';
import { InvoiceStatus } from '../../../types';

const StatCard: React.FC<{ title: string; value: string; icon: JSX.Element; color: string }> = ({ title, value, icon, color }) => (
    <Card className="hover:shadow-lg hover:border-primary-500 transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center">
            <div className={`p-3 rounded-full mr-4 ${color}`}>
                {React.cloneElement(icon, { className: 'h-6 w-6 text-white' })}
            </div>
            <div>
                <p className="text-sm text-text-secondary">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    </Card>
);

const QuickLink: React.FC<{ to: string; title: string; description: string; icon: JSX.Element }> = ({ to, title, description, icon }) => (
    <Link to={to}>
        <Card className="h-full hover:shadow-lg hover:border-primary-500 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-primary-600 w-6 h-6">
                    {icon}
                </div>
                <div>
                    <h3 className="font-bold text-lg">{title}</h3>
                    <p className="text-sm text-text-secondary mt-1">{description}</p>
                </div>
            </div>
        </Card>
    </Link>
);

const InvoicingDashboard: React.FC = () => {
    const { invoices } = useApp();

    const unpaidAmount = invoices
        .filter(inv => inv.status === InvoiceStatus.Sent || inv.status === InvoiceStatus.Overdue)
        .reduce((sum, inv) => sum + inv.grandTotal, 0);

    const overdueCount = invoices.filter(inv => inv.status === InvoiceStatus.Overdue).length;
    
    const draftCount = invoices.filter(inv => inv.status === InvoiceStatus.Draft).length;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Faturalandırma Paneli</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link to="/invoicing/outgoing">
                    <StatCard title="Ödenmemiş Tutar" value={`$${unpaidAmount.toLocaleString()}`} icon={ICONS.invoices} color="bg-orange-500" />
                </Link>
                <Link to="/invoicing/outgoing">
                    <StatCard title="Gecikmiş Faturalar" value={overdueCount.toString()} icon={ICONS.calendar} color="bg-red-500" />
                </Link>
                <Link to="/invoicing/drafts">
                    <StatCard title="Taslak Faturalar" value={draftCount.toString()} icon={ICONS.edit} color="bg-yellow-500" />
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <QuickLink to="/invoicing/outgoing" title="Giden Faturalar" description="Müşterilerinize kestiğiniz faturaları yönetin." icon={ICONS.export} />
                 <QuickLink to="/invoicing/incoming" title="Gelen Faturalar (Masraflar)" description="Tedarikçilerinizden gelen faturaları ve masrafları takip edin." icon={ICONS.import} />
                 <QuickLink to="/customers" title="Müşteriler" description="Faturalandırılacak müşterilerinizi görüntüleyin." icon={ICONS.customers} />
            </div>
        </div>
    );
};

export default InvoicingDashboard;