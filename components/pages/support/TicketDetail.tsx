
import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import { SupportTicket, TicketStatus, TicketPriority, Attachment } from '../../../types';
import CommentsThread from '../../collaboration/CommentsThread';
import { summarizeText } from '../../../services/geminiService';
import { useNotification } from '../../../context/NotificationContext';
import ConfirmationModal from '../../ui/ConfirmationModal';
import TicketFormModal from '../../support/TicketFormModal';
import TicketSLAStatus from '../../support/TicketSLAStatus';
import TicketAttachments from '../../support/TicketAttachments';

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="grid grid-cols-2 text-sm">
        <span className="text-text-secondary dark:text-dark-text-secondary">{label}</span>
        <span className="font-semibold">{value}</span>
    </div>
);

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

const TicketDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { tickets, customers, employees, hasPermission, deleteTicket, updateTicket } = useApp();
    const { addToast } = useNotification();
    const ticketId = parseInt(id || '', 10);

    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summary, setSummary] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    const canManageSupport = hasPermission('destek:yonet');

    const ticket = useMemo(() => tickets.find(t => t.id === ticketId), [tickets, ticketId]);
    const customer = useMemo(() => customers.find(c => c.id === ticket?.customerId), [customers, ticket]);
    const assignedTo = useMemo(() => employees.find(e => e.id === ticket?.assignedToId), [employees, ticket]);
    
    const handleSummarize = async () => {
        if (!ticket?.description) return;
        setIsSummarizing(true);
        setSummary('');
        try {
            const result = await summarizeText(ticket.description);
            setSummary(result);
            addToast("Özet başarıyla oluşturuldu.", "success");
        } catch (error) {
            console.error(error);
            addToast("Özetleme sırasında bir hata oluştu.", "error");
        } finally {
            setIsSummarizing(false);
        }
    };

    const handleDeleteConfirm = () => {
        if (ticket) {
            deleteTicket(ticket.id);
            setIsDeleteModalOpen(false);
            // Consider navigating away
        }
    };
    
     const handleAttachmentsChange = (newAttachments: Attachment[]) => {
        if (ticket) {
            updateTicket({ ...ticket, attachments: newAttachments });
        }
    };


    if (!ticket) {
        return <Card title="Hata"><p>Destek talebi bulunamadı. Lütfen <Link to="/support/tickets">Destek Talepleri</Link> sayfasına geri dönün.</p></Card>;
    }

    return (
        <div className="space-y-6">
            <div className="mb-4">
                <Link to="/support/tickets" className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-main">
                    &larr; Destek Taleplerine Geri Dön
                </Link>
            </div>
            <Card>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold">{ticket.subject}</h2>
                        <p className="text-text-secondary">Talep No: {ticket.ticketNumber}</p>
                         <div className="flex items-center gap-4 mt-2">
                           <TicketSLAStatus createdDate={ticket.createdDate} priority={ticket.priority} />
                        </div>
                    </div>
                     {canManageSupport && (
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => setIsEditModalOpen(true)}>Düzenle</Button>
                            <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>Sil</Button>
                        </div>
                    )}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Talep Detayları">
                        <div className="space-y-4">
                            {summary && (
                                <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
                                    <h4 className="font-semibold text-primary-700 dark:text-primary-300 flex items-center gap-2">{ICONS.magic} AI Özeti</h4>
                                    <p className="text-sm mt-1">{summary}</p>
                                </div>
                            )}
                            <div>
                                <h4 className="font-semibold mb-1">Açıklama</h4>
                                <p className="text-text-secondary whitespace-pre-wrap">{ticket.description}</p>
                                <Button size="sm" variant="secondary" className="mt-2" onClick={handleSummarize} disabled={isSummarizing}>
                                    <span className="flex items-center gap-2">{ICONS.magic} {isSummarizing ? 'Özetleniyor...' : 'AI ile Özetle'}</span>
                                </Button>
                            </div>
                        </div>
                    </Card>
                     <TicketAttachments 
                        ticket={ticket} 
                        onAttachmentsChange={handleAttachmentsChange} 
                        canManage={canManageSupport}
                    />
                    <Card title="Yorumlar">
                        <CommentsThread entityType="ticket" entityId={ticket.id} />
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <Card title="Genel Bilgiler">
                        <div className="space-y-3">
                            <InfoRow label="Durum" value={getStatusBadge(ticket.status)} />
                            <InfoRow label="Öncelik" value={getPriorityBadge(ticket.priority)} />
                            <InfoRow label="Oluşturulma Tarihi" value={new Date(ticket.createdDate).toLocaleString('tr-TR')} />
                            <InfoRow label="İlk Yanıt" value={ticket.firstResponseDate ? new Date(ticket.firstResponseDate).toLocaleString('tr-TR') : 'Bekleniyor'} />
                            <InfoRow label="Çözülme Tarihi" value={ticket.resolvedDate ? new Date(ticket.resolvedDate).toLocaleString('tr-TR') : '-'} />
                        </div>
                    </Card>
                    <Card title="Müşteri">
                        {customer && (
                            <Link to={`/customers/${customer.id}`} className="block hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-md">
                                <p className="font-bold">{customer.name}</p>
                                <p className="text-sm text-text-secondary">{customer.company}</p>
                            </Link>
                        )}
                    </Card>
                     <Card title="Atanan Kişi">
                        {assignedTo && (
                            <div className="flex items-center gap-3">
                                <img src={assignedTo.avatar} alt={assignedTo.name} className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="font-semibold">{assignedTo.name}</p>
                                    <p className="text-sm text-text-secondary">{assignedTo.position}</p>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
            <ConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Destek Talebini Sil"
                message={`'${ticket.ticketNumber}' numaralı destek talebini kalıcı olarak silmek istediğinizden emin misiniz?`}
            />
            {isEditModalOpen && <TicketFormModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                ticket={ticket} 
            />}
        </div>
    );
};

export default TicketDetail;
