
import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { TaxRate } from '../../../types';
import Card from '../../ui/Card';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import ConfirmationModal from '../../ui/ConfirmationModal';
import EmptyState from '../../ui/EmptyState';

const TaxSettings: React.FC = () => {
    const { taxRates, addTaxRate, updateTaxRate, deleteTaxRate, hasPermission } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRate, setEditingRate] = useState<TaxRate | null>(null);
    const [rateToDelete, setRateToDelete] = useState<TaxRate | null>(null);
    
    const canManage = hasPermission('ayarlar:vergi-yonet');

    const initialFormState: Omit<TaxRate, 'id'> = { name: '', rate: 0 };
    const [formData, setFormData] = useState(initialFormState);
    
    const openModalForNew = () => {
        setEditingRate(null);
        setFormData(initialFormState);
        setIsModalOpen(true);
    };

    const openModalForEdit = (rate: TaxRate) => {
        setEditingRate(rate);
        setFormData({ name: rate.name, rate: rate.rate });
        setIsModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'rate' ? (parseFloat(value) / 100) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name.trim() && formData.rate >= 0) {
            if (editingRate) {
                updateTaxRate({ ...editingRate, ...formData });
            } else {
                addTaxRate(formData);
            }
            setIsModalOpen(false);
        }
    };

    const handleDeleteConfirm = () => {
        if (rateToDelete) {
            deleteTaxRate(rateToDelete.id);
            setRateToDelete(null);
        }
    };

    return (
        <>
        <Card
            title="Vergi Oranları Yönetimi"
            action={canManage && <Button onClick={openModalForNew}><span className="flex items-center gap-2">{ICONS.add} Yeni Oran Ekle</span></Button>}
        >
             <p className="mb-4 text-text-secondary dark:text-dark-text-secondary">
                Fatura ve gider fişlerinde kullanılacak KDV gibi vergi oranlarını tanımlayın.
            </p>
            <div className="overflow-x-auto">
                {taxRates.length > 0 ? (
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-3 font-semibold">Vergi Adı</th>
                            <th className="p-3 font-semibold">Oran</th>
                            {canManage && <th className="p-3 font-semibold">Eylemler</th>}
                        </tr></thead>
                        <tbody>
                            {taxRates.map(rate => (
                                <tr key={rate.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="p-3 font-medium">{rate.name}</td>
                                    <td className="p-3 font-mono">{(rate.rate * 100).toFixed(2)}%</td>
                                    {canManage && <td className="p-3"><div className="flex items-center gap-3">
                                        <button onClick={() => openModalForEdit(rate)} className="text-slate-500 hover:text-primary-600">{ICONS.edit}</button>
                                        <button onClick={() => setRateToDelete(rate)} className="text-slate-500 hover:text-red-600">{ICONS.trash}</button>
                                    </div></td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <EmptyState
                        icon={ICONS.tax}
                        title="Henüz Vergi Oranı Tanımlanmamış"
                        description="İlk vergi oranını ekleyerek başlayın."
                        action={canManage ? <Button onClick={openModalForNew}>Vergi Oranı Ekle</Button> : undefined}
                    />
                )}
            </div>
        </Card>
        {canManage && (
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRate ? "Vergi Oranını Düzenle" : "Yeni Vergi Oranı Ekle"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium">Vergi Adı *</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                    </div>
                    <div>
                        <label htmlFor="rate" className="block text-sm font-medium">Oran (%) *</label>
                        <input type="number" id="rate" step="0.01" name="rate" value={formData.rate * 100} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
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
                isOpen={!!rateToDelete}
                onClose={() => setRateToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Vergi Oranını Sil"
                message={`'${rateToDelete?.name}' adlı vergi oranını kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem, bu oranı kullanan hesapları etkileyebilir.`}
            />
        )}
        </>
    );
};

export default TaxSettings;
