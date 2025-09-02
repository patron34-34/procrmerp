import React, { useState } from 'react';
import { SupportTicket, TicketStatus } from '../../types';
import TicketCard from './TicketCard';
import { Link } from 'react-router-dom';

interface TicketKanbanColumnProps {
    status: TicketStatus;
    tickets: SupportTicket[];
    onDragStart: (e: React.DragEvent<HTMLDivElement>, ticketId: number) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, status: TicketStatus) => void;
    canManage: boolean;
}

const TicketKanbanColumn: React.FC<TicketKanbanColumnProps> = ({ status, tickets, onDragStart, onDrop, canManage }) => {
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); if (canManage) setIsOver(true); };
    const handleDragLeave = () => setIsOver(false);
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => { if (canManage) { onDrop(e, status); setIsOver(false); } };
    
    const statusConfig: { [key in TicketStatus]: { color: string } } = {
        [TicketStatus.Open]: { color: 'border-t-blue-500' },
        [TicketStatus.Pending]: { color: 'border-t-yellow-500' },
        [TicketStatus.Resolved]: { color: 'border-t-green-500' },
        [TicketStatus.Closed]: { color: 'border-t-slate-500' },
    };

    return (
         <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex-1 min-w-[300px] bg-slate-100 rounded-lg p-3 transition-colors duration-300 dark:bg-dark-sidebar ${isOver ? 'bg-slate-200 dark:bg-slate-800' : ''}`}
        >
            <div className={`p-2 mb-3 rounded-t-md border-t-4 ${statusConfig[status].color}`}>
                <h3 className="font-bold text-text-main dark:text-dark-text-main">{status}</h3>
                <span className="text-sm text-text-secondary dark:text-dark-text-secondary">{tickets.length} talep</span>
            </div>
            <div className="max-h-[calc(100vh-550px)] overflow-y-auto pr-2">
                {tickets.map(ticket => (
                    <Link to={`/support/tickets/${ticket.id}`} key={ticket.id}>
                        <TicketCard ticket={ticket} onDragStart={onDragStart} canManage={canManage} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default TicketKanbanColumn;
