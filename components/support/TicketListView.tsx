import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { SupportTicket, TicketStatus, TicketPriority } from '../../types';
import ConfirmationModal from '../ui/ConfirmationModal';
import { ICONS } from '../../constants';
import TicketFormModal from './TicketFormModal';
import { getSLAInfo } from '../../utils/slaUtils';

interface TicketListViewProps {
    tickets: SupportTicket[];
    onUpdate: (ticket: SupportTicket) => void;
}

const TicketListView: React.FC<TicketListViewProps> = ({ tickets, onUpdate }) => {
    const { hasPermission, deleteTicket, employees } = useApp();
    const [ticketToDelete, setTicketToDelete] = useState<SupportTicket | null>(null);
    const [editingTicket, setEditingTicket] = useState<SupportTicket | null>(null);
    const [editingCell, setEditingCell] = useState<{ id: number; key: 'status' | 'assignedToId' } | null>(null);

    const canManageSupport = hasPermission('destek:yonet');

    const sortedTickets = useMemo(() => {
        return [...tickets].sort((a, b) => {
            const slaA = getSLAInfo(a.createdDate, a.priority);
            const slaB = getSLAInfo(b.createdDate, b.priority);
            return slaB.urgencyScore - slaA.urgencyScore;
        });
    }, [tickets]);

    const handleDeleteConfirm = () => {
        if (ticketToDelete) {
            deleteTicket(ticketToDelete.id);
            setTicketToDelete(null);
        }
    };
    
    const handleInlineUpdate = (ticket: SupportTicket, key: 'status' | 'assignedToId', value: string | number) => {
        const assigneeName = key === 'assignedToId'
            ? employees.find(e => e.id === value)?.name || ticket.assignedToName
            : ticket.assignedToName;
        
        let firstResponseDate = ticket.firstResponseDate;
        if (key === 'status' && !firstResponseDate && value !== TicketStatus.Open) {
            firstResponseDate = new Date().toISOString();
        }

        onUpdate({ ...ticket, [key]: value, assignedToName: assigneeName, firstResponseDate });
        setEditingCell(null);
    };

    const getPriorityIcon = (priority: TicketPriority) => {
        const styles: { [key in TicketPriority]: { icon: React.ReactNode, color: string } } = {
            [TicketPriority.Low]: { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>, color: 'text-slate-500' },
            [TicketPriority.Normal]: { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>, color: 'text-blue-500' },
            [TicketPriority.High]: { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>, color: 'text-yellow-500' },
            [TicketPriority.Urgent]: { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'text-red-500' },
        };
        return <span title={priority} className={styles[priority].color}>{styles[priority].icon}</span>;
    };


    const getStatusBadge = (status: TicketStatus) => {
        const styles: { [key in TicketStatus]: string } = {
            [TicketStatus.Open]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            [TicketStatus.Pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            [TicketStatus.Resolved]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            [TicketStatus.Closed]: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-slate-200 dark:border-dark-border">
                        <tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-4 font-semibold">Talep No</th>
                            <th className="p-4 font-semibold">Konu</th>
                            <th className="p-4 font-semibold">Müşteri</th>
                            <th className="p-4 font-semibold">SLA Durumu &amp; Öncelik</th>
                            <th className="p-4 font-semibold">Talep Durumu</th>
                            <th className="p-4 font-semibold">Atanan</th>
                            <th className="p-4 font-semibold">Oluşturma Tarihi</th>
                            {canManageSupport && <th className="p-4 font-semibold">Eylemler</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTickets.map((ticket) => {
                            const slaInfo = getSLAInfo(ticket.createdDate, ticket.priority);
                            return (
                                <tr key={ticket.id} className={`border-b border-slate-200 hover:bg-slate-50 dark:border-dark-border dark:hover:bg-slate-800/50 group ${slaInfo.rowClass}`}>
                                    <td className="p-4 font-mono text-sm">{ticket.ticketNumber}</td>
                                    <td className="p-4 font-medium">
                                        <Link to={`/support/tickets/${ticket.id}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                                            {ticket.subject}
                                        </Link>
                                    </td>
                                    <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{ticket.customerName}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {getPriorityIcon(ticket.priority)}
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${slaInfo.colorClass}`}>
                                                {slaInfo.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4" onClick={() => canManageSupport && setEditingCell({ id: ticket.id, key: 'status' })}>
                                        {editingCell?.id === ticket.id && editingCell.key === 'status' ? (
                                            <select
                                                defaultValue={ticket.status}
                                                onBlur={() => setEditingCell(null)}
                                                onChange={(e) => handleInlineUpdate(ticket, 'status', e.target.value)}
                                                autoFocus
                                                className="p-1 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        ) : (
                                            <div className="cursor-pointer">{getStatusBadge(ticket.status)}</div>
                                        )}
                                    </td>
                                    <td className="p-4 text-text-secondary dark:text-dark-text-secondary" onClick={() => canManageSupport && setEditingCell({ id: ticket.id, key: 'assignedToId' })}>
                                        {editingCell?.id === ticket.id && editingCell.key === 'assignedToId' ? (
                                            <select
                                                defaultValue={ticket.assignedToId}
                                                onBlur={() => setEditingCell(null)}
                                                onChange={(e) => handleInlineUpdate(ticket, 'assignedToId', parseInt(e.target.value))}
                                                autoFocus
                                                className="p-1 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                            </select>
                                        ) : (
                                            <div className="cursor-pointer">{ticket.assignedToName}</div>
                                        )}
                                    </td>
                                    <td className="p-4 text-sm text-text-secondary">{new Date(ticket.createdDate).toLocaleDateString('tr-TR')}</td>
                                    {canManageSupport && (
                                        <td className="p-4">
                                            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setEditingTicket(ticket)} className="text-slate-500 hover:text-primary-600 dark:hover:text-primary-400">{ICONS.edit}</button>
                                                <button onClick={() => setTicketToDelete(ticket)} className="text-slate-500 hover:text-red-600 dark:hover:text-red-500">{ICONS.trash}</button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {canManageSupport && <TicketFormModal isOpen={!!editingTicket} onClose={() => setEditingTicket(null)} ticket={editingTicket} />}
            {canManageSupport && <ConfirmationModal 
                isOpen={!!ticketToDelete}
                onClose={() => setTicketToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Destek Talebini Sil"
                message={`'${ticketToDelete?.ticketNumber}' numaralı destek talebini kalıcı olarak silmek istediğinizden emin misiniz?`}
            />}
        </>
    );
};

export default TicketListView;