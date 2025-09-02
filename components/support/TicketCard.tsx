import React from 'react';
import { useApp } from '../../context/AppContext';
import { SupportTicket, TicketPriority } from '../../types';
import TicketSLAStatus from './TicketSLAStatus';

interface TicketCardProps {
    ticket: SupportTicket;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, ticketId: number) => void;
    canManage: boolean;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onDragStart, canManage }) => {
    const { employees } = useApp();
    const assignee = employees.find(e => e.id === ticket.assignedToId);

    const getPriorityColor = (priority: TicketPriority) => {
        switch(priority) {
            case TicketPriority.Urgent: return 'border-l-red-500';
            case TicketPriority.High: return 'border-l-yellow-500';
            case TicketPriority.Normal: return 'border-l-blue-500';
            case TicketPriority.Low: return 'border-l-slate-400';
            default: return 'border-l-slate-400';
        }
    };
    
    const getPriorityIcon = (priority: TicketPriority) => {
        const styles: { [key in TicketPriority]: { icon: React.ReactNode, color: string } } = {
            [TicketPriority.Low]: { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>, color: 'text-slate-500' },
            [TicketPriority.Normal]: { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>, color: 'text-blue-500' },
            [TicketPriority.High]: { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>, color: 'text-yellow-500' },
            [TicketPriority.Urgent]: { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'text-red-500' },
        };
        return <span title={priority} className={styles[priority].color}>{styles[priority].icon}</span>;
    };

    return (
        <div
            draggable={canManage}
            onDragStart={(e) => {
                e.stopPropagation();
                if (canManage) onDragStart(e, ticket.id);
            }}
            className={`bg-card p-3 mb-3 rounded-md shadow-sm border border-border dark:border-dark-border border-l-4 ${getPriorityColor(ticket.priority)} ${canManage ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
        >
            <p className="font-bold text-sm text-text-main dark:text-dark-text-main truncate" title={ticket.subject}>{ticket.subject}</p>
            <p className="text-xs text-text-secondary dark:text-dark-text-secondary truncate">{ticket.customerName}</p>
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-dark-border/50 flex justify-between items-center">
                <span className="text-xs font-mono">{ticket.ticketNumber}</span>
                <div className="flex items-center gap-2">
                    {getPriorityIcon(ticket.priority)}
                    <TicketSLAStatus createdDate={ticket.createdDate} priority={ticket.priority} />
                    {assignee && <img src={assignee.avatar} alt={assignee.name} title={assignee.name} className="w-6 h-6 rounded-full" />}
                </div>
            </div>
        </div>
    );
};

export default TicketCard;