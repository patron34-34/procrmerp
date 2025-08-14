

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface ProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onClose, product }) => {
    const { addProduct, updateProduct } = useApp();

    const initialFormState: Omit<Product, 'id'> = {
        sku: '',
        name: '',
        category: '',
        price: 0,
        lowStockThreshold: 10,
        trackBy: 'none',
        binLocation: '',
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (product) {
            setFormData({ ...initialFormState, ...product });
        } else {
            setFormData(initialFormState);
        }
    }, [product, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isNumber = ['price', 'lowStockThreshold'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.sku && formData.category) {
            if (product) {
                updateProduct({ ...product, ...formData });
            } else {
                addProduct(formData);
            }
            onClose();
        } else {
            alert("Lütfen tüm zorunlu alanları doldurun.");
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={product ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="sku" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">SKU *</label>
                        <input type="text" name="sku" id="sku" value={formData.sku} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white"/>
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Ürün Adı *</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white"/>
                    </div>
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Kategori *</label>
                    <input type="text" name="category" id="category" value={formData.category} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="price" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Fiyat ($)</label>
                        <input type="number" step="0.01" name="price" id="price" value={formData.price} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white"/>
                    </div>
                    <div>
                        <label htmlFor="lowStockThreshold" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Düşük Stok Eşiği</label>
                        <input type="number" name="lowStockThreshold" id="lowStockThreshold" value={formData.lowStockThreshold} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white"/>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="trackBy" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Stok Takibi</label>
                        <select name="trackBy" id="trackBy" value={formData.trackBy} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border">
                            <option value="none">Takip Etme</option>
                            <option value="serial">Seri Numarası</option>
                            <option value="batch">Parti Numarası</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="binLocation" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Raf/Koridor</label>
                        <input type="text" name="binLocation" id="binLocation" value={formData.binLocation || ''} onChange={handleInputChange} placeholder="Örn: A5-C12" className="mt-1 block w-full p-2 border border-border rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border"/>
                    </div>
                </div>
                <div className="flex justify-end pt-4 gap-2">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit">{product ? "Güncelle" : "Ekle"}</Button>
                </div>
            </form>
        </Modal>
    );
};

export default ProductForm;