

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Warehouse } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface WarehouseFormProps {
    isOpen: boolean;
    onClose: () => void;
    warehouse: Warehouse | null;
}

const WarehouseForm: React.FC<WarehouseFormProps> = ({ isOpen, onClose, warehouse }) => {
    const { addWarehouse, updateWarehouse } = useApp();

    const initialFormState: Omit<Warehouse, 'id'> = { name: '', location: '', isDefault: false };
    const [formData, setFormData] = useState(initialFormState);
    
    useEffect(() => {
        if (warehouse) {
            setFormData({ name: warehouse.name, location: warehouse.location, isDefault: warehouse.isDefault || false });
        } else {
            setFormData(initialFormState);
        }
    }, [warehouse, isOpen]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name.trim()) {
            if (warehouse) {
                updateWarehouse({ ...warehouse, ...formData });
            } else {
                addWarehouse(formData);
            }
            onClose();
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={warehouse ? "Depoyu Düzenle" : "Yeni Depo Ekle"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium">Depo Adı *</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                </div>
                <div>
                    <label htmlFor="location" className="block text-sm font-medium">Konum</label>
                    <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                </div>
                <div className="flex items-center">
                    <input type="checkbox" id="isDefault" name="isDefault" checked={formData.isDefault || false} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"/>
                    <label htmlFor="isDefault" className="ml-2 block text-sm">Varsayılan Depo Yap</label>
                </div>
                <div className="flex justify-end pt-4 gap-2">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit">Kaydet</Button>
                </div>
            </form>
        </Modal>
    );
};

export default WarehouseForm;