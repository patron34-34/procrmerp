import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import { DealStage, SalesActivityType, QuotationStatus, Deal } from '../../types';
import ActivityTimeline from '../sales/ActivityTimeline';
import LogActivityModal from '../sales/LogActivityModal';
import Button from '../ui/Button';
import { ICONS } from '../../constants';
import CommentsThread from '../collaboration/CommentsThread';
import Dropdown, { DropdownItem } from '../ui/Dropdown';
import ConfirmationModal from '../ui/ConfirmationModal';

const DealDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { deals, customers, hasPermission, quotations, setIsDealFormOpen, deleteDeal } = useApp();
    const dealId = parseInt(id || '', 10);
    const deal = deals.find(d => d.id === dealId);
    const customer = customers.find(c => c.id === deal?.customerId);
    
    const [isLogActivityModalOpen, setIsLogActivityModalOpen] = useState(false);
    const [activityType, setActivityType] = useState<SalesActivityType>(SalesActivityType.Call);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const canManageDeals = hasPermission('anlasma:yonet');

    const relatedQuotations = useMemo(() => quotations.filter(q => q.dealId === dealId), [quotations, dealId]);

    if (!deal) {
        return <Card title="Hata"><p>Anlaşma bulunamadı. Lütfen <Link to="/sales">Satış Hattı'na</Link> geri dönün.</p></Card>;
    }
    
    const handleOpenLogActivityModal = (type: SalesActivityType) => {
        setActivityType(type);
        setIsLogActivityModalOpen(true);
    };

    const handleCreateQuotation = () => {
        navigate('/sales/quotations/new', { state: { dealId: deal.id } });
    };

    const handleDeleteConfirm = () => {
        deleteDeal(deal.id);
        setIsDeleteModalOpen(false);
        navigate('/sales');
    };

    const getStageBadge = (stage: DealStage) => {
        const styles: { [key in DealStage]: string } = {
            [DealStage.Lead]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            [DealStage.Contacted]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            [DealStage.Proposal]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
            [DealStage.Won]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            [DealStage.Lost]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[stage]}`}>{stage}</span>;
    };
    
    const getQuotationStatusBadge = (status: QuotationStatus) => {
        const styles: { [key in QuotationStatus]: string } = {
            [QuotationStatus.Draft]: 'bg-slate-100 text-slate-800',
            [QuotationStatus.Sent]: 'bg-blue-100 text-blue-800',
            [QuotationStatus.Accepted]: 'bg-green-100 text-green-800',
            [QuotationStatus.Rejected]: 'bg-red-100 text-red-800',
            [QuotationStatus.Expired]: 'bg-gray-100 text-gray-800',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };


    return (
        <>
            <div className="space-y-6">
                 <div className="mb-4">
                    <Link to="/sales" className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-main">
                        &larr; Satış Hattına Geri Dön
                    </Link>
                </div>
                <Card>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                            <h2 className="text-3xl font-bold">{deal.title}</h2>
                            <p className="text-text-secondary dark:text-dark-text-secondary mt-1">
                                Müşteri: <Link to={`/customers/${customer?.id}`} className="text-primary-600 hover:underline">{deal.customerName}</Link>
                            </p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                            <p className="text-3xl font-bold text-primary-600">${deal.value.toLocaleString()}</p>
                            <div className="mt-1">{getStageBadge(deal.stage)}</div>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-dark-border grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-text-secondary dark:text-dark-text-secondary">Sorumlu</p>
                            <p className="font-semibold">{deal.assignedToName}</p>
                        </div>
                        <div>
                            <p className="text-text-secondary dark:text-dark-text-secondary">Tahmini Kapanış</p>
                            <p className="font-semibold">{deal.closeDate}</p>
                        </div>
                        <div>
                            <p className="text-text-secondary dark:text-dark-text-secondary">Son Aktivite</p>
                            <p className="font-semibold">{new Date(deal.lastActivityDate).toLocaleDateString('tr-TR')}</p>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card title="Aktivite Zaman Tüneli">
                           <ActivityTimeline dealId={dealId} />
                        </Card>
                    </div>
                     <div className="lg:col-span-1 space-y-6">
                         {canManageDeals && (
                            <Card title="Eylemler">
                                <div className="space-y-2">
                                    <Button onClick={() => setIsDealFormOpen(true, deal)} variant="secondary" className="w-full justify-start"><span className="w-5">{ICONS.edit}</span> Anlaşmayı Düzenle</Button>
                                    <Button onClick={() => handleOpenLogActivityModal(SalesActivityType.Call)} variant="secondary" className="w-full justify-start"><span className="w-5">{ICONS.phoneCall}</span> Arama Kaydet</Button>
                                    <Button onClick={() => handleOpenLogActivityModal(SalesActivityType.Meeting)} variant="secondary" className="w-full justify-start"><span className="w-5">{ICONS.meeting}</span> Toplantı Kaydet</Button>
                                    <Button onClick={handleCreateQuotation} variant="secondary" className="w-full justify-start"><span className="w-5">{ICONS.documents}</span> Teklif Oluştur</Button>
                                    <Button onClick={() => setIsDeleteModalOpen(true)} variant="danger" className="w-full justify-start"><span className="w-5">{ICONS.trash}</span> Anlaşmayı Sil</Button>
                                </div>
                            </Card>
                         )}
                         <Card title="Teklifler">
                             <div className="space-y-2">
                                 {relatedQuotations.length > 0 ? (
                                    relatedQuotations.map(q => (
                                        <div key={q.id} className="p-2 border rounded-md dark:border-dark-border flex justify-between items-center">
                                            <div>
                                                <Link to={`/sales/quotations/edit/${q.id}`} className="font-semibold text-primary-600 hover:underline">{q.quotationNumber}</Link>
                                                <p className="text-xs text-text-secondary">{q.issueDate}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-mono text-sm">${q.grandTotal.toLocaleString()}</p>
                                                {getQuotationStatusBadge(q.status)}
                                            </div>
                                        </div>
                                    ))
                                 ) : (
                                    <p className="text-sm text-center text-text-secondary py-4">Bu anlaşma için henüz teklif oluşturulmadı.</p>
                                 )}
                             </div>
                         </Card>
                         <Card title="Ürünler ve Hizmetler">
                            {deal.lineItems.length > 0 ? (
                                <div className="overflow-x-auto max-h-96">
                                <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-900/50 sticky top-0">
                                    <th className="p-3 font-semibold">Ürün/Hizmet</th>
                                    <th className="p-3 font-semibold text-right">Miktar</th>
                                    <th className="p-3 font-semibold text-right">B. Fiyat</th>
                                    <th className="p-3 font-semibold text-right">Toplam</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deal.lineItems.map((item, index) => (
                                    <tr key={index} className="border-b border-slate-200 last:border-b-0 dark:border-dark-border">
                                        <td className="p-3 font-medium">{item.productName}</td>
                                        <td className="p-3 text-right">{item.quantity}</td>
                                        <td className="p-3 text-right">${item.price.toLocaleString()}</td>
                                        <td className="p-3 text-right font-semibold">${(item.quantity * item.price).toLocaleString()}</td>
                                    </tr>
                                    ))}
                                </tbody>
                                </table>
                                </div>
                            ) : <p className="text-text-secondary dark:text-dark-text-secondary p-4">Bu anlaşmaya ürün eklenmemiş.</p>}
                         </Card>
                         <Card title="İç Yorumlar">
                            <CommentsThread entityType="deal" entityId={deal.id} />
                        </Card>
                     </div>
                </div>
            </div>
            {isLogActivityModalOpen && canManageDeals && (
                <LogActivityModal
                    isOpen={isLogActivityModalOpen}
                    onClose={() => setIsLogActivityModalOpen(false)}
                    dealId={dealId}
                    activityType={activityType}
                />
            )}
            {canManageDeals && (
                 <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    title="Anlaşmayı Sil"
                    message={`'${deal.title}' adlı anlaşmayı kalıcı olarak silmek istediğinizden emin misiniz?`}
                />
            )}
        </>
    );
};

export default DealDetail;
