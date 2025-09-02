import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { DealStage, InvoiceStatus } from '../../types';
import Card from '../ui/Card';

interface CustomerStatsBarProps {
    customerId: number;
}

const StatCard: React.FC<{ title: string; value: string; colorClass?: string }> = ({ title, value, colorClass = 'text-text-main dark:text-dark-text-main' }) => (
    <Card className="!shadow-none text-center">
        <h4 className="text-sm font-semibold text-text-secondary">{title}</h4>
        <p className={`text-2xl font-bold mt-1 ${colorClass}`}>{value}</p>
    </Card>
);


const CustomerStatsBar: React.FC<CustomerStatsBarProps> = ({ customerId }) => {
    const { deals, invoices, projects } = useApp();

    const stats = useMemo(() => {
        const customerInvoices = invoices.filter(i => i.customerId === customerId);
        const customerDeals = deals.filter(d => d.customerId === customerId);
        const customerProjects = projects.filter(p => p.customerId === customerId);

        const lifetimeValue = customerInvoices
            .filter(i => i.status === InvoiceStatus.Paid)
            .reduce((sum, i) => sum + i.grandTotal, 0);

        const openDealsValue = customerDeals
            .filter(d => d.stage !== DealStage.Won && d.stage !== DealStage.Lost)
            .reduce((sum, d) => sum + d.value, 0);

        const overdueBalance = customerInvoices
            .filter(i => i.status === InvoiceStatus.Overdue)
            .reduce((sum, i) => sum + i.grandTotal, 0);

        const activeProjects = customerProjects.filter(p => p.status !== 'tamamlandı').length;

        return { lifetimeValue, openDealsValue, overdueBalance, activeProjects };
    }, [customerId, invoices, deals, projects]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
                title="Yaşam Boyu Değeri" 
                value={`$${stats.lifetimeValue.toLocaleString()}`} 
                colorClass="text-green-600"
            />
            <StatCard 
                title="Açık Fırsat Değeri" 
                value={`$${stats.openDealsValue.toLocaleString()}`}
                colorClass="text-blue-600"
            />
            <StatCard 
                title="Gecikmiş Bakiye" 
                value={`$${stats.overdueBalance.toLocaleString()}`}
                colorClass={stats.overdueBalance > 0 ? "text-red-600" : ""}
            />
            <StatCard 
                title="Aktif Projeler" 
                value={stats.activeProjects.toString()}
            />
        </div>
    );
};

export default CustomerStatsBar;
