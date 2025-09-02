import React from 'react';
import { useApp } from '../../context/AppContext';
import { SupportTicket, TicketStatus } from '../../types';
import TicketKanbanColumn from './TicketKanbanColumn';

interface TicketKanbanViewProps {
    tickets: SupportTicket[];
    onUpdateStatus: (ticketId: number, newStatus: TicketStatus) => void;
}

const TicketKanbanView: React.FC<TicketKanbanViewProps> = ({ tickets, onUpdateStatus }) => {
    const { hasPermission } = useApp();
    const canManageSupport = hasPermission('destek:yonet');

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, ticketId: number) => {
        e.dataTransfer.setData('ticketId', ticketId.toString());
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: TicketStatus) => {
        const ticketId = parseInt(e.dataTransfer.getData('ticketId'), 10);
        const ticket = tickets.find(t => t.id === ticketId);
        if (ticket && ticket.status !== newStatus) {
            onUpdateStatus(ticketId, newStatus);
        }
    };

    const statuses = Object.values(TicketStatus);

    return (
        <div className="flex gap-4 overflow-x-auto pb-4">
            {statuses.map(status => (
                <TicketKanbanColumn
                    key={status}
                    status={status}
                    tickets={tickets.filter(t => t.status === status)}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    canManage={canManageSupport}
                />
            ))}
        </div>
    );
};

export default TicketKanbanView;
