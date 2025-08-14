

import React, { useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import { StockItemStatus } from '../../../types';

const InventoryDashboard: React.FC = () => {
    const { products, warehouses, stockMovements, getProductStockInfo, getProductStockByWarehouse } = useApp();

    const stats = useMemo(() => {
        const totalStockValue = products.reduce((sum, p) => sum + (getProductStockInfo(p.id).physical * p.price), 0);
        const lowStockItems = products.filter(p => getProductStockInfo(p.id).available <= p.lowStockThreshold).length;
        const outOfStockItems = products.filter(p => getProductStockInfo(p.id).available === 0).length;
        const totalWarehouses = warehouses.length;

        return { totalStockValue, lowStockItems, outOfStockItems, totalWarehouses };
    }, [products, warehouses, getProductStockInfo]);

    const stockByCategory = useMemo(() => {
        const data: { [key: string]: number } = {};
        products.forEach(p => {
            data[p.category] = (data[p.category] || 0) + (getProductStockInfo(p.id).physical * p.price);
        });
        return Object.entries(data).map(([name, value]) => ({ name, value }));
    }, [products, getProductStockInfo]);
    
    const stockByWarehouse = useMemo(() => {
        const data: { [key: string]: number } = {};
        warehouses.forEach(w => {
            data[w.name] = 0;
        });

        products.forEach(p => {
            warehouses.forEach(w => {
                const stockInWarehouse = getProductStockByWarehouse(p.id, w.id).physical;
                data[w.name] += stockInWarehouse * p.price;
            });
        });
        
        return Object.entries(data).map(([name, value]) => ({ name, value }));
    }, [products, warehouses, getProductStockByWarehouse]);


    const recentMovements = stockMovements.slice(0, 5);

    const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#f97316', '#22c55e', '#ef4444', '#64748b'];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><h4 className="text-text-secondary dark:text-dark-text-secondary">Toplam Stok Değeri</h4><p className="text-3xl font-bold">${stats.totalStockValue.toLocaleString()}</p></Card>
                <Card><h4 className="text-text-secondary dark:text-dark-text-secondary">Düşük Stoktaki Ürünler</h4><p className="text-3xl font-bold text-orange-500">{stats.lowStockItems}</p></Card>
                <Card><h4 className="text-text-secondary dark:text-dark-text-secondary">Stokta Olmayan Ürünler</h4><p className="text-3xl font-bold text-red-600">{stats.outOfStockItems}</p></Card>
                <Card><h4 className="text-text-secondary dark:text-dark-text-secondary">Toplam Depo Sayısı</h4><p className="text-3xl font-bold">{stats.totalWarehouses}</p></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Kategoriye Göre Stok Değeri">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={stockByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {stockByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip wrapperClassName="!bg-card !border-slate-200 dark:!bg-dark-card dark:!border-dark-border rounded-md" contentStyle={{ backgroundColor: 'transparent' }}/>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
                 <Card title="Depoya Göre Stok Değeri">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stockByWarehouse} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" tick={{ fill: '#94a3b8' }} />
                            <YAxis type="category" dataKey="name" width={80} tick={{ fill: '#94a3b8' }} />
                            <Tooltip wrapperClassName="!bg-card !border-slate-200 dark:!bg-dark-card dark:!border-dark-border rounded-md" contentStyle={{ backgroundColor: 'transparent' }}/>
                            <Bar dataKey="value" fill="#3b82f6" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            <Card title="Son Stok Hareketleri">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-dark-border"><tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="p-3 font-semibold">Tarih</th>
                            <th className="p-3 font-semibold">Ürün</th>
                            <th className="p-3 font-semibold">Depo</th>
                            <th className="p-3 font-semibold">Hareket Türü</th>
                            <th className="p-3 font-semibold text-right">Miktar Değişimi</th>
                        </tr></thead>
                        <tbody>
                            {recentMovements.map(move => (
                                <tr key={move.id} className="border-b dark:border-dark-border last:border-0">
                                    <td className="p-3 text-sm">{new Date(move.timestamp).toLocaleString('tr-TR')}</td>
                                    <td className="p-3 font-medium">{move.productName}</td>
                                    <td className="p-3">{move.warehouseName}</td>
                                    <td className="p-3 text-sm">{move.type}</td>
                                    <td className={`p-3 text-right font-semibold font-mono ${move.quantityChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {move.quantityChange > 0 ? `+${move.quantityChange}` : move.quantityChange}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

        </div>
    );
};

export default InventoryDashboard;