
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import ConfirmationModal from '../../ui/ConfirmationModal';

const PickListDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { pickLists, employees, confirmPickList, hasPermission } = useApp();

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const canManage = hasPermission('toplama-listesi:yonet');

    const pickListId = parseInt(id || '', 10);
    const pickList = pickLists.find(p => p.id === pickListId);

    if (!pickList) {
        return <Card title="Hata"><p>Toplama listesi bulunamadı. <Link to="/sales/pick-lists">Listeye geri dön</Link>.</p></Card>;
    }

    const assignedTo = employees.find(e => e.id === pickList.assignedToId);
    const isCompleted = pickList.status === 'Toplandı';
    
    const handleConfirm = () => {
        confirmPickList(pickList.id);
        setIsConfirmModalOpen(false);
    };


    return (
        <>
        <div className="space-y-6 printable-area">
            <Card>
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <h2 className="text-2xl font-bold">Toplama Listesi: {pickList.pickListNumber}</h2>
                        <p className="text-text-secondary dark:text-dark-text-secondary">Oluşturma Tarihi: {pickList.creationDate}</p>
                        {assignedTo && <p className="text-text-secondary dark:text-dark-text-secondary">Atanan Kişi: {assignedTo.name}</p>}
                    </div>
                    <div className="flex gap-2 no-print">
                        <Button variant="secondary" onClick={() => navigate('/sales/pick-lists')}>&larr; Listeye Dön</Button>
                        <Button onClick={() => window.print()}><span className="flex items-center gap-2">{ICONS.print} Yazdır</span></Button>
                        {canManage && !isCompleted && (
                             <Button onClick={() => setIsConfirmModalOpen(true)}><span className="flex items-center gap-2">{ICONS.check} Toplandığını Onayla</span></Button>
                        )}
                    </div>
                </div>
            </Card>

            <Card title="Toplanacak Ürünler">
                <p className="mb-4 text-sm text-text-secondary dark:text-dark-text-secondary no-print">Ürünler, depodaki en verimli rota için raf konumuna göre sıralanmıştır.</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border">
                            <tr className="bg-slate-50 dark:bg-slate-900/50">
                                <th className="p-3 font-semibold w-12 text-center">Toplandı</th>
                                <th className="p-3 font-semibold">Raf Konumu</th>
                                <th className="p-3 font-semibold">SKU</th>
                                <th className="p-3 font-semibold">Ürün Adı</th>
                                <th className="p-3 font-semibold text-right">Miktar</th>
                                <th className="p-3 font-semibold">Seri/Parti No</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pickList.items.sort((a,b) => (a.binLocation || 'zzz').localeCompare(b.binLocation || 'zzz')).map((item, index) => (
                                <tr key={index} className="border-b dark:border-dark-border last:border-0">
                                    <td className="p-3 text-center">
                                        <div className="w-6 h-6 border-2 border-slate-400 rounded-md inline-block"></div>
                                    </td>
                                    <td className="p-3 font-bold font-mono">{item.binLocation || 'N/A'}</td>
                                    <td className="p-3 font-mono">{item.productSku}</td>
                                    <td className="p-3 font-medium">{item.productName}</td>
                                    <td className="p-3 text-right font-bold text-lg">{item.quantityToPick}</td>
                                    <td className="p-3 text-sm font-mono">
                                        {item.serialNumbers ? (
                                            item.serialNumbers.join(', ')
                                        ) : item.batchNumber ? (
                                            `Parti: ${item.batchNumber}`
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
        <ConfirmationModal
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            onConfirm={handleConfirm}
            title="Toplamayı Onayla"
            message="Bu listedeki tüm ürünlerin toplandığını onaylıyor musunuz? Bu işlem ilgili sevkiyatları 'Sevk Edildi' olarak güncelleyecek ve stoktan düşecektir. Bu işlem geri alınamaz."
        />
        </>
    );
};

export default PickListDetail;
