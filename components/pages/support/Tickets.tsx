import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { SupportTicket, TicketStatus, TicketPriority } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import EmptyState from '../../ui/EmptyState';
import { ICONS } from '../../../constants';
import TicketFormModal from '../../support/TicketFormModal';
import TicketStats from '../../support/TicketStats';
import SupportTicketFilterBar from '../../support/SupportTicketFilterBar';
import TicketListView from '../../support/TicketListView';
import TicketKanbanView from '../../support/TicketKanbanView';

type ViewMode = 'list' | 'kanban';

const Tickets: React.FC = () => {
    const { tickets, hasPermission, updateTicket } = useApp();
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTicket, setEditingTicket] = useState<SupportTicket | null>(null);
    
    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all',
        assignedToId: 'all',
        searchTerm: ''
    });

    const canManageSupport = hasPermission('destek:yonet');

    const openModalForNew = () => {
        if (!canManageSupport) return;
        setEditingTicket(null);
        setIsModalOpen(true);
    };

    const handleUpdateTicketStatus = (ticketId: number, newStatus: TicketStatus) => {
        const ticketToUpdate = tickets.find(t => t.id === ticketId);
        if (ticketToUpdate) {
            updateTicket({ ...ticketToUpdate, status: newStatus });
        }
    };

    const filteredTickets = useMemo(() => tickets.filter(t => 
        (filters.status === 'all' || t.status === filters.status) &&
        (filters.priority === 'all' || t.priority === filters.priority) &&
        (filters.assignedToId === 'all' || t.assignedToId === parseInt(filters.assignedToId)) &&
        (t.subject.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
         t.ticketNumber.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
         t.customerName.toLowerCase().includes(filters.searchTerm.toLowerCase()))
    ), [tickets, filters]);

    return (
        <div className="space-y-6">
            <TicketStats allTickets={tickets} />
            <Card>
                <div className="p-4 border-b dark:border-dark-border">
                    <SupportTicketFilterBar filters={filters} setFilters={setFilters} />
                </div>
                <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="p-1 bg-slate-200 dark:bg-slate-700 rounded-md">
                            <button onClick={() => setViewMode('list')} className={`p-1 rounded ${viewMode === 'list' ? 'bg-white dark:bg-slate-500 shadow' : ''}`}>{ICONS.list}</button>
                            <button onClick={() => setViewMode('kanban')} className={`p-1 rounded ${viewMode === 'kanban' ? 'bg-white dark:bg-slate-500 shadow' : ''}`}>{ICONS.kanban}</button>
                        </div>
                    </div>
                    {canManageSupport && (
                        <Button onClick={openModalForNew}>
                            <span className="flex items-center gap-2">{ICONS.add} Yeni Talep Oluştur</span>
                        </Button>
                    )}
                </div>
                <div className="p-4">
                    {filteredTickets.length > 0 ? (
                        viewMode === 'list' ? (
                            <TicketListView tickets={filteredTickets} onUpdate={updateTicket} />
                        ) : (
                            <TicketKanbanView tickets={filteredTickets} onUpdateStatus={handleUpdateTicketStatus} />
                        )
                    ) : (
                        <EmptyState
                            icon={ICONS.support}
                            title="Filtreye Uygun Talep Yok"
                            description="Filtre kriterlerinizi değiştirin veya yeni bir talep oluşturun."
                        />
                    )}
                </div>
            </Card>

            {canManageSupport && <TicketFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                ticket={editingTicket}
            />}
        </div>
    );
};

export default Tickets;