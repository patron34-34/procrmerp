
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Product } from '../../types';

interface ProductSelectorProps {
    value: number;
    onChange: (productId: number) => void;
    products: Product[];
    disabled?: boolean;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ value, onChange, products, disabled = false }) => {
    const getProductDisplay = (product?: Product) => product ? `${product.sku} - ${product.name}` : '';
    
    const selectedProduct = products.find(p => p.id === value);
    const [searchTerm, setSearchTerm] = useState(getProductDisplay(selectedProduct));
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSearchTerm(getProductDisplay(products.find(p => p.id === value)));
    }, [value, products]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm(getProductDisplay(products.find(p => p.id === value)));
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [value, products]);

    const filteredProducts = useMemo(() => {
        if (!isOpen) return [];
        const lowerSearchTerm = searchTerm.toLowerCase();
        return products.filter(p =>
            getProductDisplay(p).toLowerCase().includes(lowerSearchTerm)
        );
    }, [searchTerm, products, isOpen]);

    const handleSelect = (product: Product) => {
        onChange(product.id);
        setSearchTerm(getProductDisplay(product));
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <input
                type="text"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); if (!isOpen) setIsOpen(true); }}
                onFocus={() => setIsOpen(true)}
                placeholder="Ürün Ara..."
                disabled={disabled}
                className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-dark-border"
            />
            {isOpen && (
                <ul className="absolute z-20 w-full mt-1 bg-card dark:bg-dark-card border dark:border-dark-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredProducts.length > 0 ? filteredProducts.map(p => (
                        <li
                            key={p.id}
                            onClick={() => handleSelect(p)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                        >
                            <span className="font-medium text-sm">{p.name}</span>
                            <span className="text-xs text-slate-500 block">SKU: {p.sku} | Fiyat: ${p.price}</span>
                        </li>
                    )) : <li className="p-2 text-text-secondary">Sonuç bulunamadı.</li>}
                </ul>
            )}
        </div>
    );
};

export default ProductSelector;