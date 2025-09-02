import React, { useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import { Link } from 'react-router-dom';

const InventoryDashboard: React.FC = () => {
    const { products, warehouses, stockMovements, getProductStockInfo } = useApp();

    const lowStockProducts = useMemo(() => {
        return products
            .filter(p => getProductStockInfo(p.id).available <= p.lowStockThreshold)
            .sort((a, b) => getProductStockInfo(a.id).available - getProductStockInfo(b.id).available)
            .slice(0, 10); // Show top 10
    }, [products, getProductStockInfo]);

    const recentMovements = stockMovements.slice(0, 10);

    return (
        <div className="space-y-6">
             <h1 className="text-3xl font-bold">Envanter Kontrol Paneli</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Düşük Stoktaki Ürünler">
                    <div className="overflow-x-auto max-h-96">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b dark:border-dark-border">
                                    <th className="p-2">Ürün</th>
                                    <th className="p-2 text-right">Mevcut Stok</th>
                                    <th className="p-2 text-right">Stok Eşiği</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lowStockProducts.length > 0 ? lowStockProducts.map(product => {
                                    const stockInfo = getProductStockInfo(product.id);
                                    return (
                                        <tr key={product.id} className="border-b dark:border-dark-border last:border-0">
                                            <td className="p-2 font-medium">
                                                <Link to={`/inventory/products/${product.id}`} className="hover:underline text-primary-600 dark:text-primary-400">
                                                    {product.name}
                                                </Link>
                                            </td>
                                            <td className="p-2 text-right font-mono text-red-500 font-semibold">{stockInfo.available}</td>
                                            <td className="p-2 text-right font-mono">{product.lowStockThreshold}</td>
                                        </tr>
                                    )
                                }) : (
                                    <tr>
                                        <td colSpan={3} className="text-center p-8 text-text-secondary">Düşük stokta ürün bulunmuyor.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
                 <Card title="Son Stok Hareketleri">
                    <div className="overflow-x-auto max-h-96">
                       <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b dark:border-dark-border">
                                    <th className="p-2">Ürün</th>
                                    <th className="p-2">Tür</th>
                                    <th className="p-2 text-right">Miktar</th>
                                </tr>
                            </thead>
                            <tbody>
                               {recentMovements.length > 0 ? recentMovements.map(move => (
                                    <tr key={move.id} className="border-b dark:border-dark-border last:border-0">
                                        <td className="p-2">
                                            <p className="font-medium">{move.productName}</p>
                                            <p className="text-xs text-text-secondary">{new Date(move.timestamp).toLocaleString('tr-TR')}</p>
                                        </td>
                                        <td className="p-2 text-xs">{move.type}</td>
                                        <td className={`p-2 text-right font-semibold font-mono ${move.quantityChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {move.quantityChange > 0 ? `+${move.quantityChange}` : move.quantityChange}
                                        </td>
                                    </tr>
                               )) : (
                                   <tr>
                                       <td colSpan={3} className="text-center p-8 text-text-secondary">Hiç stok hareketi bulunmuyor.</td>
                                   </tr>
                               )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default InventoryDashboard;