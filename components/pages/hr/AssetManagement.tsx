
import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Asset, AssetStatus } from '../../../types';
import Card from '../../ui/Card';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';

const AssetManagement: React.FC = () => {
    const { assets, employees, addAsset, updateAsset, hasPermission } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

    const canManage = hasPermission('ik:varlik-yonet');
    const today = new Date().toISOString().split('T')[0];

    const initialFormState: Omit<Asset, 'id'> = {
        name: '',
        category: 'Laptop',
        serialNumber: '',
        purchaseDate: today,
        status: AssetStatus.InStorage,
    };
    const [formData, setFormData] = useState(initialFormState);

    const openModalForNew = () => {
        setEditingAsset(null);
        setFormData(initialFormState);
        setIsModalOpen(true);
    };

    const openModalForEdit = (asset: Asset) => {
        setEditingAsset(asset);
        setFormData(asset);
        setIsModalOpen(true);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const finalValue = name.includes('Id') ? parseInt(value) || undefined : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
        
        if (name === "assignedToId" && value) {
            setFormData(prev => ({...prev, assignmentDate: today, status: AssetStatus.InUse}));
        } else if (name === "assignedToId" && !value) {
            setFormData(prev => ({...prev, assignmentDate: undefined, status: AssetStatus.InStorage}));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.serialNumber) {
            if (editingAsset) {
                updateAsset({ ...editingAsset, ...formData });
            } else {
                addAsset(formData);
            }
            setIsModalOpen(false);
        }
    };

    return (
        <>
            <Card
                title="Şirket Varlıkları (Zimmet) Yönetimi"
                action={canManage && <Button onClick={openModalForNew}><span className="flex items-center gap-2">{ICONS.add} Yeni Varlık Ekle</span></Button>}
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-3">Varlık Adı</th><th className="p-3">Seri No</th><th className="p-3">Atanan Kişi</th><th className="p-3">Durum</th>{canManage && <th className="p-3">Eylemler</th>}
                        </tr></thead>
                        <tbody>
                            {assets.map(asset => (
                                <tr key={asset.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="p-3 font-medium">{asset.name}</td>
                                    <td className="p-3 font-mono">{asset.serialNumber}</td>
                                    <td className="p-3">{employees.find(e => e.id === asset.assignedToId)?.name || '-'}</td>
                                    <td className="p-3">{asset.status}</td>
                                    {canManage && <td className="p-3"><button onClick={() => openModalForEdit(asset)} className="text-slate-500 hover:text-primary-600">{ICONS.edit}</button></td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {isModalOpen && canManage && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAsset ? "Varlığı Düzenle" : "Yeni Varlık Ekle"}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium">Varlık Adı *</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
                            <div><label className="block text-sm font-medium">Seri Numarası *</label><input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium">Kategori</label><select name="category" value={formData.category} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"><option>Laptop</option><option>Telefon</option><option>Monitör</option><option>Araç</option><option>Diğer</option></select></div>
                            <div><label className="block text-sm font-medium">Satın Alma Tarihi</label><input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/></div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Atanan Kişi (Zimmet)</label>
                            <select name="assignedToId" value={formData.assignedToId || ''} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                                <option value="">Depoda (Atanmamış)</option>
                                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>
                        <div className="flex justify-end pt-4 gap-2">
                            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>İptal</Button>
                            <Button type="submit">Kaydet</Button>
                        </div>
                    </form>
                </Modal>
            )}
        </>
    );
};

export default AssetManagement;