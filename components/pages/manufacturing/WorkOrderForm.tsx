import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { WorkOrder, WorkOrderStatus, ProductType } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import ProductSelector from '../../inventory/ProductSelector';
import { useNotification } from '../../../context/NotificationContext';

const WorkOrderForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { workOrders, products, boms, addWorkOrder, updateWorkOrderStatus, updateWorkOrder } = useApp();
    const { addToast } = useNotification();

    const isEditMode = !!id;
    const existingWO = isEditMode ? workOrders.find(wo => wo.id === parseInt(id)) : null;

    const initialFormState: Omit<WorkOrder, 'id' | 'workOrderNumber' | 'productName'> = {
        productId: 0,
        quantityToProduce: 1,
        bomId: 0,
        status: WorkOrderStatus.Taslak,
        creationDate: new Date().toISOString().split('T')[0],
        notes: '',
    };

    const [formData, setFormData] = useState(initialFormState);
    const isLocked = existingWO ? ![WorkOrderStatus.Taslak].includes(existingWO.status) : false;


    useEffect(() => {
        if (isEditMode && existingWO) {
            setFormData(existingWO);
        } else {
            setFormData(initialFormState);
        }
    }, [id, existingWO, isEditMode]);

    const availableBoms = useMemo(() => {
        if (!formData.productId) return [];
        return boms.filter(bom => bom.productId === formData.productId);
    }, [boms, formData.productId]);

    useEffect(() => {
        if (formData.productId && availableBoms.length > 0) {
            if (!formData.bomId || !availableBoms.some(b => b.id === formData.bomId)) {
                setFormData(prev => ({...prev, bomId: availableBoms[0].id}));
            }
        } else if (formData.productId && availableBoms.length === 0) {
             setFormData(prev => ({...prev, bomId: 0}));
        }
    }, [formData.productId, availableBoms, formData.bomId]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name.includes('Id') || name.includes('quantity') ? parseInt(value) : value }));
    };
    
    const handleStatusChange = (newStatus: WorkOrderStatus) => {
        if(existingWO) {
            updateWorkOrderStatus(existingWO.id, newStatus);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.productId) {
            addToast("Lütfen üretilecek bir mamul seçin.", "error");
            return;
        }
        if (!formData.bomId) {
            addToast("Seçilen mamul için uygun bir ürün reçetesi (BOM) bulunamadı veya seçilmedi.", "error");
            return;
        }
        if (formData.quantityToProduce <= 0) {
            addToast("Üretim miktarı 0'dan büyük olmalıdır.", "error");
            return;
        }
        
        if (isEditMode && existingWO) {
            updateWorkOrder({ ...existingWO, ...formData });
            addToast("İş emri güncellendi.", "success");
        } else {
            addWorkOrder(formData);
        }
        navigate('/manufacturing/work-orders');
    };

    const finishedGoods = products.filter(p => p.productType === ProductType.Mamul);

    return (
        <Card>
            <form onSubmit={handleSubmit}>
                <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-dark-border">
                    <h2 className="text-xl font-bold">{isEditMode ? `İş Emrini Düzenle: ${existingWO?.workOrderNumber}` : 'Yeni İş Emri'}</h2>
                    <div className="flex gap-2">
                        <Button type="button" variant="secondary" onClick={() => navigate('/manufacturing/work-orders')}>İptal</Button>
                        <Button type="submit" disabled={isLocked}>Kaydet</Button>
                    </div>
                </div>
                
                {isEditMode && existingWO && (
                     <div className="p-4 mb-4 bg-slate-100 dark:bg-slate-800 rounded-lg flex justify-between items-center">
                         <span className="font-semibold">Durum: {existingWO.status}</span>
                         <div className="flex gap-2">
                            {existingWO.status === WorkOrderStatus.Taslak && <Button type="button" onClick={() => handleStatusChange(WorkOrderStatus.Onaylandı)}>Onayla</Button>}
                            {existingWO.status === WorkOrderStatus.Onaylandı && <Button type="button" onClick={() => handleStatusChange(WorkOrderStatus.Uretimde)}>Üretime Başla</Button>}
                            {existingWO.status === WorkOrderStatus.Uretimde && <Button type="button" onClick={() => handleStatusChange(WorkOrderStatus.Tamamlandı)}>Tamamlandı Olarak İşaretle</Button>}
                         </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Üretilecek Mamul *</label>
                        <ProductSelector
                            products={finishedGoods}
                            value={formData.productId}
                            onChange={(pid) => setFormData(prev => ({...prev, productId: pid, bomId: 0}))}
                            disabled={isLocked}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Ürün Reçetesi (BOM) *</label>
                        <select name="bomId" value={formData.bomId} onChange={handleInputChange} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border" disabled={isLocked}>
                            <option value={0} disabled>Seçiniz...</option>
                            {availableBoms.map(bom => <option key={bom.id} value={bom.id}>{bom.productName} - Reçete #{bom.id}</option>)}
                        </select>
                         {formData.productId > 0 && availableBoms.length === 0 && <p className="text-xs text-red-500 mt-1">Bu mamul için reçete bulunamadı.</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Üretim Miktarı *</label>
                        <input
                            type="number"
                            name="quantityToProduce"
                            value={formData.quantityToProduce}
                            onChange={handleInputChange}
                            min="1"
                            disabled={isLocked}
                            className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                        />
                    </div>
                </div>
                 <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Notlar</label>
                    <textarea
                        name="notes"
                        rows={3}
                        value={formData.notes || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                    />
                </div>
            </form>
        </Card>
    );
};

export default WorkOrderForm;