
import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { PriceList } from '../../../types';
import Card from '../../ui/Card';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import ConfirmationModal from '../../ui/ConfirmationModal';
import EmptyState from '../../ui/EmptyState';
import { Link } from 'react-router-dom';

const PriceListsSettings: React.FC = () => {
    const { priceLists, addPriceList, updatePriceList, deletePriceList, hasPermission } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingList, setEditingList] = useState<PriceList | null>(null);
    const [listToDelete, setListToDelete] = useState<PriceList | null>(null);
    
    const canManage = hasPermission('ayarlar:genel-yonet');

    const initialFormState: Omit<PriceList, 'id'> = { name: '', currency: 'TRY', isDefault: false };
    const [formData, setFormData] = useState(initialFormState);
    
    const openModalForNew = () => {
        setEditingList(null);
        setFormData(initialFormState);
        setIsModalOpen(true);
    };

    const openModalForEdit = (list: PriceList) => {
        setEditingList(list);
        setFormData({ name: list.name, currency: list.currency, isDefault: list.isDefault });
        setIsModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name.trim()) {
            if (editingList) {
                updatePriceList({ ...editingList, ...formData });
            } else {
                addPriceList(formData);
            }
            setIsModalOpen(false);
        }
    };

    const handleDeleteConfirm = () => {
        if (listToDelete) {
            deletePriceList(listToDelete.id);
            setListToDelete(null);
        }
    };

    return (
        <>
        <Card
            title="Fiyat Listeleri Yönetimi"
            action={canManage && <Button onClick={openModalForNew}><span className="flex items-center gap-2">{ICONS.add} Yeni Liste Ekle</span></Button>}
        >
             <p className="mb-4 text-text-secondary dark:text-dark-text-secondary">
                Farklı müşteri grupları veya para birimleri için özel fiyat listeleri oluşturun ve yönetin.
            </p>
            <div className="overflow-x-auto">
                {priceLists.length > 0 ? (
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-3 font-semibold">Liste Adı</th>
                            <th className="p-3 font-semibold">Para Birimi</th>
                            <th className="p-3 font-semibold">Varsayılan</th>
                            {canManage && <th className="p-3 font-semibold">Eylemler</th>}
                        </tr></thead>
                        <tbody>
                            {priceLists.map(list => (
                                <tr key={list.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="p-3 font-medium">
                                        <Link to={`/admin/settings/price-lists/${list.id}`} className="hover:underline text-primary-600 dark:text-primary-400">
                                            {list.name}
                                        </Link>
                                    </td>
                                    <td className="p-3">{list.currency}</td>
                                    <td className="p-3">{list.isDefault ? 'Evet' : 'Hayır'}</td>
                                    {canManage && <td className="p-3"><div className="flex items-center gap-3">
                                        <button onClick={() => openModalForEdit(list)} className="text-slate-500 hover:text-primary-600">{ICONS.edit}</button>
                                        {!list.isDefault && <button onClick={() => setListToDelete(list)} className="text-slate-500 hover:text-red-600">{ICONS.trash}</button>}
                                    </div></td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <EmptyState
                        icon={ICONS.priceList}
                        title="Henüz Fiyat Listesi Oluşturulmamış"
                        description="İlk fiyat listenizi ekleyerek başlayın."
                        action={canManage ? <Button onClick={openModalForNew}>Fiyat Listesi Ekle</Button> : undefined}
                    />
                )}
            </div>
        </Card>
        {canManage && (
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingList ? "Fiyat Listesini Düzenle" : "Yeni Fiyat Listesi Ekle"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium">Liste Adı *</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                    </div>
                    <div>
                        <label htmlFor="currency" className="block text-sm font-medium">Para Birimi *</label>
                        <select id="currency" name="currency" value={formData.currency} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                            <option value="TRY">TRY</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>
                     <div className="flex items-center">
                        <input type="checkbox" id="isDefault" name="isDefault" checked={formData.isDefault} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"/>
                        <label htmlFor="isDefault" className="ml-2 block text-sm">Varsayılan Fiyat Listesi Yap</label>
                    </div>
                    <p className="text-xs text-slate-500">
                        Bir listeyi varsayılan yapmak, diğerlerini varsayılan olmaktan çıkaracaktır.
                    </p>
                    <div className="flex justify-end pt-4 gap-2">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>İptal</Button>
                        <Button type="submit">Kaydet</Button>
                    </div>
                </form>
            </Modal>
        )}
        {canManage && (
            <ConfirmationModal 
                isOpen={!!listToDelete}
                onClose={() => setListToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Fiyat Listesini Sil"
                message={`'${listToDelete?.name}' adlı fiyat listesini kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
            />
        )}
        </>
    );
};

export default PriceListsSettings;
