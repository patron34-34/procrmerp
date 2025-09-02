import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import { DealStage, SalesActivityType } from '../../types';
import ActivityTimeline from '../sales/ActivityTimeline';
import LogActivityModal from '../sales/LogActivityModal';
import Button from '../ui/Button';
import { ICONS } from '../../constants';
import CommentsThread from '../collaboration/CommentsThread';

const DealDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { deals, customers, hasPermission } = useApp();
    const dealId = parseInt(id || '', 10);
    const deal = deals.find(d => d.id === dealId);
    const customer = customers.find(c => c.id === deal?.customerId);
    
    const [isLogActivityModalOpen, setIsLogActivityModalOpen] = useState(false);
    const [activityType, setActivityType] = useState<SalesActivityType>(SalesActivityType.Call);

    const canManageDeals = hasPermission('anlasma:yonet');

    if (!deal) {
        return <Card title="Hata"><p>Anlaşma bulunamadı. Lütfen <Link to="/sales">Satış Hattı'na</Link> geri dönün.</p></Card>;
    }
    
    const handleOpenLogActivityModal = (type: SalesActivityType) => {
        setActivityType(type);
        setIsLogActivityModalOpen(true);
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
                            <p className="font-semibold">{deal.lastActivityDate}</p>
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
        </>
    );
};

export default DealDetail;
