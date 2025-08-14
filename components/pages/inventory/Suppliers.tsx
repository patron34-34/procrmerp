import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { Supplier } from '../../../types';
import Card from '../../ui/Card';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import EmptyState from '../../ui/EmptyState';
import ConfirmationModal from '../../ui/ConfirmationModal';
import { ICONS } from '../../../constants';

const Suppliers: React.FC = () => {
    const { suppliers, addSupplier, updateSupplier, deleteSupplier, hasPermission } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const canManageInventory = hasPermission('envanter:yonet');

    const initialFormState: Omit<Supplier, 'id'> = {
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const resetForm = () => {
        setFormData(initialFormState);
        setEditingSupplier(null);
    };

    const openModalForNew = () => {
        if (!canManageInventory) return;
        resetForm();
        setIsModalOpen(true);
    };

    const openModalForEdit = (supplier: Supplier) => {
        if (!canManageInventory) return;
        setEditingSupplier(supplier);
        setFormData(supplier);
        setIsModalOpen(true);
        setOpenMenuId(null);
    };

    const handleDeleteRequest = (supplier: Supplier) => {
        setSupplierToDelete(supplier);
        setOpenMenuId(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.email) {
            if (editingSupplier) {
                updateSupplier({ ...editingSupplier, ...formData });
            } else {
                addSupplier(formData);
            }
            setIsModalOpen(false);
        }
    };

    const handleDeleteConfirm = () => {
        if (supplierToDelete) {
            deleteSupplier(supplierToDelete.id);
            setSupplierToDelete(null);
        }
    };

    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Card
                title="Tüm Tedarikçiler"
                action={canManageInventory ? <Button onClick={openModalForNew}><span className="flex items-center gap-2">{ICONS.add} Yeni Tedarikçi</span></Button> : undefined}
            >
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Tedarikçi ara..."
                        className="w-full md:w-1/3 p-2 border border-border rounded-md dark:bg-slate-700 dark:border-dark-border"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto">
                    {filteredSuppliers.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="border-b dark:border-dark-border">
                                <tr className="bg-slate-50 dark:bg-slate-900/50">
                                    <th className="p-4 font-semibold">Tedarikçi Adı</th>
                                    <th className="p-4 font-semibold">İlgili Kişi</th>
                                    <th className="p-4 font-semibold">E-posta</th>
                                    <th className="p-4 font-semibold">Telefon</th>
                                    {canManageInventory && <th className="p-4 font-semibold w-20 text-center">Eylemler</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSuppliers.map((supplier) => (
                                    <tr key={supplier.id} className="border-b border-border dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                                        <td className="p-4 font-medium">{supplier.name}</td>
                                        <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{supplier.contactPerson}</td>
                                        <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{supplier.email}</td>
                                        <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{supplier.phone}</td>
                                        {canManageInventory && (
                                            <td className="p-4 text-center">
                                                <div className="relative">
                                                    <button onClick={() => setOpenMenuId(openMenuId === supplier.id ? null : supplier.id)} className="text-slate-500 hover:text-slate-700 p-1 rounded-full">
                                                        {ICONS.ellipsisVertical}
                                                    </button>
                                                    {openMenuId === supplier.id && (
                                                        <div ref={menuRef} className="absolute right-0 mt-2 w-48 bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-md shadow-lg z-20">
                                                            <ul className="py-1">
                                                                <li><button onClick={() => openModalForEdit(supplier)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800">{ICONS.edit} Düzenle</button></li>
                                                                <li><button onClick={() => handleDeleteRequest(supplier)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800">{ICONS.trash} Sil</button></li>
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState
                            icon={ICONS.suppliers}
                            title="Henüz Tedarikçi Yok"
                            description="İlk tedarikçinizi ekleyerek satın alma sürecinizi yönetmeye başlayın."
                            action={canManageInventory ? <Button onClick={openModalForNew}>Tedarikçi Ekle</Button> : undefined}
                        />
                    )}
                </div>
            </Card>

            {canManageInventory && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSupplier ? "Tedarikçiyi Düzenle" : "Yeni Tedarikçi Ekle"}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium">Tedarikçi Adı *</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="contactPerson" className="block text-sm font-medium">İlgili Kişi</label>
                                <input type="text" name="contactPerson" id="contactPerson" value={formData.contactPerson} onChange={handleInputChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium">E-posta *</label>
                                <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required className="mt-1 block w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium">Telefon</label>
                            <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                        </div>
                        <div className="flex justify-end pt-4 gap-2">
                            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>İptal</Button>
                            <Button type="submit">{editingSupplier ? "Güncelle" : "Ekle"}</Button>
                        </div>
                    </form>
                </Modal>
            )}

            {canManageInventory && (
                <ConfirmationModal
                    isOpen={!!supplierToDelete}
                    onClose={() => setSupplierToDelete(null)}
                    onConfirm={handleDeleteConfirm}
                    title="Tedarikçiyi Sil"
                    message={`'${supplierToDelete?.name}' adlı tedarikçiyi kalıcı olarak silmek istediğinizden emin misiniz?`}
                />
            )}
        </>
    );
};

export default Suppliers;
