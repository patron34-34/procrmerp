import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Deal, DealStage, DealLineItem, Customer } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ICONS } from '../../constants';

interface DealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal | null;
}

type DealFormData = Omit<Deal, 'id' | 'customerName' | 'assignedToName' | 'value' | 'lastActivityDate'>;

const DealFormModal: React.FC<DealFormModalProps> = ({ isOpen, onClose, deal }) => {
    const { addDeal, updateDeal, customers, employees, products } = useApp();

    const initialFormState: DealFormData = {
        title: '',
        customerId: customers[0]?.id || 0,
        stage: DealStage.Lead,
        closeDate: new Date().toISOString().split('T')[0],
        assignedToId: employees.find(e => e.role === 'Satış')?.id || employees[0]?.id || 0,
        lineItems: [],
        winReason: '',
        lossReason: '',
    };

    const [formData, setFormData] = useState<DealFormData>(initialFormState);
    const [customerSearch, setCustomerSearch] = useState('');
    const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
    const customerDropdownRef = useRef<HTMLDivElement>(null);
    
    const filteredCustomers = useMemo(() => 
        customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase())),
        [customers, customerSearch]
    );

    useEffect(() => {
        if (deal) {
            setFormData({
                title: deal.title,
                customerId: deal.customerId,
                stage: deal.stage,
                closeDate: deal.closeDate,
                assignedToId: deal.assignedToId,
                lineItems: [...deal.lineItems],
                winReason: deal.winReason,
                lossReason: deal.lossReason,
            });
            const customer = customers.find(c => c.id === deal.customerId);
            if (customer) setCustomerSearch(customer.name);
        } else {
            setFormData(initialFormState);
            setCustomerSearch(customers.find(c => c.id === initialFormState.customerId)?.name || '');
        }
    }, [deal, isOpen, customers]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (customerDropdownRef.current && !customerDropdownRef.current.contains(event.target as Node)) {
            setIsCustomerDropdownOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);

    const totalValue = useMemo(() => {
        return formData.lineItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, [formData.lineItems]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'assignedToId' ? parseInt(value) || 0 : value }));
    };
    
    const handleItemChange = (index: number, field: keyof DealLineItem, value: any) => {
        const newItems = [...formData.lineItems];
        const item = { ...newItems[index] };
        
        if (field === 'productId') {
            const product = products.find(p => p.id === parseInt(value));
            if (product) {
                item.productId = product.id;
                item.productName = product.name;
                item.price = product.price;
            }
        } else if (field === 'quantity') {
            item.quantity = parseInt(value) || 0;
        } else if (field === 'price') {
            item.price = parseFloat(value) || 0;
        }

        newItems[index] = item;
        setFormData(prev => ({ ...prev, lineItems: newItems }));
    };

    const addNewItem = () => {
        if (products.length === 0) {
            alert("Lütfen önce bir ürün ekleyin.");
            return;
        }
        const firstProduct = products[0];
        setFormData(prev => ({
            ...prev,
            lineItems: [
                ...prev.lineItems,
                { productId: firstProduct.id, productName: firstProduct.name, quantity: 1, price: firstProduct.price }
            ]
        }));
    };

    const removeItem = (index: number) => {
        setFormData(prev => ({ ...prev, lineItems: prev.lineItems.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.title && formData.customerId) {
            const { winReason, lossReason, ...dealDataForSubmit } = formData;
            if (deal) {
                updateDeal({ ...deal, ...dealDataForSubmit });
            } else {
                addDeal(dealDataForSubmit);
            }
            onClose();
        } else {
            alert("Lütfen tüm zorunlu alanları doldurun.");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={deal ? "Anlaşmayı Düzenle" : "Yeni Anlaşma Ekle"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Anlaşma Başlığı *</label>
                    <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} required className="mt-1 block w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                </div>
                 <div ref={customerDropdownRef}>
                    <label htmlFor="customerName" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Müşteri *</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={customerSearch}
                            onChange={(e) => {setCustomerSearch(e.target.value); setIsCustomerDropdownOpen(true);}}
                            onFocus={() => setIsCustomerDropdownOpen(true)}
                            className="mt-1 block w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"
                        />
                        {isCustomerDropdownOpen && (
                            <ul className="absolute z-10 w-full bg-card dark:bg-dark-card border dark:border-dark-border rounded-md mt-1 max-h-48 overflow-y-auto">
                                {filteredCustomers.map(c => (
                                    <li 
                                        key={c.id} 
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, customerId: c.id }));
                                            setCustomerSearch(c.name);
                                            setIsCustomerDropdownOpen(false);
                                        }}
                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                                    >
                                        {c.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                 <div className="border-t border-slate-200 dark:border-dark-border pt-4">
                    <h4 className="text-md font-medium mb-2">Ürünler</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                       {formData.lineItems.map((item, index) => (
                           <div key={index} className="grid grid-cols-[1fr_80px_80px_auto] gap-2 items-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-md">
                               <select value={item.productId} onChange={(e) => handleItemChange(index, 'productId', e.target.value)} className="w-full p-2 border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white">
                                   {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                               </select>
                               <input type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="w-full p-2 border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white" />
                               <input type="number" step="0.01" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} className="w-full p-2 border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-dark-border dark:text-white" />
                               <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-1">{ICONS.trash}</button>
                           </div>
                       ))}
                    </div>
                    <Button type="button" variant="secondary" onClick={addNewItem} className="mt-2 text-sm">
                       <span className="flex items-center gap-2">{ICONS.add} Ürün Ekle</span>
                    </Button>
                </div>
                <div className="text-right font-bold text-xl pt-4 border-t border-slate-200 dark:border-dark-border">
                    Toplam Değer: ${totalValue.toLocaleString()}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="assignedToId" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Sorumlu</label>
                        <select name="assignedToId" id="assignedToId" value={formData.assignedToId} onChange={handleInputChange} required className="mt-1 block w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="closeDate" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Tahmini Kapanış Tarihi</label>
                        <input type="date" name="closeDate" id="closeDate" value={formData.closeDate} onChange={handleInputChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border"/>
                    </div>
                </div>
                <div>
                    <label htmlFor="stage" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Aşama</label>
                    <select name="stage" id="stage" value={formData.stage} onChange={handleInputChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                        {Object.values(DealStage).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="flex justify-end pt-4 gap-2">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="submit">{deal ? "Güncelle" : "Ekle"}</Button>
                </div>
            </form>
        </Modal>
    );
};

export default DealFormModal;
