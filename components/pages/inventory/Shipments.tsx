
import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Shipment, ShipmentStatus } from '../../../types';
import Card from '../../ui/Card';
import EmptyState from '../../ui/EmptyState';
import { ICONS } from '../../../constants';
import { Link } from 'react-router-dom';
import Button from '../../ui/Button';

const Shipments: React.FC = () => {
    const { shipments, createPickList, hasPermission } = useApp();
    const [selectedShipmentIds, setSelectedShipmentIds] = useState<number[]>([]);

    const canManagePickLists = hasPermission('toplama-listesi:yonet');

    const handleSelectOne = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        if (e.target.checked) {
            setSelectedShipmentIds(prev => [...prev, id]);
        } else {
            setSelectedShipmentIds(prev => prev.filter(selectedId => selectedId !== id));
        }
    };
    
    const handleCreatePickList = () => {
        if (selectedShipmentIds.length > 0) {
            createPickList(selectedShipmentIds);
            setSelectedShipmentIds([]);
        }
    };

    const getStatusBadge = (status: ShipmentStatus) => {
        const styles: { [key in ShipmentStatus]: string } = {
            [ShipmentStatus.ReadyToShip]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            [ShipmentStatus.Shipped]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            [ShipmentStatus.Cancelled]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };

    return (
        <Card title="Sevkiyatlar">
            {canManagePickLists && selectedShipmentIds.length > 0 && (
                <div className="p-4 bg-primary-100 dark:bg-primary-900/50 rounded-lg mb-4 flex items-center gap-4">
                    <p className="font-semibold">{selectedShipmentIds.length} sevkiyat seçildi.</p>
                    <Button onClick={handleCreatePickList}>Toplama Listesi Oluştur</Button>
                </div>
            )}
            <div className="overflow-x-auto">
                {shipments.length > 0 ? (
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                            {canManagePickLists && <th className="p-3"></th>}
                            <th className="p-3 font-semibold">Sevkiyat No</th>
                            <th className="p-3 font-semibold">Müşteri</th>
                            <th className="p-3 font-semibold">Satış Siparişi</th>
                            <th className="p-3 font-semibold">Sevkiyat Tarihi</th>
                            <th className="p-3 font-semibold">Durum</th>
                        </tr></thead>
                        <tbody>
                            {shipments.map(shipment => (
                                <tr key={shipment.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    {canManagePickLists && <td className="p-3">
                                        {shipment.status === ShipmentStatus.ReadyToShip && (
                                            <input type="checkbox" checked={selectedShipmentIds.includes(shipment.id)} onChange={(e) => handleSelectOne(e, shipment.id)} />
                                        )}
                                    </td>}
                                    <td className="p-3 font-mono">{shipment.shipmentNumber}</td>
                                    <td className="p-3">
                                        <Link to={`/customers/${shipment.customerId}`} className="hover:underline text-primary-600 dark:text-primary-400">
                                            {shipment.customerName}
                                        </Link>
                                    </td>
                                     <td className="p-3 font-mono">{shipment.salesOrderNumber}</td>
                                    <td className="p-3">{shipment.shipmentDate}</td>
                                    <td className="p-3">{getStatusBadge(shipment.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <EmptyState
                        icon={ICONS.shipment!}
                        title="Henüz Sevkiyat Yok"
                        description="Satış siparişlerinden sevkiyat oluşturulduğunda burada listelenecektir."
                    />
                )}
            </div>
        </Card>
    );
};

export default Shipments;
