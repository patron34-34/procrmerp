

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { CustomFieldDefinition } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import ConfirmationModal from '../../ui/ConfirmationModal';
import CustomFieldFormModal from '../../settings/CustomFieldFormModal';


const CustomFieldsSettings: React.FC = () => {
    const { customFieldDefinitions, deleteCustomField, hasPermission } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingField, setEditingField] = useState<CustomFieldDefinition | null>(null);
    const [fieldToDelete, setFieldToDelete] = useState<CustomFieldDefinition | null>(null);
    
    const canManage = hasPermission('ayarlar:genel-yonet');

    const openModalForNew = () => {
        setEditingField(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (field: CustomFieldDefinition) => {
        setEditingField(field);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (fieldToDelete) {
            deleteCustomField(fieldToDelete.id);
            setFieldToDelete(null);
        }
    };

    return (
        <>
            <Card
                title="Özel Alanlar"
                action={canManage && <Button onClick={openModalForNew}><span className="flex items-center gap-2">{ICONS.add} Yeni Alan Ekle</span></Button>}
            >
                <p className="mb-4 text-text-secondary dark:text-dark-text-secondary">
                    Müşteri, anlaşma veya proje kayıtlarınıza özel bilgi alanları ekleyerek sistemi ihtiyaçlarınıza göre özelleştirin.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-3 font-semibold">Alan Adı</th>
                            <th className="p-3 font-semibold">Türü</th>
                            <th className="p-3 font-semibold">Uygulandığı Modül</th>
                            {canManage && <th className="p-3 font-semibold">Eylemler</th>}
                        </tr></thead>
                        <tbody>
                            {customFieldDefinitions.map(field => (
                                <tr key={field.id} className="border-b dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="p-3 font-medium">{field.name}</td>
                                    <td className="p-3">{field.type}</td>
                                    <td className="p-3">{field.appliesTo}</td>
                                    {canManage && <td className="p-3"><div className="flex items-center gap-3">
                                        <button onClick={() => openModalForEdit(field)} className="text-slate-500 hover:text-primary-600">{ICONS.edit}</button>
                                        <button onClick={() => setFieldToDelete(field)} className="text-slate-500 hover:text-red-600">{ICONS.trash}</button>
                                    </div></td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            {isModalOpen && canManage && (
                <CustomFieldFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    field={editingField}
                />
            )}
             {canManage && <ConfirmationModal 
                isOpen={!!fieldToDelete}
                onClose={() => setFieldToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Özel Alanı Sil"
                message={`'${fieldToDelete?.name}' adlı özel alanı kalıcı olarak silmek istediğinizden emin misiniz? Bu alanın kullanıldığı tüm kayıtlardan veri kaybı yaşanacaktır.`}
            />}
        </>
    );
};

export default CustomFieldsSettings;