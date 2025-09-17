import React, { useMemo } from 'react';
import { useApp } from '../../../../context/AppContext';
import Card from '../../../ui/Card';
import { Link } from 'react-router-dom';
import { InvoiceStatus, Project, SupportTicket, TicketStatus } from '../../../../types';
import FeedbackCard from './FeedbackCard';

const CustomerDashboard: React.FC = () => {
    const { currentUser, customers, contacts, invoices, projects, tickets } = useApp();

    const customerData = useMemo(() => {
        const contact = contacts.find(c => c.id === currentUser.contactId);
        if (!contact) return null;
        const customer = customers.find(c => c.id === contact.customerId);
        if (!customer) return null;
        
        const customerInvoices = invoices.filter(i => i.customerId === customer.id);
        const customerProjects = projects.filter(p => p.customerId === customer.id);
        const customerTickets = tickets.filter(t => t.customerId === customer.id);

        return {
            customer,
            unpaidInvoices: customerInvoices.filter(i => i.status === InvoiceStatus.Sent || i.status === InvoiceStatus.Overdue),
            activeProjects: customerProjects.filter(p => p.status !== 'tamamlandı'),
            openTickets: customerTickets.filter(t => t.status === TicketStatus.Open || t.status === TicketStatus.Pending),
        };

    }, [currentUser, customers, contacts, invoices, projects, tickets]);

    if (!customerData) {
        return <Card title="Hata"><p>Müşteri bilgileri bulunamadı.</p></Card>;
    }
    
    const { customer, unpaidInvoices, activeProjects, openTickets } = customerData;
    const unpaidTotal = unpaidInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Hoş Geldiniz, {customer.name}!</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <h4 className="text-text-secondary">Ödenmemiş Fatura</h4>
                    <p className="text-3xl font-bold text-orange-500">{unpaidInvoices.length}</p>
                    <p className="text-text-secondary">Toplam Tutar: ${unpaidTotal.toLocaleString()}</p>
                    <Link to="/portal/customer/invoices" className="text-sm font-semibold text-primary-600 hover:underline mt-2 block">Faturaları Görüntüle →</Link>
                </Card>
                 <Card>
                    <h4 className="text-text-secondary">Aktif Proje</h4>
                    <p className="text-3xl font-bold">{activeProjects.length}</p>
                    <Link to="/portal/customer/projects" className="text-sm font-semibold text-primary-600 hover:underline mt-2 block">Projeleri Görüntüle →</Link>
                </Card>
                 <Card>
                    <h4 className="text-text-secondary">Açık Destek Talebi</h4>
                    <p className="text-3xl font-bold">{openTickets.length}</p>
                     <Link to="/portal/customer/tickets" className="text-sm font-semibold text-primary-600 hover:underline mt-2 block">Talepleri Görüntüle →</Link>
                </Card>
            </div>
            <FeedbackCard />
        </div>
    );
};

export default CustomerDashboard;
