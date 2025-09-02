
import React from 'react';
import { useApp } from '../../../context/AppContext';
import { PickList } from '../../../types';
import Card from '../../ui/Card';
import EmptyState from '../../ui/EmptyState';
import { ICONS } from '../../../constants';
import { Link } from 'react-router-dom';

const PickLists: React.FC = () => {
    const { pickLists, employees } = useApp();

    const getStatusBadge = (status: PickList['status']) => {
        const styles: { [key in PickList['status']]: string } = {
            'Beklemede': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            'Toplanıyor': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            'Toplandı': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };

    return (
        <Card title="Toplama Listeleri">
            <div className="overflow-x-auto">
                {pickLists.length > 0 ? (
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-3 font-semibold">Liste No</th>
                            <th className="p-3 font-semibold">Oluşturma Tarihi</th>
                            <th className="p-3 font-semibold">Atanan Kişi</th>
                            <th className="p-3 font-semibold">Sevkiyat Sayısı</th>
                            <th className="p-3 font-semibold">Durum</th>
                            <th className="p-3 font-semibold">Eylemler</th>
                        </tr></thead>
                        <tbody>
                            {pickLists.map(list => {
                                const assignedTo = employees.find(e => e.id === list.assignedToId);
                                return (
                                <tr key={list.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="p-3 font-mono">
                                        <Link to={`/inventory/pick-lists/${list.id}`} className="hover:underline text-primary-600 dark:text-primary-400">
                                            {list.pickListNumber}
                                        </Link>
                                    </td>
                                    <td className="p-3">{list.creationDate}</td>
                                    <td className="p-3">{assignedTo?.name || 'Atanmamış'}</td>
                                    <td className="p-3">{list.relatedShipmentIds.length}</td>
                                    <td className="p-3">{getStatusBadge(list.status)}</td>
                                    <td className="p-3">
                                        <Link to={`/inventory/pick-lists/${list.id}`} className="text-primary-600 hover:underline text-sm">
                                            Detayları Gör
                                        </Link>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                ) : (
                    <EmptyState
                        icon={ICONS.pickList}
                        title="Henüz Toplama Listesi Yok"
                        description="Sevkiyat sayfasından toplama listesi oluşturarak depo operasyonlarınızı başlatın."
                    />
                )}
            </div>
        </Card>
    );
};

export default PickLists;
