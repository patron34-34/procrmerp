

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { CostCenter } from '../../../types';
import Card from '../../ui/Card';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import ConfirmationModal from '../../ui/ConfirmationModal';
import EmptyState from '../../ui/EmptyState';

const CostCentersSettings: React.FC = () => {
    const { costCenters, addCostCenter, updateCostCenter, deleteCostCenter, hasPermission } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCostCenter, setEditingCostCenter] = useState<CostCenter | null>(null);
    const [costCenterToDelete, setCostCenterToDelete] = useState<CostCenter | null>(null);
    const [name, setName] = useState('');

    const canManage = hasPermission('ayarlar:maliyet-merkezi-yonet');

    const openModalForNew = () => {
        setEditingCostCenter(null);
        setName('');
        setIsModalOpen(true);
    };

    const openModalForEdit = (costCenter: CostCenter) => {
        setEditingCostCenter(costCenter);
        setName(costCenter.name);
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            if (editingCostCenter) {
                updateCostCenter({ ...editingCostCenter, name });
            } else {
                addCostCenter({ name });
            }
            setIsModalOpen(false);
        }
    };

    const handleDeleteConfirm = () => {
        if (costCenterToDelete) {
            deleteCostCenter(costCenterToDelete.id);
            setCostCenterToDelete(null);
        }
    };

    return (
        <>
            <Card
                title="Maliyet Merkezleri"
                action={canManage && <Button onClick={openModalForNew}><span className="flex items-center gap-2">{ICONS.add} Yeni Ekle</span></Button>}
            >
                <p className="mb-4 text-text-secondary dark:text-dark-text-secondary">
                    Giderlerinizi ve gelirlerinizi departmanlara, projelere veya diğer iş birimlerine göre izlemek için maliyet merkezleri oluşturun.
                </p>
                <div className="overflow-x-auto">
                    {costCenters.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                                <th className="p-3 font-semibold">Maliyet Merkezi Adı</th>
                                {canManage && <th className="p-3 font-semibold">Eylemler</th>}
                            </tr></thead>
                            <tbody>
                                {costCenters.map(cc => (
                                    <tr key={cc.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="p-3 font-medium">{cc.name}</td>
                                        {canManage && <td className="p-3"><div className="flex items-center gap-3">
                                            <button onClick={() => openModalForEdit(cc)} className="text-slate-500 hover:text-primary-600">{ICONS.edit}</button>
                                            <button onClick={() => setCostCenterToDelete(cc)} className="text-slate-500 hover:text-red-600">{ICONS.trash}</button>
                                        </div></td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                         <EmptyState
                            icon={ICONS.costCenter}
                            title="Henüz Maliyet Merkezi Yok"
                            description="İlk maliyet merkezinizi ekleyerek gider takibini detaylandırın."
                            action={canManage ? <Button onClick={openModalForNew}>Maliyet Merkezi Ekle</Button> : undefined}
                        />
                    )}
                </div>
            </Card>

            {canManage && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCostCenter ? "Maliyet Merkezini Düzenle" : "Yeni Maliyet Merkezi Ekle"}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium">Ad *</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                            />
                        </div>
                        <div className="flex justify-end pt-4 gap-2">
                            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>İptal</Button>
                            <Button type="submit">Kaydet</Button>
                        </div>
                    </form>
                </Modal>
            )}

            {canManage && (
                <ConfirmationModal 
                    isOpen={!!costCenterToDelete}
                    onClose={() => setCostCenterToDelete(null)}
                    onConfirm={handleDeleteConfirm}
                    title="Maliyet Merkezini Sil"
                    message={`'${costCenterToDelete?.name}' adlı maliyet merkezini kalıcı olarak silmek istediğinizden emin misiniz?`}
                />
            )}
        </>
    );
};

export default CostCentersSettings;
