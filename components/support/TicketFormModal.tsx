import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SupportTicket, TicketStatus, TicketPriority, Attachment } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ICONS } from '../../constants';

interface TicketFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: SupportTicket | null;
  prefilledData?: Partial<Omit<SupportTicket, 'id' | 'ticketNumber' | 'customerName' | 'assignedToName' | 'createdDate'>> | null;
}

const TicketFormModal: React.FC<TicketFormModalProps> = ({ isOpen, onClose, ticket, prefilledData }) => {
    const { customers, employees, addTicket, updateTicket, currentUser } = useApp();

    const initialFormState: Omit<SupportTicket, 'id' | 'ticketNumber' | 'customerName' | 'assignedToName' | 'createdDate'> = {
        subject: '',
        description: '',
        customerId: 0,
        assignedToId: 0,
        status: TicketStatus.Open,
        priority: TicketPriority.Normal,
        attachments: [],
    };
    const [formData, setFormData] = useState(initialFormState);
    const [newFileName, setNewFileName] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (ticket) {
                // Editing an existing ticket
                setFormData({
                    subject: ticket.subject,
                    description: ticket.description,
                    customerId: ticket.customerId,
                    assignedToId: ticket.assignedToId,
                    status: ticket.status,
                    priority: ticket.priority,
                    attachments: ticket.attachments || [],
                });
            } else {
                // Creating a new ticket, potentially with prefilled data
                setFormData({
                    ...initialFormState,
                    customerId: prefilledData?.customerId || 0,
                    assignedToId: prefilledData?.assignedToId || 0,
                });
            }
        }
    }, [ticket, prefilledData, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const isNumber = ['customerId', 'assignedToId'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumber ? parseInt(value) : value }));
    };

    const handleAddAttachment = () => {
        if (newFileName.trim()) {
            const newAttachment: Attachment = {
                id: Date.now(),
                fileName: newFileName.trim(),
                fileType: 'Other',
                fileSize: Math.floor(Math.random() * 2048),
                url: '#',
                uploadedAt: new Date().toISOString(),
                uploadedById: currentUser.id,
            };
            setFormData(prev => ({ ...prev, attachments: [...(prev.attachments || []), newAttachment] }));
            setNewFileName('');
        }
    };

    const handleRemoveAttachment = (attachmentId: number) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter(att => att.id !== attachmentId)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.subject && formData.customerId > 0 && formData.assignedToId > 0) {
            if (ticket) {
                updateTicket({ ...ticket, ...formData });
            } else {
                addTicket(formData);
            }
            onClose();
        } else {
            alert("Lütfen tüm zorunlu alanları doldurun.");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={ticket ? "Talebi Düzenle" : "Yeni Destek Talebi Oluştur"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Konu *</label>
                    <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="customerId" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Müşteri *</label>
                        <select name="customerId" id="customerId" value={formData.customerId} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white">
                            <option value={0} disabled>Müşteri Seçin...</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="assignedToId" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Atanan Kişi *</label>
                        <select name="assignedToId" id="assignedToId" value={formData.assignedToId} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white">
                            <option value={0} disabled>Sorumlu Seçin...</option>
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

                <div className="border-t pt-4 dark:border-dark-border">
                    <h4 className="font-semibold mb-2">Ekler</h4>
                    <div className="space-y-2">
                        {formData.attachments?.map(att => (
                            <div key={att.id} className="flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-700/50 rounded-md">
                                <span>{att.fileName}</span>
                                <button type="button" onClick={() => handleRemoveAttachment(att.id)} className="text-red-500 hover:text-red-700">{ICONS.trash}</button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                        <input type="text" value={newFileName} onChange={e => setNewFileName(e.target.value)} placeholder="dosya_adi.pdf (Simülasyon)" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                        <Button type="button" onClick={handleAddAttachment}>Ekle</Button>
                    </div>
                </div>

                <div className="flex justify-end pt-4 gap-2">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit">{ticket ? "Güncelle" : "Oluştur"}</Button>
                </div>
            </form>
        </Modal>
    )
}

export default TicketFormModal;