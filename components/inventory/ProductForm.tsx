import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ProductType, EInvoiceType, Unit, Currency } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface ProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onClose, product }) => {
    const { addProduct, updateProduct, warehouses } = useApp();

    const initialFormState: Omit<Product, 'id'> = {
        productType: ProductType.TicariMal,
        eInvoiceType: EInvoiceType.Urun,
        name: '',
        sku: '',
        unit: Unit.Adet,
        category: '',
        price: 0,
        lowStockThreshold: 10,
        trackBy: 'none',
        binLocation: '',
        financials: {
            purchasePrice: 0,
            purchaseCurrency: 'TRY',
            salePrice: 0,
            saleCurrency: 'TRY',
            vatRate: 20,
        },
    };
    const [formData, setFormData] = useState(initialFormState);
    const [initialStock, setInitialStock] = useState({
        warehouseId: warehouses.find(w => w.isDefault)?.id || warehouses[0]?.id || 0,
        quantity: 0
    });

    useEffect(() => {
        if (product) {
            setFormData({ ...initialFormState, ...product });
        } else {
            setFormData(initialFormState);
            setInitialStock({
                warehouseId: warehouses.find(w => w.isDefault)?.id || warehouses[0]?.id || 0,
                quantity: 0
            });
        }
    }, [product, isOpen, warehouses]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name.includes('.')) {
            const [objectName, fieldName] = name.split('.');
            setFormData(prev => {
                const isNumeric = ['purchasePrice', 'salePrice', 'vatRate'].includes(fieldName);
                const updatedObject = {
                    ...prev,
                    [objectName]: { 
                        ...(prev as any)[objectName], 
                        [fieldName]: isNumeric ? parseFloat(value) || 0 : value 
                    }
                };
                if (fieldName === 'salePrice') {
                    updatedObject.price = parseFloat(value) || 0;
                }
                return updatedObject;
            });
        } else {
            const isNumber = ['lowStockThreshold'].includes(name);
            setFormData(prev => ({ ...prev, [name]: isNumber ? parseInt(value) || 0 : value as any }));
        }
    };

    const handleInitialStockChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setInitialStock(prev => ({ ...prev, [name]: Number(value) }));
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.sku && formData.category) {
             const finalData = {
                ...formData,
                price: formData.financials.salePrice,
            };
            if (product) {
                updateProduct({ ...product, ...finalData });
            } else {
                addProduct(finalData, initialStock.quantity > 0 ? initialStock : undefined);
            }
            onClose();
        } else {
            alert("Lütfen tüm zorunlu alanları doldurun.");
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={product ? "Ürünü Düzenle" : "Yeni Ürün Ekle"} size="3xl">
            <form onSubmit={handleSubmit} className="space-y-4">
                 <details open>
                    <summary className="font-semibold text-lg py-2 cursor-pointer">Genel Bilgiler</summary>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                        <InputField label="Ürün/Hizmet Adı *" name="name" value={formData.name} onChange={handleInputChange} required />
                        <InputField label="Stok Kodu (SKU) *" name="sku" value={formData.sku} onChange={handleInputChange} required />
                        <InputField label="Kategori *" name="category" value={formData.category} onChange={handleInputChange} required />
                        <SelectField label="Ürün Tipi" name="productType" value={formData.productType} onChange={handleInputChange} options={Object.values(ProductType)} />
                        <SelectField label="e-Fatura Tipi" name="eInvoiceType" value={formData.eInvoiceType} onChange={handleInputChange} options={Object.values(EInvoiceType)} />
                        <SelectField label="Birim" name="unit" value={formData.unit} onChange={handleInputChange} options={Object.values(Unit)} />
                        <InputField label="Marka" name="brand" value={formData.brand || ''} onChange={handleInputChange} />
                        <InputField label="Model" name="model" value={formData.model || ''} onChange={handleInputChange} />
                    </div>
                </details>

                <details open>
                    <summary className="font-semibold text-lg py-2 cursor-pointer">Finansal Bilgiler</summary>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                        <InputField label="Alış Fiyatı" name="financials.purchasePrice" type="number" step="0.01" value={formData.financials.purchasePrice} onChange={handleInputChange} />
                        <SelectField label="Alış Para Birimi" name="financials.purchaseCurrency" value={formData.financials.purchaseCurrency} onChange={handleInputChange} options={['TRY', 'USD', 'EUR']} />
                        <InputField label="Satış Fiyatı" name="financials.salePrice" type="number" step="0.01" value={formData.financials.salePrice} onChange={handleInputChange} />
                        <SelectField label="Satış Para Birimi" name="financials.saleCurrency" value={formData.financials.saleCurrency} onChange={handleInputChange} options={['TRY', 'USD', 'EUR']} />
                        <InputField label="KDV Oranı (%)" name="financials.vatRate" type="number" value={formData.financials.vatRate} onChange={handleInputChange} />
                    </div>
                </details>
                
                <details>
                    <summary className="font-semibold text-lg py-2 cursor-pointer">Envanter Bilgileri</summary>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                        <InputField label="Düşük Stok Eşiği" name="lowStockThreshold" type="number" value={formData.lowStockThreshold} onChange={handleInputChange} />
                        <SelectField label="Stok Takibi" name="trackBy" value={formData.trackBy} onChange={handleInputChange} options={['none', 'serial', 'batch']} />
                        <InputField label="Raf/Koridor" name="binLocation" value={formData.binLocation || ''} onChange={handleInputChange} placeholder="Örn: A5-C12" />
                    </div>
                </details>
                
                {!product && (
                     <details>
                        <summary className="font-semibold text-lg py-2 cursor-pointer">Başlangıç Stoku (Opsiyonel)</summary>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            <div>
                                <label className="block text-sm font-medium">Depo</label>
                                <select name="warehouseId" value={initialStock.warehouseId} onChange={handleInitialStockChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                                    {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Mevcut Miktar</label>
                                <input type="number" name="quantity" value={initialStock.quantity} onChange={handleInitialStockChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" />
                            </div>
                        </div>
                    </details>
                )}


                <div className="flex justify-end pt-4 gap-2 border-t dark:border-dark-border">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit">{product ? "Güncelle" : "Ekle"}</Button>
                </div>
            </form>
        </Modal>
    );
};

const InputField: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium">{label}</label>
        <input {...props} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
    </div>
);

const SelectField: React.FC<any> = ({ label, options, ...props }) => (
    <div>
        <label className="block text-sm font-medium">{label}</label>
        <select {...props} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);


export default ProductForm;