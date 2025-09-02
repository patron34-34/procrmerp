import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { BillOfMaterials, BomItem, ProductType } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import ProductSelector from '../../inventory/ProductSelector';
import { useNotification } from '../../../context/NotificationContext';

const BomForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { boms, products, addBom, updateBom } = useApp();
    const { addToast } = useNotification();

    const isEditMode = !!id;
    const existingBom = isEditMode ? boms.find(b => b.id === parseInt(id)) : null;

    const initialFormState: Omit<BillOfMaterials, 'id' | 'productName'> = {
        productId: 0,
        items: [{ productId: 0, productName: '', quantity: 1 }],
    };
    
    const [formData, setFormData] = useState(initialFormState);
    
    useEffect(() => {
        if (isEditMode && existingBom) {
            setFormData({
                productId: existingBom.productId,
                items: existingBom.items,
            });
        } else {
            setFormData(initialFormState);
        }
    }, [id, existingBom, isEditMode]);

    const handleProductChange = (productId: number) => {
        setFormData(prev => ({ ...prev, productId }));
    };

    const handleItemChange = (index: number, field: keyof BomItem, value: any) => {
        const newItems = [...formData.items];
        const item = { ...newItems[index] };
        
        if (field === 'productId') {
            item.productId = parseInt(value, 10) || 0;
            const product = products.find(p => p.id === item.productId);
            item.productName = product ? product.name : '';
        } else {
            (item as any)[field] = parseFloat(value) || 0;
        }

        newItems[index] = item;
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setFormData(prev => ({ ...prev, items: [...prev.items, { productId: 0, productName: '', quantity: 1 }] }));
    };

    const removeItem = (index: number) => {
        setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finishedGood = products.find(p => p.id === formData.productId);

        if (!formData.productId || !finishedGood) {
            addToast("Lütfen üretilecek bir mamul seçin.", "error");
            return;
        }

        const validItems = formData.items.filter(item => item.productId > 0 && item.quantity > 0);
        if (validItems.length === 0) {
            addToast("Lütfen en az bir geçerli bileşen ekleyin.", "error");
            return;
        }
        
        const itemsWithNames = validItems.map(item => ({
            ...item,
            productName: products.find(p => p.id === item.productId)?.name || 'Bilinmeyen'
        }));


        const bomData = {
            productId: formData.productId,
            items: itemsWithNames,
        };

        if (isEditMode && existingBom) {
            updateBom({ ...existingBom, ...bomData, productName: finishedGood.name });
        } else {
            addBom(bomData);
        }
        navigate('/manufacturing/boms');
    };

    const finishedGoods = products.filter(p => p.productType === ProductType.Mamul);
    const rawMaterials = products.filter(p => p.productType === ProductType.Hammadde || p.productType === ProductType.TicariMal);

    return (
        <Card>
            <form onSubmit={handleSubmit}>
                <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-dark-border">
                    <h2 className="text-xl font-bold">{isEditMode ? 'Ürün Reçetesini Düzenle' : 'Yeni Ürün Reçetesi'}</h2>
                    <div className="flex gap-2">
                        <Button type="button" variant="secondary" onClick={() => navigate('/manufacturing/boms')}>İptal</Button>
                        <Button type="submit">Kaydet</Button>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Üretilecek Mamul *</label>
                    <ProductSelector
                        products={finishedGoods}
                        value={formData.productId}
                        onChange={handleProductChange}
                    />
                </div>

                <div className="border-t pt-4 dark:border-dark-border">
                    <h3 className="text-lg font-semibold mb-2">Bileşenler (Hammaddeler/Yarı Mamuller)</h3>
                    <div className="space-y-2">
                         <div className="grid grid-cols-[3fr_1fr_auto] gap-4 font-semibold text-sm px-2 pb-1">
                           <span>Ürün</span>
                           <span className="text-right">Miktar</span>
                           <span></span>
                        </div>
                        {formData.items.map((item, index) => (
                            <div key={index} className="grid grid-cols-[3fr_1fr_auto] gap-4 items-center">
                                <ProductSelector
                                    products={rawMaterials}
                                    value={item.productId}
                                    onChange={(productId) => handleItemChange(index, 'productId', productId)}
                                />
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={item.quantity}
                                    onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                                    className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border text-right"
                                />
                                <Button type="button" variant="danger" onClick={() => removeItem(index)} className="!p-2">{ICONS.trash}</Button>
                            </div>
                        ))}
                    </div>
                    <Button type="button" variant="secondary" onClick={addItem} className="mt-2 text-sm">
                        <span className="flex items-center gap-2">{ICONS.add} Bileşen Ekle</span>
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default BomForm;