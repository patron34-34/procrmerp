
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { InvoiceLineItem, Product, Unit, InvoiceType } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useApp } from '../../context/AppContext';
import { KDV_MUAFİYET_KODLARI, TEVKIFAT_KODLARI } from '../../constants';

interface InvoiceItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: InvoiceLineItem | null;
    onSave: (item: InvoiceLineItem) => void;
    invoiceType: InvoiceType;
}

const InvoiceItemModal: React.FC<InvoiceItemModalProps> = ({ isOpen, onClose, item, onSave, invoiceType }) => {
    const { products } = useApp();
    const [formData, setFormData] = useState<InvoiceLineItem>({} as InvoiceLineItem);
    const [productSearch, setProductSearch] = useState('');
    const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
    const productDropdownRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (item) {
            setFormData(item);
            setProductSearch(item.productName || '');
        }
    }, [item]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (productDropdownRef.current && !productDropdownRef.current.contains(event.target as Node)) {
            setIsProductDropdownOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const { totalPrice, taxAmount, vatIncludedPrice, discountAmount } = useMemo(() => {
        const discountAmount = (formData.quantity * formData.unitPrice) * (formData.discountRate / 100);
        const totalPrice = (formData.quantity * formData.unitPrice) - discountAmount;
        const taxAmount = totalPrice * (formData.taxRate / 100);
        const vatIncludedPrice = totalPrice + taxAmount;
        return { totalPrice, discountAmount, taxAmount, vatIncludedPrice };
    }, [formData.quantity, formData.unitPrice, formData.discountRate, formData.taxRate]);
    
    const handleInputChange = (field: keyof InvoiceLineItem, value: any) => {
        let newFormData = { ...formData, [field]: value };
        
        if(field === 'productName') {
            newFormData.productId = 0;
        }

        if (field === 'taxExemptionReason' && value) {
            newFormData.taxRate = 0;
        } else if (field === 'taxExemptionReason' && !value) {
            const product = products.find(p => p.id === formData.productId);
            newFormData.taxRate = product?.financials.vatRate || 20;
        }

        setFormData(newFormData);
    };

    const handleProductSelect = (product: Product) => {
        setFormData({
            ...formData,
            productId: product.id,
            productName: product.name,
            unit: product.unit,
            unitPrice: product.price,
            taxRate: product.financials.vatRate,
        });
        setProductSearch(product.name);
        setIsProductDropdownOpen(false);
    };

    const handleSaveClick = () => {
        onSave({ ...formData, totalPrice, discountAmount, taxAmount, vatIncludedPrice });
    };

    const filteredProducts = useMemo(() => 
        products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase())),
        [products, productSearch]
    );

    if (!item) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={item.id ? "Mal/Hizmet Bilgisi Düzenle" : "Mal/Hizmet Bilgisi Ekle"} size="3xl">
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Mal/Hizmet</label>
                        <div className="relative" ref={productDropdownRef}>
                            <input 
                                type="text" 
                                value={productSearch} 
                                onChange={e => { setProductSearch(e.target.value); setIsProductDropdownOpen(true); handleInputChange('productName', e.target.value); }}
                                onFocus={() => setIsProductDropdownOpen(true)}
                                placeholder="Ürün arayın veya serbest metin girin..."
                                className="mt-1 w-full"
                            />
                             {isProductDropdownOpen && filteredProducts.length > 0 && (
                                <ul className="absolute z-20 w-full bg-card dark:bg-dark-card border dark:border-dark-border rounded-md mt-1 max-h-48 overflow-y-auto">
                                    {filteredProducts.map(p => <li key={p.id} onClick={() => handleProductSelect(p)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">{p.sku} - {p.name}</li>)}
                                </ul>
                            )}
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                         <InputField label="Miktar" name="quantity" type="number" value={formData.quantity} onChange={e => handleInputChange('quantity', e.target.value)} />
                         <SelectField label="Birim" name="unit" value={formData.unit} onChange={e => handleInputChange('unit', e.target.value)} options={Object.values(Unit)} />
                     </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField label="Birim Fiyatı" name="unitPrice" type="number" step="0.01" value={formData.unitPrice} onChange={e => handleInputChange('unitPrice', e.target.value)} />
                    <InputField label="İskonto Oranı %" name="discountRate" type="number" value={formData.discountRate} onChange={e => handleInputChange('discountRate', e.target.value)} />
                    <InputField label="İskonto Açıklaması" name="discountDescription" value={formData.discountDescription || ''} onChange={e => handleInputChange('discountDescription', e.target.value)} />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField label="KDV Oranı %" name="taxRate" type="number" value={formData.taxRate} onChange={e => handleInputChange('taxRate', e.target.value)} disabled={invoiceType === 'İstisna' && !!formData.taxExemptionReason} />
                     {invoiceType === 'İstisna' && (
                         <div className="col-span-2">
                             <label className="block text-sm font-medium">KDV Muafiyet Sebebi</label>
                             <select name="taxExemptionReason" value={formData.taxExemptionReason || ''} onChange={e => handleInputChange('taxExemptionReason', e.target.value)} className="mt-1 w-full">
                                 <option value="">Seçiniz...</option>
                                 {KDV_MUAFİYET_KODLARI.map(k => <option key={k.code} value={k.code}>{k.code} - {k.description}</option>)}
                             </select>
                         </div>
                     )}
                     {invoiceType === 'Tevkifat' && (
                         <div className="col-span-2">
                            <label className="block text-sm font-medium">Tevkifat Kodu</label>
                            <select name="withholdingCode" value={formData.withholdingCode || ''} onChange={e => handleInputChange('withholdingCode', e.target.value)} className="mt-1 w-full">
                                <option value="">Seçiniz...</option>
                                {TEVKIFAT_KODLARI.map(k => <option key={k.code} value={k.code}>{k.code} - {k.description}</option>)}
                            </select>
                         </div>
                     )}
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 mt-4 border-t dark:border-dark-border bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <ResultField label="Mal/Hizmet Tutarı" value={totalPrice.toFixed(2)} />
                    <ResultField label="KDV Tutarı" value={taxAmount.toFixed(2)} />
                    <ResultField label="KDV Dahil Tutar" value={vatIncludedPrice.toFixed(2)} isBold />
                 </div>
                <div className="flex justify-end pt-4 gap-2">
                    <Button type="button" variant="secondary" onClick={onClose}>İptal</Button>
                    <Button type="button" onClick={handleSaveClick}>Tamam</Button>
                </div>
            </div>
        </Modal>
    );
};

const InputField: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium">{label}</label>
        <input {...props} className="mt-1 w-full"/>
    </div>
);
const SelectField: React.FC<any> = ({ label, options, ...props }) => (
    <div>
        <label className="block text-sm font-medium">{label}</label>
        <select {...props} className="mt-1 w-full">
            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);
const ResultField: React.FC<{label: string, value: string, isBold?: boolean}> = ({label, value, isBold}) => (
    <div>
        <p className="text-sm text-text-secondary">{label}</p>
        <p className={`text-lg font-mono ${isBold ? 'font-bold' : ''}`}>{value}</p>
    </div>
);


export default InvoiceItemModal;
