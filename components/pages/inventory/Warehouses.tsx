import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Warehouse } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import EmptyState from '../../ui/EmptyState';
import ConfirmationModal from '../../ui/ConfirmationModal';
import { ICONS } from '../../../constants';
import WarehouseForm from '../../inventory/WarehouseForm';

const Warehouses: React.FC = () => {
    const { warehouses, deleteWarehouse, hasPermission } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
    const [warehouseToDelete, setWarehouseToDelete] = useState<Warehouse | null>(null);

    const canManage = hasPermission('depo:yonet');
    
    const openModalForNew = () => {
        setEditingWarehouse(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (warehouse: Warehouse) => {
        setEditingWarehouse(warehouse);
        setIsModalOpen(true);
    };
    
    const handleDeleteConfirm = () => {
        if (warehouseToDelete) {
            deleteWarehouse(warehouseToDelete.id);
            setWarehouseToDelete(null);
        }
    };
    
    const actionButtonClasses = "p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors";

    return (
        <>
            <Card
                title="Depolar"
                action={canManage && <Button onClick={openModalForNew}><span className="flex items-center gap-2">{ICONS.add} Yeni Depo Ekle</span></Button>}
            >
                <div className="overflow-x-auto">
                    {warehouses.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                                <th className="p-3 font-semibold">Depo Adı</th>
                                <th className="p-3 font-semibold">Konum</th>
                                <th className="p-3 font-semibold">Varsayılan</th>
                                {canManage && <th className="p-3 font-semibold">Eylemler</th>}
                            </tr></thead>
                            <tbody>
                                {warehouses.map(wh => (
                                    <tr key={wh.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="p-3 font-medium">{wh.name}</td>
                                        <td className="p-3">{wh.location}</td>
                                        <td className="p-3">{wh.isDefault ? 'Evet' : 'Hayır'}</td>
                                        {canManage && <td className="p-3"><div className="flex items-center gap-1">
                                            <button onClick={() => openModalForEdit(wh)} className={`${actionButtonClasses} hover:text-primary-600`}>{ICONS.edit}</button>
                                            <button onClick={() => setWarehouseToDelete(wh)} disabled={wh.isDefault} className={`${actionButtonClasses} hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed`}>{ICONS.trash}</button>
                                        </div></td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState
                            icon={ICONS.warehouse}
                            title="Henüz Depo Oluşturulmamış"
                            description="İlk deponuzu ekleyerek envanterinizi farklı konumlarda yönetmeye başlayın."
                            action={canManage ? <Button onClick={openModalForNew}>Depo Ekle</Button> : undefined}
                        />
                    )}
                </div>
            </Card>
            {canManage && (
                <WarehouseForm
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    warehouse={editingWarehouse}
                />
            )}
             {canManage && (
                <ConfirmationModal 
                    isOpen={!!warehouseToDelete}
                    onClose={() => setWarehouseToDelete(null)}
                    onConfirm={handleDeleteConfirm}
                    title="Depoyu Sil"
                    message={`'${warehouseToDelete?.name}' adlı depoyu kalıcı olarak silmek istediğinizden emin misiniz? Bu depoda stok varsa işlem başarısız olacaktır.`}
                />
            )}
        </>
    );
};

export default Warehouses;