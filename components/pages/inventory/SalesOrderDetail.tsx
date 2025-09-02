
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import { SalesOrder, SalesOrderStatus, WorkOrderStatus, ProductType } from '../../../types';
import CommentsThread from '../../collaboration/CommentsThread';
import AllocateStockModal from '../../inventory/AllocateStockModal';
import CreateShipmentModal from '../../inventory/CreateShipmentModal';

type ActiveTab = 'overview' | 'stock' | 'production' | 'notes';

const StatusStep: React.FC<{ title: string; isActive: boolean; isCompleted: boolean }> = ({ title, isActive, isCompleted }) => (
    <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${isCompleted ? 'bg-green-500' : isActive ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
            {isCompleted ? ICONS.check : <span className="font-bold"></span>}
        </div>
        <div className={`ml-3 font-semibold ${isActive || isCompleted ? 'text-text-main dark:text-dark-text-main' : 'text-text-secondary'}`}>{title}</div>
    </div>
);

const SalesOrderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { salesOrders, updateSalesOrderStatus, hasPermission, convertOrderToInvoice, workOrders, products } = useApp();
    
    const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
    const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
    const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);

    const canManage = hasPermission('satis-siparis:yonet');
    const orderId = parseInt(id || '', 10);
    const order = salesOrders.find(o => o.id === orderId);
    
    const relatedWorkOrders = workOrders.filter(wo => order?.workOrderIds?.includes(wo.id));


    if (!order) {
        return <Card title="Hata"><p>Satış Siparişi bulunamadı. <Link to="/inventory/sales-orders">Sipariş listesine</Link> geri dönün.</p></Card>;
    }
    
    const StatusFlowCard: React.FC = () => {
        const stages: SalesOrderStatus[] = [
            SalesOrderStatus.OnayBekliyor,
            SalesOrderStatus.Onaylandı, // Represents stock check/production
            SalesOrderStatus.SevkeHazır,
            SalesOrderStatus.TamamenSevkEdildi,
            SalesOrderStatus.Faturalandı,
        ];
        
        const stageLabels: Record<string, string> = {
            [SalesOrderStatus.OnayBekliyor]: 'Sipariş Alındı',
            [SalesOrderStatus.Onaylandı]: 'Stok/Üretim',
            [SalesOrderStatus.SevkeHazır]: 'Sevke Hazır',
            [SalesOrderStatus.TamamenSevkEdildi]: 'Sevk Edildi',
            [SalesOrderStatus.Faturalandı]: 'Faturalandı',
        }
        
        let currentStageIndex = stages.indexOf(order.status);
        if ([SalesOrderStatus.StokBekleniyor, SalesOrderStatus.UretimBekleniyor].includes(order.status)) {
            currentStageIndex = 1;
        } else if (order.status === SalesOrderStatus.KısmenSevkEdildi) {
             currentStageIndex = 2;
        }


        let actionButton = null;
        let statusDescription = "";

        const physicalItems = order.items.filter(item => products.find(p => p.id === item.productId)?.productType !== ProductType.Hizmet);
        const totalOrdered = physicalItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalCommitted = physicalItems.reduce((sum, item) => sum + item.committedStockItemIds.length, 0);
        const totalShipped = physicalItems.reduce((sum, item) => sum + item.shippedQuantity, 0);
        const needsAllocation = totalOrdered > totalCommitted;
        const needsShipping = totalCommitted > totalShipped;


        switch (order.status) {
            case SalesOrderStatus.OnayBekliyor:
                actionButton = <Button onClick={() => updateSalesOrderStatus(order.id, SalesOrderStatus.Onaylandı)}>Siparişi Onayla</Button>;
                statusDescription = "Siparişiniz alındı ve onayınızı bekliyor. Onayladıktan sonra stok durumu kontrol edilecek.";
                break;
            case SalesOrderStatus.StokBekleniyor:
                 if (needsAllocation) {
                    actionButton = <Button onClick={() => setIsAllocateModalOpen(true)}>Stok Ayır</Button>;
                 }
                statusDescription = "Siparişinizdeki bazı ürünler için yeterli stok bulunmuyor. Stok girişi yapıldığında veya manuel olarak stok ayırdığınızda devam edebilirsiniz.";
                break;
            case SalesOrderStatus.UretimBekleniyor:
                statusDescription = "Siparişiniz için üretim yapılması gerekiyor. İlgili iş emirleri tamamlandığında süreç devam edecektir.";
                break;
            case SalesOrderStatus.SevkeHazır:
            case SalesOrderStatus.KısmenSevkEdildi:
                 if (needsShipping) {
                    actionButton = <Button onClick={() => setIsShipmentModalOpen(true)}>Sevkiyat Oluştur</Button>;
                 }
                statusDescription = "Ürünleriniz depoda sizin için ayrıldı ve sevkiyata hazır. Sevkiyatı başlatabilirsiniz.";
                break;
            case SalesOrderStatus.TamamenSevkEdildi:
                 actionButton = <Button onClick={() => convertOrderToInvoice(order.id)}>Faturalandır</Button>;
                 statusDescription = "Tüm ürünler sevk edildi. Şimdi faturasını oluşturabilirsiniz.";
                break;
             case SalesOrderStatus.Faturalandı:
                 statusDescription = "Bu sipariş süreci başarıyla tamamlanmıştır.";
                break;
             case SalesOrderStatus.İptalEdildi:
                 statusDescription = "Bu sipariş iptal edilmiştir.";
                break;
        }

        return (
            <Card>
                <div className="flex justify-between items-center flex-wrap gap-4">
                    {stages.map((stage, index) => (
                        <React.Fragment key={stage}>
                            <StatusStep title={stageLabels[stage]} isActive={index === currentStageIndex} isCompleted={index < currentStageIndex} />
                            {index < stages.length - 1 && <div className="flex-1 h-0.5 bg-slate-200 dark:bg-slate-700"></div>}
                        </React.Fragment>
                    ))}
                </div>
                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-text-main dark:text-dark-text-main">Mevcut Durum: {order.status}</p>
                        <p className="text-sm text-text-secondary mt-1">{statusDescription}</p>
                    </div>
                    {canManage && <div>{actionButton}</div>}
                </div>
            </Card>
        );
    }
    
    const TabButton: React.FC<{ tabName: ActiveTab, label: string }> = ({ tabName, label }) => (
         <button 
            onClick={() => setActiveTab(tabName)} 
            className={`${activeTab === tabName ? 'border-primary-500 text-primary-600' : 'border-transparent text-text-secondary hover:border-slate-300'} whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm`}
        >
            {label}
        </button>
    );

    const renderTabContent = () => {
        switch(activeTab) {
            case 'overview':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                             <Card title="Sipariş Kalemleri">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50 text-sm">
                                            <th className="p-2 font-semibold">Ürün</th>
                                            <th className="p-2 font-semibold text-center">Sipariş</th>
                                            <th className="p-2 font-semibold text-right">Birim Fiyat</th>
                                            <th className="p-2 font-semibold text-right">Toplam</th>
                                        </tr></thead>
                                        <tbody>
                                            {order.items.map(item => {
                                                const lineTotal = item.quantity * item.price * (1 - item.discountRate / 100) * (1 + item.taxRate / 100);
                                                return (
                                                <tr key={item.productId} className="border-b dark:border-dark-border last:border-b-0">
                                                    <td className="p-2 font-medium">{item.productName}</td>
                                                    <td className="p-2 text-center font-semibold">{item.quantity}</td>
                                                    <td className="p-2 text-right font-mono">${item.price.toLocaleString()}</td>
                                                    <td className="p-2 text-right font-mono font-semibold">${lineTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                                </tr>
                                            )})}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>
                        <div className="lg:col-span-1 space-y-6">
                            <Card title="Finansal Özet">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span>Ara Toplam:</span><span className="font-mono">${order.subTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                                    <div className="flex justify-between"><span>İndirim:</span><span className="font-mono text-red-500">-${order.totalDiscount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                                    <div className="flex justify-between"><span>Vergi:</span><span className="font-mono">${order.totalTax.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                                    <div className="flex justify-between"><span>Kargo:</span><span className="font-mono">${order.shippingCost.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2 dark:border-slate-600"><span>Genel Toplam:</span><span className="font-mono">${order.grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                                </div>
                            </Card>
                            <Card title="Adres Bilgileri">
                                <div className="space-y-4">
                                    <div><h4 className="font-semibold">Fatura Adresi</h4><address className="not-italic text-sm text-text-secondary">{order.billingAddress.streetAddress}, {order.billingAddress.district}, {order.billingAddress.city}</address></div>
                                    <div><h4 className="font-semibold">Teslimat Adresi</h4><address className="not-italic text-sm text-text-secondary">{order.shippingAddress.streetAddress}, {order.shippingAddress.district}, {order.shippingAddress.city}</address></div>
                                </div>
                            </Card>
                        </div>
                    </div>
                );
            case 'stock':
                 return (
                    <Card title="Stok ve Sevkiyat Detayları">
                       <table className="w-full text-left">
                            <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50 text-sm">
                                <th className="p-2 font-semibold">Ürün</th>
                                <th className="p-2 font-semibold text-center">Sipariş Edilen</th>
                                <th className="p-2 font-semibold text-center">Ayrılan</th>
                                <th className="p-2 font-semibold text-center">Sevk Edilen</th>
                            </tr></thead>
                            <tbody>
                                {order.items.map(item => {
                                    const product = products.find(p => p.id === item.productId);
                                    if(product?.productType === ProductType.Hizmet) return null;
                                    return (
                                        <tr key={item.productId} className="border-b dark:border-dark-border last:border-b-0">
                                            <td className="p-2 font-medium">{item.productName}</td>
                                            <td className="p-2 text-center font-semibold">{item.quantity}</td>
                                            <td className="p-2 text-center text-blue-600">{item.committedStockItemIds.length}</td>
                                            <td className="p-2 text-center text-green-600">{item.shippedQuantity}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </Card>
                );
            case 'production':
                if (relatedWorkOrders.length === 0) {
                    return <Card title="Üretim"><p className="text-text-secondary">Bu siparişle ilişkili iş emri bulunmuyor.</p></Card>
                }
                return (
                    <Card title="İlgili İş Emirleri">
                        <div className="space-y-2">
                            {relatedWorkOrders.map(wo => (
                                <div key={wo.id} className="p-2 border rounded-md dark:border-dark-border flex justify-between items-center">
                                    <div>
                                        <Link to={`/manufacturing/work-orders/${wo.id}/edit`} className="font-semibold text-primary-600 hover:underline">{wo.workOrderNumber}</Link>
                                        <p className="text-sm">{wo.productName} (x{wo.quantityToProduce})</p>
                                    </div>
                                    <span className="text-sm font-medium">{wo.status}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                );
            case 'notes':
                 return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card title="Sipariş Notları">
                            <p className="text-sm text-text-secondary">{order.notes || 'Bu sipariş için özel bir not eklenmemiş.'}</p>
                        </Card>
                         <Card title="Yorumlar">
                            <CommentsThread entityType="sales_order" entityId={order.id} />
                        </Card>
                    </div>
                );
            default: return null;
        }
    }


    return (
        <>
            <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Sipariş: {order.orderNumber}</h2>
                        <Link to={`/customers/${order.customerId}`} className="text-primary-600 hover:underline">{order.customerName}</Link>
                    </div>
                    <Button variant="secondary" onClick={() => navigate('/inventory/sales-orders')}>&larr; Sipariş Listesine Dön</Button>
                </div>

                <StatusFlowCard />

                <div className="border-b border-slate-200 dark:border-dark-border">
                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                        <TabButton tabName="overview" label="Genel Bakış" />
                        <TabButton tabName="stock" label="Stok & Sevkiyat" />
                        <TabButton tabName="production" label="Üretim" />
                        <TabButton tabName="notes" label="Notlar & Yorumlar" />
                    </nav>
                </div>
                
                <div className="mt-4">
                    {renderTabContent()}
                </div>

            </div>

            {canManage && (
                <>
                    <AllocateStockModal
                        isOpen={isAllocateModalOpen}
                        onClose={() => setIsAllocateModalOpen(false)}
                        salesOrder={order}
                    />
                    <CreateShipmentModal
                        isOpen={isShipmentModalOpen}
                        onClose={() => setIsShipmentModalOpen(false)}
                        salesOrder={order}
                    />
                </>
            )}
        </>
    );
};

export default SalesOrderDetail;
