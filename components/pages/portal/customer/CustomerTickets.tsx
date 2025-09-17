import React, { useMemo } from 'react';
import { useApp } from '../../../../context/AppContext';
import Card from '../../../ui/Card';
import Button from '../../../ui/Button';
import FeedbackCard from './FeedbackCard';

const CustomerTickets: React.FC = () => {
    const { currentUser, customers, contacts, tickets, setIsTicketFormOpen } = useApp();
    
    const customerId = useMemo(() => {
        const contact = contacts.find(c => c.id === currentUser.contactId);
        return contact ? contact.customerId : null;
    }, [currentUser, contacts]);

    const customerTickets = useMemo(() => {
        if (!customerId) return [];
        return tickets.filter(t => t.customerId === customerId);
    }, [customerId, tickets]);

    const handleNewTicket = () => {
        if (customerId) {
            setIsTicketFormOpen(true, null, { customerId });
        }
    };

    return (
        <div className="space-y-6">
            <Card title="Destek Taleplerim" action={<Button onClick={handleNewTicket}>Yeni Talep Oluştur</Button>}>
                 <table className="w-full text-left">
                    <thead className="border-b dark:border-dark-border">
                        <tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-3">Talep No</th><th className="p-3">Konu</th><th className="p-3">Durum</th><th className="p-3">Öncelik</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customerTickets.map(ticket => (
                            <tr key={ticket.id} className="border-b dark:border-dark-border">
                                <td className="p-3 font-mono">{ticket.ticketNumber}</td>
                                <td className="p-3">{ticket.subject}</td>
                                <td className="p-3">{ticket.status}</td>
                                <td className="p-3">{ticket.priority}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
            <FeedbackCard />
        </div>
    );
};

export default CustomerTickets;
