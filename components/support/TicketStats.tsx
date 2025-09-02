import React, { useMemo } from 'react';
import { SupportTicket, TicketStatus } from '../../types';
import Card from '../ui/Card';

interface TicketStatsProps {
  allTickets: SupportTicket[];
}

const TicketStats: React.FC<TicketStatsProps> = ({ allTickets }) => {
    const stats = useMemo(() => {
        const open = allTickets.filter(t => t.status === TicketStatus.Open).length;
        const pending = allTickets.filter(t => t.status === TicketStatus.Pending).length;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const resolvedToday = allTickets.filter(t => 
            (t.status === TicketStatus.Resolved || t.status === TicketStatus.Closed) && 
            t.resolvedDate && new Date(t.resolvedDate) >= today
        ).length;
        
        const overdue = allTickets.filter(t => {
            const created = new Date(t.createdDate);
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(today.getDate() - 2);
            return (t.status === TicketStatus.Open || t.status === TicketStatus.Pending) && created < twoDaysAgo;
        }).length;

        return { open, pending, resolvedToday, overdue };
    }, [allTickets]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
                <h4 className="text-text-secondary dark:text-dark-text-secondary">Açık Talepler</h4>
                <p className="text-3xl font-bold text-blue-500">{stats.open}</p>
            </Card>
            <Card>
                <h4 className="text-text-secondary dark:text-dark-text-secondary">Beklemede</h4>
                <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
            </Card>
            <Card>
                <h4 className="text-text-secondary dark:text-dark-text-secondary">Bugün Çözülenler</h4>
                <p className="text-3xl font-bold text-green-500">{stats.resolvedToday}</p>
            </Card>
             <Card>
                <h4 className="text-text-secondary dark:text-dark-text-secondary">Vadesi Geçenler (&gt;2 gün)</h4>
                <p className="text-3xl font-bold text-red-500">{stats.overdue}</p>
            </Card>
        </div>
    );
};

export default TicketStats;
