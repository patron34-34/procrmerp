import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ICONS } from '../../constants';
import { Customer, Contact, Deal, Project, Invoice, CommunicationLogType, Task, InvoiceStatus, DealStage, TaskStatus, ActivityLog, CommunicationLog } from '../../types';
import CommentsThread from '../collaboration/CommentsThread';
import CommunicationLogForm from '../customers/CommunicationLogForm';
import ContactFormModal from '../customers/ContactFormModal';
import ConfirmationModal from '../ui/ConfirmationModal';

type ActiveTab = 'overview' | 'timeline' | 'deals' | 'projects' | 'invoices' | 'tasks';
type TimelineItem = (CommunicationLog | ActivityLog) & { itemType: 'log' | 'activity' };

const HealthIndicator: React.FC<{ score: number; factors: string[] }> = ({ score, factors }) => {
    const getHealthInfo = () => {
        if (score > 75) return { color: 'bg-green-500', text: 'İyi' };
        if (score > 40) return { color: 'bg-yellow-500', text: 'Riskli' };
        return { color: 'bg-red-500', text: 'Zayıf' };
    };
    const { color, text } = getHealthInfo();
    const tooltipText = `Sağlık Puanı: ${score}/100\n${factors.join('\n')}`;

    return (
        <div className="flex items-center gap-2" title={tooltipText}>
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
            <span>{text}</span>
        </div>
    );
};

const CustomerDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { customers, contacts, deals, projects, invoices, tasks, communicationLogs, getCustomerHealthScore, deleteContact, hasPermission, activityLogs, deleteCommunicationLog } = useApp();
    const customerId = parseInt(id || '', 10);

    const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [logToEdit, setLogToEdit] = useState<CommunicationLog | null>(null);
    const [logToDelete, setLogToDelete] = useState<CommunicationLog | null>(null);
    const [logType, setLogType] = useState<CommunicationLogType>(CommunicationLogType.Note);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
    const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

    const customer = useMemo(() => customers.find(c => c.id === customerId), [customers, customerId]);
    const customerContacts = useMemo(() => contacts.filter(c => c.customerId === customerId), [contacts, customerId]);
    const customerDeals = useMemo(() => deals.filter(d => d.customerId === customerId), [deals, customerId]);
    const customerProjects = useMemo(() => projects.filter(p => p.customerId === customerId), [projects, customerId]);
    const customerInvoices = useMemo(() => invoices.filter(i => i.customerId === customerId), [invoices, customerId]);
    const customerTasks = useMemo(() => tasks.filter(t => t.relatedEntityType === 'customer' && t.relatedEntityId === customerId), [tasks, customerId]);
    
    const { score: healthScore, factors: healthFactors } = useMemo(() => getCustomerHealthScore(customerId), [getCustomerHealthScore, customerId]);

    const canManageCustomers = hasPermission('musteri:yonet');

    const timelineItems = useMemo(() => {
        if (!customer) return [];
        const customerEntityIds = {
            'deal': customerDeals.map(d => d.id),
            'project': customerProjects.map(p => p.id),
            'invoice': customerInvoices.map(i => i.id)
        };

        const logs: TimelineItem[] = communicationLogs
            .filter(log => log.customerId === customerId)
            .map(log => ({ ...log, itemType: 'log' }));

        const activities: TimelineItem[] = activityLogs
            .filter(act => {
                if (act.entityType === 'customer' && act.entityId === customerId) return true;
                if (act.entityType === 'deal' && customerEntityIds.deal.includes(act.entityId || 0)) return true;
                if (act.entityType === 'project' && customerEntityIds.project.includes(act.entityId || 0)) return true;
                if (act.entityType === 'invoice' && customerEntityIds.invoice.includes(act.entityId || 0)) return true;
                return false;
            })
            .map(act => ({ ...act, itemType: 'activity' }));
        
        return [...logs, ...activities].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [communicationLogs, activityLogs, customer, customerDeals, customerProjects, customerInvoices, customerId]);
    
    const handleOpenLogModal = (type: CommunicationLogType, log?: CommunicationLog) => {
        setLogType(type);
        setLogToEdit(log || null);
        setIsLogModalOpen(true);
    };

    const handleAddContact = () => {
        setContactToEdit(null);
        setIsContactModalOpen(true);
    };

    const handleEditContact = (contact: Contact) => {
        setContactToEdit(contact);
        setIsContactModalOpen(true);
    };

    const handleDeleteContactConfirm = () => {
        if(contactToDelete && canManageCustomers) {
            deleteContact(contactToDelete.id);
            setContactToDelete(null);
        }
    }
    
    const handleDeleteLogConfirm = () => {
        if(logToDelete && canManageCustomers) {
            deleteCommunicationLog(logToDelete.id);
            setLogToDelete(null);
        }
    }

    if (!customer) {
        return <Card title="Hata"><p>Müşteri bulunamadı. Lütfen <Link to="/customers">Müşteriler sayfasına</Link> geri dönün.</p></Card>;
    }

    const getTimelineIcon = (item: TimelineItem) => {
        if (item.itemType === 'log') {
            const logType = (item as CommunicationLog).type;
            const iconMap = {
                [CommunicationLogType.Note]: ICONS.note,
                [CommunicationLogType.Call]: ICONS.phoneCall,
                [CommunicationLogType.Email]: ICONS.email,
                [CommunicationLogType.Meeting]: ICONS.meeting,
            };
            return iconMap[logType] || ICONS.note;
        } else {
             const actionType = (item as ActivityLog).actionType;
             if (actionType.includes("CREATED")) return ICONS.add;
             if (actionType.includes("UPDATED") || actionType.includes("CHANGED")) return ICONS.edit;
             if (actionType.includes("DELETED")) return ICONS.trash;
             return ICONS.system;
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview': return (
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card title="İletişim Bilgileri" className="lg:col-span-1" action={canManageCustomers && <Button size="sm" onClick={handleAddContact}>Yeni Ekle</Button>}>
                        {customerContacts.length > 0 ? customerContacts.map(contact => (
                            <div key={contact.id} className="mb-4 pb-4 border-b last:border-0 last:pb-0 last:mb-0 dark:border-dark-border">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold">{contact.name}</p>
                                        <p className="text-sm text-text-secondary">{contact.title}</p>
                                    </div>
                                    {canManageCustomers && (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEditContact(contact)} className="text-slate-400 hover:text-primary-500">{ICONS.edit}</button>
                                            <button onClick={() => setContactToDelete(contact)} className="text-slate-400 hover:text-red-500">{ICONS.trash}</button>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm mt-2">{contact.email}</p>
                                <p className="text-sm">{contact.phone}</p>
                            </div>
                        )) : <p className="text-sm text-text-secondary">Henüz kişi eklenmemiş.</p>}
                    </Card>
                    <Card title="Adres Bilgileri" className="lg:col-span-2">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div>
                                <h4 className="font-semibold mb-2">Fatura Adresi</h4>
                                <address className="not-italic">
                                    {customer.billingAddress.streetAddress}<br/>
                                    {customer.billingAddress.district}, {customer.billingAddress.city}<br/>
                                    {customer.billingAddress.postalCode} {customer.billingAddress.country}
                                </address>
                            </div>
                             <div>
                                <h4 className="font-semibold mb-2">Teslimat Adresi</h4>
                                <address className="not-italic">
                                    {customer.shippingAddress.streetAddress}<br/>
                                    {customer.shippingAddress.district}, {customer.shippingAddress.city}<br/>
                                    {customer.shippingAddress.postalCode} {customer.shippingAddress.country}
                                </address>
                            </div>
                       </div>
                    </Card>
                    <div className="lg:col-span-3">
                        <Card title="Yorumlar">
                            <CommentsThread entityType="customer" entityId={customerId} />
                        </Card>
                    </div>
                </div>
            );
            case 'timeline': return (
                <Card>
                    <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                    {timelineItems.length > 0 ? timelineItems.map(item => (
                      <div key={`${item.itemType}-${item.id}`} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {getTimelineIcon(item)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-text-main dark:text-dark-text-main whitespace-pre-wrap">
                            {item.itemType === 'log' ? (item as CommunicationLog).content : (item as ActivityLog).details}
                          </p>
                          <div className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1 flex justify-between">
                            <span><span className="font-semibold">{item.userName}</span></span>
                            <span>{new Date(item.timestamp).toLocaleString('tr-TR')}</span>
                            {item.itemType === 'log' && canManageCustomers &&
                              <div className="flex gap-2">
                                <button onClick={() => handleOpenLogModal((item as CommunicationLog).type, item as CommunicationLog)} className="hover:text-primary-500">Düzenle</button>
                                <button onClick={() => setLogToDelete(item as CommunicationLog)} className="hover:text-red-500">Sil</button>
                              </div>
                            }
                          </div>
                        </div>
                      </div>
                    )) : (
                      <p className="text-center text-text-secondary dark:text-dark-text-secondary py-8">
                        Bu müşteri için aktivite kaydı bulunamadı.
                      </p>
                    )}
                  </div>
                </Card>
            );
            case 'deals': return (
                <Card title="Anlaşmalar">
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-3 font-semibold">Başlık</th><th className="p-3 font-semibold">Değer</th><th className="p-3 font-semibold">Aşama</th><th className="p-3 font-semibold">Kapanış Tarihi</th>
                        </tr></thead>
                        <tbody>{customerDeals.map(deal => (<tr key={deal.id} className="border-b dark:border-dark-border"><td className="p-3"><Link to={`/deals/${deal.id}`} className="text-primary-600 hover:underline">{deal.title}</Link></td><td className="p-3 font-mono">${deal.value.toLocaleString()}</td><td className="p-3">{deal.stage}</td><td className="p-3">{deal.closeDate}</td></tr>))}</tbody>
                    </table>
                </Card>
            );
            case 'projects': return (
                <Card title="Projeler">
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-3 font-semibold">Proje Adı</th><th className="p-3 font-semibold">Durum</th><th className="p-3 font-semibold">İlerleme</th><th className="p-3 font-semibold">Bitiş Tarihi</th>
                        </tr></thead>
                        <tbody>{customerProjects.map(project => (<tr key={project.id} className="border-b dark:border-dark-border"><td className="p-3"><Link to={`/projects/${project.id}`} className="text-primary-600 hover:underline">{project.name}</Link></td><td className="p-3">{project.status}</td><td className="p-3">{project.progress}%</td><td className="p-3">{project.deadline}</td></tr>))}</tbody>
                    </table>
                </Card>
            );
            case 'invoices': return (
                <Card title="Faturalar">
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-3 font-semibold">Fatura No</th><th className="p-3 font-semibold">Tutar</th><th className="p-3 font-semibold">Durum</th><th className="p-3 font-semibold">Fatura Tarihi</th><th className="p-3 font-semibold">Vade Tarihi</th>
                        </tr></thead>
                        <tbody>{customerInvoices.map(invoice => (<tr key={invoice.id} className="border-b dark:border-dark-border"><td className="p-3">{invoice.invoiceNumber}</td><td className="p-3 font-mono">${invoice.grandTotal.toLocaleString()}</td><td className="p-3">{invoice.status}</td><td className="p-3">{invoice.issueDate}</td><td className="p-3">{invoice.dueDate}</td></tr>))}</tbody>
                    </table>
                </Card>
            );
            case 'tasks': return (
                <Card title="Görevler">
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-3 font-semibold">Başlık</th><th className="p-3 font-semibold">Durum</th><th className="p-3 font-semibold">Öncelik</th><th className="p-3 font-semibold">Bitiş Tarihi</th>
                        </tr></thead>
                        <tbody>{customerTasks.map(task => (<tr key={task.id} className="border-b dark:border-dark-border"><td className="p-3">{task.title}</td><td className="p-3">{task.status}</td><td className="p-3">{task.priority}</td><td className="p-3">{task.dueDate}</td></tr>))}</tbody>
                    </table>
                </Card>
            );
        }
    };

    return (
        <>
        <div className="space-y-6">
            <Card>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold">{customer.name}</h2>
                        <p className="text-text-secondary">{customer.company}</p>
                        <div className="flex items-center gap-4 mt-2">
                            <HealthIndicator score={healthScore} factors={healthFactors} />
                            <span className="text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">{customer.status}</span>
                        </div>
                    </div>
                    {canManageCustomers && (
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => handleOpenLogModal(CommunicationLogType.Note)}><span className="flex items-center gap-2">{ICONS.note} Not Ekle</span></Button>
                            <Button variant="secondary" onClick={() => handleOpenLogModal(CommunicationLogType.Call)}><span className="flex items-center gap-2">{ICONS.phoneCall} Arama Kaydet</span></Button>
                        </div>
                    )}
                </div>
            </Card>

            <div className="border-b border-slate-200 dark:border-dark-border">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('overview')} className={`${activeTab === 'overview' ? 'border-primary-500 text-primary-600' : 'border-transparent text-text-secondary hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Genel Bakış</button>
                    <button onClick={() => setActiveTab('timeline')} className={`${activeTab === 'timeline' ? 'border-primary-500 text-primary-600' : 'border-transparent text-text-secondary hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Zaman Tüneli</button>
                    <button onClick={() => setActiveTab('deals')} className={`${activeTab === 'deals' ? 'border-primary-500 text-primary-600' : 'border-transparent text-text-secondary hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Anlaşmalar ({customerDeals.length})</button>
                    <button onClick={() => setActiveTab('projects')} className={`${activeTab === 'projects' ? 'border-primary-500 text-primary-600' : 'border-transparent text-text-secondary hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Projeler ({customerProjects.length})</button>
                    <button onClick={() => setActiveTab('invoices')} className={`${activeTab === 'invoices' ? 'border-primary-500 text-primary-600' : 'border-transparent text-text-secondary hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Faturalar ({customerInvoices.length})</button>
                    <button onClick={() => setActiveTab('tasks')} className={`${activeTab === 'tasks' ? 'border-primary-500 text-primary-600' : 'border-transparent text-text-secondary hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Görevler ({customerTasks.length})</button>
                </nav>
            </div>
            <div>{renderTabContent()}</div>
        </div>

        {isLogModalOpen && (
            <CommunicationLogForm 
                isOpen={isLogModalOpen}
                onClose={() => setIsLogModalOpen(false)}
                customerId={customerId}
                logType={logType}
                logToEdit={logToEdit}
            />
        )}
        {isContactModalOpen && (
            <ContactFormModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                customerId={customerId}
                contact={contactToEdit}
            />
        )}
        <ConfirmationModal
            isOpen={!!contactToDelete}
            onClose={() => setContactToDelete(null)}
            onConfirm={handleDeleteContactConfirm}
            title="Kişiyi Sil"
            message={`'${contactToDelete?.name}' adlı kişiyi kalıcı olarak silmek istediğinizden emin misiniz?`}
        />
        <ConfirmationModal
            isOpen={!!logToDelete}
            onClose={() => setLogToDelete(null)}
            onConfirm={handleDeleteLogConfirm}
            title="Kaydı Sil"
            message={`Bu iletişim kaydını kalıcı olarak silmek istediğinizden emin misiniz?`}
        />
        </>
    );
};

export default CustomerDetail;
