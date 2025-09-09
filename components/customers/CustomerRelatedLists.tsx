import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import ActivityFeed from './ActivityFeed';
import InlineCommunicationLogger from './InlineCommunicationLogger';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';
import { ICONS } from '../../constants';

interface CustomerRelatedListsProps {
    customerId: number;
    onAddNewTask: () => void;
    onAddNewDeal: () => void;
    onAddNewProject: () => void;
    onAddNewInvoice: () => void;
    onAddNewTicket: () => void;
    onAddNewSalesOrder: () => void;
}

type ActiveTab = 'activity' | 'deals' | 'projects' | 'invoices' | 'tickets' | 'sales_orders';

const CustomerRelatedLists: React.FC<CustomerRelatedListsProps> = ({ 
    customerId,
    onAddNewDeal,
    onAddNewProject,
    onAddNewInvoice,
    onAddNewTicket,
    onAddNewSalesOrder
}) => {
    const { deals, projects, invoices, tickets, salesOrders, hasPermission, activityLogs, communicationLogs, comments } = useApp();
    const [activeTab, setActiveTab] = useState<ActiveTab>('activity');
    
    const canManageCustomers = hasPermission('musteri:yonet');

    const relatedDeals = useMemo(() => deals.filter(d => d.customerId === customerId), [deals, customerId]);
    const relatedProjects = useMemo(() => projects.filter(p => p.customerId === customerId), [projects, customerId]);
    const relatedInvoices = useMemo(() => invoices.filter(i => i.customerId === customerId), [invoices, customerId]);
    const relatedTickets = useMemo(() => tickets.filter(t => t.customerId === customerId), [tickets, customerId]);
    const relatedSalesOrders = useMemo(() => salesOrders.filter(so => so.customerId === customerId), [salesOrders, customerId]);
    const activityCount = useMemo(() => {
        const customerDeals = deals.filter(d => d.customerId === customerId).map(d => d.id);
        const customerProjects = projects.filter(p => p.customerId === customerId).map(p => p.id);
        const logsCount = communicationLogs.filter(log => log.customerId === customerId).length;
        const commentsCount = comments.filter(c => c.relatedEntityType === 'customer' && c.relatedEntityId === customerId).length;
        const activitiesCount = activityLogs.filter(act => 
                (act.entityType === 'customer' && act.entityId === customerId) ||
                (act.entityType === 'deal' && customerDeals.includes(act.entityId || 0)) ||
                (act.entityType === 'project' && customerProjects.includes(act.entityId || 0))
            ).length;
        return logsCount + commentsCount + activitiesCount;
    }, [communicationLogs, activityLogs, comments, deals, projects, customerId]);
    
    const TabButton: React.FC<{ tabName: ActiveTab, label: string, count: number }> = ({ tabName, label, count }) => (
        <button 
            onClick={() => setActiveTab(tabName)} 
            className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === tabName ? 'border-primary-500 text-primary-600' : 'border-transparent text-text-secondary hover:border-slate-300 dark:hover:text-dark-text-secondary'}`}
        >
            {label} <span className="bg-slate-200 dark:bg-slate-700 text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
        </button>
    );
    
    const renderContent = () => {
        const createEmptyState = (title: string, description: string, action: () => void, icon: JSX.Element) => (
            <EmptyState
                title={title}
                description={description}
                icon={icon}
                action={canManageCustomers ? <Button onClick={action}>Yeni Ekle</Button> : undefined}
            />
        );
        switch (activeTab) {
            case 'activity':
                return <ActivityFeed customerId={customerId} />;
            case 'deals':
                return relatedDeals.length > 0 ? (<table className="w-full text-sm"><thead><tr className="border-b dark:border-dark-border"><th className="p-2">Anlaşma</th><th className="p-2">Aşama</th><th className="p-2 text-right">Değer</th></tr></thead><tbody>{relatedDeals.map(d => <tr key={d.id} className="border-b dark:border-dark-border last:border-0"><td className="p-2 font-medium"><Link to={`/deals/${d.id}`} className="hover:underline">{d.title}</Link></td><td className="p-2">{d.stage}</td><td className="p-2 text-right font-mono">${d.value.toLocaleString()}</td></tr>)}</tbody></table>) : createEmptyState("Henüz Anlaşma Yok", "Bu müşteri için yeni bir anlaşma oluşturun.", onAddNewDeal, ICONS.sales);
            case 'sales_orders':
                return relatedSalesOrders.length > 0 ? (<table className="w-full text-sm"><thead><tr className="border-b dark:border-dark-border"><th className="p-2">Sipariş No</th><th className="p-2">Durum</th><th className="p-2 text-right">Tutar</th></tr></thead><tbody>{relatedSalesOrders.map(so => <tr key={so.id} className="border-b dark:border-dark-border last:border-0"><td className="p-2 font-mono"><Link to={`/inventory/sales-orders/${so.id}`} className="hover:underline">{so.orderNumber}</Link></td><td className="p-2">{so.status}</td><td className="p-2 text-right font-mono">${so.grandTotal.toLocaleString()}</td></tr>)}</tbody></table>) : createEmptyState("Henüz Satış Siparişi Yok", "Bu müşteri için yeni bir satış siparişi oluşturun.", onAddNewSalesOrder, ICONS.salesOrder);
            case 'projects':
                 return relatedProjects.length > 0 ? (<table className="w-full text-sm"><thead><tr className="border-b dark:border-dark-border"><th className="p-2">Proje</th><th className="p-2">Durum</th><th className="p-2 text-right">İlerleme</th></tr></thead><tbody>{relatedProjects.map(p => <tr key={p.id} className="border-b dark:border-dark-border last:border-0"><td className="p-2 font-medium"><Link to={`/projects/${p.id}`} className="hover:underline">{p.name}</Link></td><td className="p-2">{p.status}</td><td className="p-2 text-right font-mono">{p.progress}%</td></tr>)}</tbody></table>) : createEmptyState("Henüz Proje Yok", "Bu müşteri için yeni bir proje oluşturun.", onAddNewProject, ICONS.projects);
            case 'invoices':
                 return relatedInvoices.length > 0 ? (<table className="w-full text-sm"><thead><tr className="border-b dark:border-dark-border"><th className="p-2">Fatura No</th><th className="p-2">Durum</th><th className="p-2 text-right">Tutar</th></tr></thead><tbody>{relatedInvoices.map(i => <tr key={i.id} className="border-b dark:border-dark-border last:border-0"><td className="p-2 font-mono">{i.invoiceNumber}</td><td className="p-2">{i.status}</td><td className="p-2 text-right font-mono">${i.grandTotal.toLocaleString()}</td></tr>)}</tbody></table>) : createEmptyState("Henüz Fatura Yok", "Bu müşteri için yeni bir fatura oluşturun.", onAddNewInvoice, ICONS.invoices);
            case 'tickets':
                 return relatedTickets.length > 0 ? (<table className="w-full text-sm"><thead><tr className="border-b dark:border-dark-border"><th className="p-2">Talep No</th><th className="p-2">Konu</th><th className="p-2">Durum</th></tr></thead><tbody>{relatedTickets.map(t => <tr key={t.id} className="border-b dark:border-dark-border last:border-0"><td className="p-2 font-mono"><Link to={`/support/tickets/${t.id}`} className="hover:underline">{t.ticketNumber}</Link></td><td className="p-2 font-medium">{t.subject}</td><td className="p-2">{t.status}</td></tr>)}</tbody></table>) : createEmptyState("Henüz Destek Talebi Yok", "Bu müşteri için yeni bir destek talebi oluşturun.", onAddNewTicket, ICONS.support);
        }
    };

    return (
        <Card>
             {canManageCustomers && <div className="p-4 border-b dark:border-dark-border">
                <InlineCommunicationLogger customerId={customerId} />
            </div>}
            <div className="border-b dark:border-dark-border">
                <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
                    <TabButton tabName="activity" label="Aktivite" count={activityCount} />
                    <TabButton tabName="deals" label="Anlaşmalar" count={relatedDeals.length} />
                    <TabButton tabName="sales_orders" label="Satış Siparişleri" count={relatedSalesOrders.length} />
                    <TabButton tabName="projects" label="Projeler" count={relatedProjects.length} />
                    <TabButton tabName="invoices" label="Faturalar" count={relatedInvoices.length} />
                    <TabButton tabName="tickets" label="Destek Talepleri" count={relatedTickets.length} />
                </nav>
            </div>
            <div className="p-4 min-h-[300px]">
                {renderContent()}
            </div>
        </Card>
    );
};

export default CustomerRelatedLists;