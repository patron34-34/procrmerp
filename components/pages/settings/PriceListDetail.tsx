

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { PriceListItem } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const PriceListDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { priceLists, priceListItems, products, updatePriceListItems, hasPermission } = useApp();
    
    const priceListId = parseInt(id || '', 10);
    const priceList = useMemo(() => priceLists.find(p => p.id === priceListId), [priceLists, priceListId]);

    const [prices, setPrices] = useState<Record<number, string>>({});
    
    useEffect(() => {
        if (priceList) {
            const initialPrices: Record<number, string> = {};
            products.forEach(product => {
                const item = priceListItems.find(i => i.priceListId === priceList.id && i.productId === product.id);
                if (item) {
                    initialPrices[product.id] = String(item.price);
                }
            });
            setPrices(initialPrices);
        }
    }, [priceList, priceListItems, products]);

    const handlePriceChange = (productId: number, value: string) => {
        setPrices(prev => ({ ...prev, [productId]: value }));
    };
    
    const handleSave = () => {
        const newItems: PriceListItem[] = products.map(product => {
            const priceValue = prices[product.id];
            if (priceValue !== undefined && priceValue !== '') {
                return {
                    priceListId: priceList!.id,
                    productId: product.id,
                    price: parseFloat(priceValue)
                };
            }
            return null;
        }).filter((item): item is PriceListItem => item !== null);

        updatePriceListItems(priceList!.id, newItems);
    };

    if (!priceList) {
        return (
            <Card title="Hata">
                <p>Fiyat listesi bulunamadı. <Link to="/admin/settings/price-lists" className="text-primary-600">Fiyat Listelerine Geri Dön</Link></p>
            </Card>
        );
    }
    
    const canManage = hasPermission('ayarlar:genel-yonet');

    return (
        <Card title={`Fiyatları Düzenle: ${priceList.name}`} action={canManage ? <Button onClick={handleSave}>Değişiklikleri Kaydet</Button> : undefined}>
             <p className="mb-4 text-text-secondary dark:text-dark-text-secondary">
                Bu listedeki ürünler için özel fiyatlar belirleyin. Boş bırakılan alanlar, ürünün varsayılan fiyatını kullanacaktır.
            </p>
            <div className="overflow-x-auto max-h-[calc(100vh-300px)]">
                <table className="w-full text-left">
                    <thead className="border-b dark:border-dark-border sticky top-0 bg-card dark:bg-dark-card"><tr className="bg-slate-50 dark:bg-slate-900/50">
                        <th className="p-3 font-semibold">SKU</th>
                        <th className="p-3 font-semibold">Ürün Adı</th>
                        <th className="p-3 font-semibold text-right">Varsayılan Fiyat</th>
                        <th className="p-3 font-semibold text-right">Özel Fiyat ({priceList.currency})</th>
                    </tr></thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="border-b dark:border-dark-border">
                                <td className="p-2 font-mono">{product.sku}</td>
                                <td className="p-2 font-medium">{product.name}</td>
                                <td className="p-2 text-right font-mono text-text-secondary dark:text-dark-text-secondary">${product.price.toLocaleString()}</td>
                                <td className="p-2 text-right">
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="Varsayılan"
                                        value={prices[product.id] || ''}
                                        onChange={(e) => handlePriceChange(product.id, e.target.value)}
                                        disabled={!canManage}
                                        className="w-32 p-1 border rounded-md text-right dark:bg-slate-700 dark:border-dark-border"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default PriceListDetail;