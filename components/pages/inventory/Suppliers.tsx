
import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Supplier } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import EmptyState from '../../ui/EmptyState';
import ConfirmationModal from '../../ui/ConfirmationModal';
import { ICONS } from '../../../constants';
import SupplierForm from '../../inventory/SupplierForm';
import { Link } from 'react-router-dom';

const Suppliers: React.FC = () => {
    const { suppliers, deleteSupplier, hasPermission } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const canManageInventory = hasPermission('envanter:yonet');
    
    const openModalForNew = () => {
        if (!canManageInventory) return;
        setEditingSupplier(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (supplier: Supplier) => {
        if (!canManageInventory) return;
        setEditingSupplier(supplier);
        setIsModalOpen(true);
    };

    const handleDeleteRequest = (supplier: Supplier) => {
        setSupplierToDelete(supplier);
    };

    const handleDeleteConfirm = () => {
        if (supplierToDelete) {
            deleteSupplier(supplierToDelete.id);
            setSupplierToDelete(null);
        }
    };

    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const actionButtonClasses = "p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors";

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
                                    <th className="p-4 font-semibold">E-posta</th>
                                    <th className="p-4 font-semibold">Telefon</th>
                                    <th className="p-4 font-semibold">Şehir</th>
                                    {canManageInventory && <th className="p-4 font-semibold w-20 text-center">Eylemler</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSuppliers.map((supplier) => (
                                    <tr key={supplier.id} className="border-b border-border dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                                        <td className="p-4 font-medium">
                                            <Link to={`/inventory/suppliers/${supplier.id}`} className="hover:underline text-primary-600">
                                                {supplier.name}
                                            </Link>
                                        </td>
                                        <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{supplier.email}</td>
                                        <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{supplier.phone}</td>
                                        <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{supplier.address.city}</td>
                                        {canManageInventory && (
                                            <td className="p-4 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button onClick={() => openModalForEdit(supplier)} className={`${actionButtonClasses} hover:text-primary-600`}>{ICONS.edit}</button>
                                                    <button onClick={() => handleDeleteRequest(supplier)} className={`${actionButtonClasses} hover:text-red-600`}>{ICONS.trash}</button>
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
                <SupplierForm 
                   isOpen={isModalOpen}
                   onClose={() => setIsModalOpen(false)}
                   supplier={editingSupplier}
                />
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
