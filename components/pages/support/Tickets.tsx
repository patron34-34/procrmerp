

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { SupportTicket, TicketStatus, TicketPriority } from '../../../types';
import Card from '../../ui/Card';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import EmptyState from '../../ui/EmptyState';
import ConfirmationModal from '../../ui/ConfirmationModal';
import { ICONS } from '../../../constants';

const Tickets: React.FC = () => {
    const { tickets, customers, employees, addTicket, updateTicket, deleteTicket, hasPermission } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTicket, setEditingTicket] = useState<SupportTicket | null>(null);
    const [ticketToDelete, setTicketToDelete] = useState<SupportTicket | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const canManageSupport = hasPermission('destek:yonet');

    const initialFormState: Omit<SupportTicket, 'id' | 'ticketNumber' | 'customerName' | 'assignedToName' | 'createdDate'> = {
        subject: '',
        description: '',
        customerId: customers[0]?.id || 0,
        assignedToId: employees[0]?.id || 0,
        status: TicketStatus.Open,
        priority: TicketPriority.Normal,
    };
    const [formData, setFormData] = useState(initialFormState);

    const resetForm = () => {
        setFormData(initialFormState);
        setEditingTicket(null);
    };

    const openModalForNew = () => {
        if (!canManageSupport) return;
        resetForm();
        setIsModalOpen(true);
    };

    const openModalForEdit = (ticket: SupportTicket) => {
        if (!canManageSupport) return;
        setEditingTicket(ticket);
        setFormData(ticket);
        setIsModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const isNumber = ['customerId', 'assignedToId'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumber ? parseInt(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.subject && formData.customerId && formData.assignedToId) {
            if (editingTicket) {
                updateTicket({ ...editingTicket, ...formData });
            } else {
                addTicket(formData);
            }
            setIsModalOpen(false);
            resetForm();
        } else {
            alert("Lütfen tüm zorunlu alanları doldurun.");
        }
    };
    
    const handleDeleteConfirm = () => {
        if(ticketToDelete) {
            deleteTicket(ticketToDelete.id);
            setTicketToDelete(null);
        }
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

    const getPriorityBadge = (priority: TicketPriority) => {
        const styles: { [key in TicketPriority]: string } = {
            [TicketPriority.Low]: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
            [TicketPriority.Normal]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            [TicketPriority.High]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            [TicketPriority.Urgent]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[priority]}`}>{priority}</span>;
    };

    const filteredTickets = tickets.filter(t => 
        t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Card
                title="Destek Talepleri"
                action={canManageSupport ? <Button onClick={openModalForNew}><span className="flex items-center gap-2">{ICONS.add} Yeni Talep Oluştur</span></Button> : undefined}
            >
                <div className="mb-4">
                    <input 
                        type="text"
                        placeholder="Talep ara (Konu, Numara, Müşteri...)"
                        className="w-full md:w-1/3 p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:border-dark-border dark:text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto">
                    {filteredTickets.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-200 dark:border-dark-border">
                                <tr className="bg-slate-50 dark:bg-slate-900/50">
                                    <th className="p-4 font-semibold">Talep No</th>
                                    <th className="p-4 font-semibold">Konu</th>
                                    <th className="p-4 font-semibold">Müşteri</th>
                                    <th className="p-4 font-semibold">Atanan Kişi</th>
                                    <th className="p-4 font-semibold">Öncelik</th>
                                    <th className="p-4 font-semibold">Durum</th>
                                    {canManageSupport && <th className="p-4 font-semibold">Eylemler</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTickets.map((ticket) => (
                                    <tr key={ticket.id} className="border-b border-slate-200 hover:bg-slate-50 dark:border-dark-border dark:hover:bg-slate-800/50">
                                        <td className="p-4 font-mono text-sm">{ticket.ticketNumber}</td>
                                        <td className="p-4 font-medium">{ticket.subject}</td>
                                        <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{ticket.customerName}</td>
                                        <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{ticket.assignedToName}</td>
                                        <td className="p-4">{getPriorityBadge(ticket.priority)}</td>
                                        <td className="p-4">{getStatusBadge(ticket.status)}</td>
                                        {canManageSupport && <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => openModalForEdit(ticket)} className="text-slate-500 hover:text-primary-600 dark:hover:text-primary-400">{ICONS.edit}</button>
                                                <button onClick={() => setTicketToDelete(ticket)} className="text-slate-500 hover:text-red-600 dark:hover:text-red-500">{ICONS.trash}</button>
                                            </div>
                                        </td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState
                            icon={ICONS.support}
                            title="Henüz Destek Talebi Yok"
                            description="İlk destek talebini oluşturarak müşteri memnuniyetini yönetmeye başlayın."
                            action={canManageSupport ? <Button onClick={openModalForNew}>Talep Oluştur</Button> : undefined}
                        />
                    )}
                </div>
            </Card>

            {canManageSupport && <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTicket ? "Talebi Düzenle" : "Yeni Destek Talebi Oluştur"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="subject" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Konu *</label>
                        <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="customerId" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Müşteri *</label>
                            <select name="customerId" id="customerId" value={formData.customerId} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white">
                                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="assignedToId" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Atanan Kişi *</label>
                            <select name="assignedToId" id="assignedToId" value={formData.assignedToId} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white">
                                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Açıklama</label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} rows={4} className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white" />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="priority" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Öncelik</label>
                            <select name="priority" id="priority" value={formData.priority} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white">
                                {Object.values(TicketPriority).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Durum</label>
                            <select name="status" id="status" value={formData.status} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white">
                                {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 gap-2">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>İptal</Button>
                        <Button type="submit">{editingTicket ? "Güncelle" : "Oluştur"}</Button>
                    </div>
                </form>
            </Modal>}

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

export default Tickets;
