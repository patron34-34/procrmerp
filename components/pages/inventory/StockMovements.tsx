import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { StockMovement, StockMovementType, Warehouse, Product } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ICONS } from '../../../constants';
import InventoryTransferForm from '../../inventory/InventoryTransferForm';
import InventoryAdjustmentForm from '../../inventory/InventoryAdjustmentForm';
import ProductSelector from '../../inventory/ProductSelector';
import { Link } from 'react-router-dom';

const StockMovements: React.FC = () => {
    const { stockMovements, warehouses, products, hasPermission } = useApp();
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
    
    const [filters, setFilters] = useState({
        type: 'all',
        warehouseId: 'all',
        productId: 0
    });

    const canManage = hasPermission('stok-hareketi:goruntule'); // Using this as a base permission

    const filteredMovements = useMemo(() => {
        return stockMovements.filter(m => 
            (filters.type === 'all' || m.type === filters.type) &&
            (filters.warehouseId === 'all' || m.warehouseId === parseInt(filters.warehouseId)) &&
            (filters.productId === 0 || m.productId === filters.productId)
        );
    }, [stockMovements, filters]);
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleProductFilterChange = (productId: number) => {
        setFilters(prev => ({ ...prev, productId }));
    };

    return (
        <>
            <Card>
                <div className="flex justify-between items-center mb-4 pb-4 border-b dark:border-dark-border">
                    <h2 className="text-xl font-bold">Stok Hareketleri</h2>
                    {canManage && (
                        <div className="flex gap-2">
                            <Button onClick={() => setIsTransferModalOpen(true)} variant="secondary"><span className="flex items-center gap-2">{ICONS.transfer} Yeni Transfer</span></Button>
                            <Button onClick={() => setIsAdjustmentModalOpen(true)} variant="secondary"><span className="flex items-center gap-2">{ICONS.adjustment} Yeni Düzeltme</span></Button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                     <div className="md:col-span-2">
                        <label className="text-sm font-medium">Ürün</label>
                        <ProductSelector products={products} value={filters.productId} onChange={handleProductFilterChange} />
                     </div>
                     <div>
                        <label className="text-sm font-medium">Depo</label>
                        <select name="warehouseId" value={filters.warehouseId} onChange={handleFilterChange} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                            <option value="all">Tüm Depolar</option>
                            {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                        </select>
                     </div>
                     <div>
                        <label className="text-sm font-medium">Hareket Türü</label>
                         <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-dark-border">
                            <option value="all">Tüm Türler</option>
                            {Object.values(StockMovementType).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                     </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-3 font-semibold">Tarih</th>
                            <th className="p-3 font-semibold">Ürün</th>
                            <th className="p-3 font-semibold">Depo</th>
                            <th className="p-3 font-semibold">Hareket Türü</th>
                            <th className="p-3 font-semibold">Notlar</th>
                            <th className="p-3 font-semibold text-right">Miktar</th>
                        </tr></thead>
                        <tbody>
                            {filteredMovements.map(move => (
                                <tr key={move.id} className="border-b last:border-0 dark:border-dark-border">
                                    <td className="p-3 text-sm">{new Date(move.timestamp).toLocaleString('tr-TR')}</td>
                                    <td className="p-3 font-medium">
                                        <Link to={`/inventory/products/${move.productId}`} className="hover:underline text-primary-600">
                                            {move.productName}
                                        </Link>
                                    </td>
                                    <td className="p-3">{move.warehouseName}</td>
                                    <td className="p-3 text-sm">{move.type}</td>
                                    <td className="p-3 text-sm text-text-secondary">{move.notes}</td>
                                    <td className={`p-3 text-right font-semibold font-mono ${move.quantityChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {move.quantityChange > 0 ? `+${move.quantityChange}` : move.quantityChange}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            {canManage && (
                <>
                <InventoryTransferForm isOpen={isTransferModalOpen} onClose={() => setIsTransferModalOpen(false)} />
                <InventoryAdjustmentForm isOpen={isAdjustmentModalOpen} onClose={() => setIsAdjustmentModalOpen(false)} />
                </>
            )}
        </>
    );
};

export default StockMovements;