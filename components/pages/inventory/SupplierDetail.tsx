import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { PurchaseOrder } from '../../../types';
import ConfirmationModal from '../../ui/ConfirmationModal';
import SupplierForm from '../../inventory/SupplierForm';

const InfoRow: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => {
    if (value === undefined || value === null || value === '') return null;
    return (
        <div className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
            <dt className="text-text-secondary dark:text-dark-text-secondary">{label}</dt>
            <dd className="col-span-2 text-text-main dark:text-dark-text-main font-medium">{value}</dd>
        </div>
    );
};

const SupplierDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { suppliers, purchaseOrders, hasPermission, deleteSupplier } = useApp();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const supplierId = parseInt(id || '', 10);
    const supplier = useMemo(() => suppliers.find(s => s.id === supplierId), [suppliers, supplierId]);
    
    const canManage = hasPermission('envanter:yonet');
    
    const relatedPurchaseOrders = useMemo(() => {
        return purchaseOrders.filter(po => po.supplierId === supplierId);
    }, [purchaseOrders, supplierId]);

    const handleDeleteConfirm = () => {
        if (canManage && supplier) {
            deleteSupplier(supplier.id);
            setIsDeleteModalOpen(false);
            navigate('/inventory/suppliers');
        }
    };

    if (!supplier) {
        return <Card title="Hata"><p>Tedarikçi bulunamadı. Lütfen <Link to="/inventory/suppliers">Tedarikçiler sayfasına</Link> geri dönün.</p></Card>;
    }

    return (
        <>
            <div className="space-y-6">
                 <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold">{supplier.name}</h2>
                        <div className="flex items-center gap-2 mt-2">
                             {supplier.tags.map(tag => (
                                <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">{tag}</span>
                            ))}
                        </div>
                    </div>
                    {canManage && (
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => setIsFormOpen(true)}>Düzenle</Button>
                            <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>Sil</Button>
                        </div>
                    )}
                </div>
                
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-2 space-y-6">
                       <Card title="İlgili Satın Alma Siparişleri">
                           <div className="overflow-x-auto max-h-96">
                                <table className="w-full text-left text-sm">
                                    <thead><tr className="border-b dark:border-dark-border"><th className="p-2">Sipariş No</th><th className="p-2">Tarih</th><th className="p-2">Durum</th><th className="p-2 text-right">Tutar</th></tr></thead>
                                    <tbody>{relatedPurchaseOrders.map(po => (
                                        <tr key={po.id} className="border-b dark:border-dark-border last:border-0">
                                            <td className="p-2 font-mono"><Link to={`/inventory/purchase-orders/${po.id}/edit`} className="hover:underline text-primary-600">{po.poNumber}</Link></td>
                                            <td className="p-2">{po.orderDate}</td>
                                            <td className="p-2">{po.status}</td>
                                            <td className="p-2 text-right font-mono">${po.totalAmount.toLocaleString()}</td>
                                        </tr>
                                    ))}</tbody>
                                </table>
                           </div>
                       </Card>
                    </div>
                    <div className="lg:col-span-1 space-y-6">
                        <Card title="Tedarikçi Bilgileri">
                             <dl>
                                <InfoRow label="Cari Kodu" value={supplier.accountCode} />
                                <InfoRow label="E-posta" value={<a href={`mailto:${supplier.email}`} className="text-primary-600">{supplier.email}</a>} />
                                <InfoRow label="Telefon" value={supplier.phone} />
                                <InfoRow label="Vergi Dairesi" value={supplier.taxOffice} />
                                <InfoRow label="Vergi/TC No" value={supplier.taxId} />
                                <InfoRow label="IBAN" value={supplier.iban} />
                            </dl>
                        </Card>
                        <Card title="Adres">
                            <address className="not-italic text-sm">
                                {supplier.address.streetAddress}<br/>
                                {supplier.address.district}, {supplier.address.city}<br/>
                                {supplier.address.postalCode} {supplier.address.country}
                            </address>
                        </Card>
                         <Card title="Finansal Detaylar">
                             <dl>
                                <InfoRow label="Para Birimi" value={supplier.currency} />
                                <InfoRow label="Açılış Bakiyesi" value={`${supplier.openingBalance.toLocaleString()} ${supplier.currency}`} />
                                <InfoRow label="Açılış Tarihi" value={supplier.openingDate} />
                             </dl>
                        </Card>
                    </div>
                 </div>
            </div>

            {isFormOpen && canManage && (
                <SupplierForm
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    supplier={supplier}
                />
            )}
            
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Tedarikçiyi Sil"
                message={`'${supplier.name}' adlı tedarikçiyi kalıcı olarak silmek istediğinizden emin misiniz?`}
            />
        </>
    );
};

export default SupplierDetail;
