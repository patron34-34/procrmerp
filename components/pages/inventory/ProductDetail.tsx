import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import Card from '../../ui/Card';
import { ICONS } from '../../../constants';
import Button from '../../ui/Button';
import ProductForm from '../../inventory/ProductForm';
import InventoryTransferForm from '../../inventory/InventoryTransferForm';
import InventoryAdjustmentForm from '../../inventory/InventoryAdjustmentForm';
import { StockItem, StockItemStatus } from '../../../types';

type ActiveTab = 'overview' | 'stock' | 'history';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { products, warehouses, stockMovements, stockItems, hasPermission, getProductStockInfo } = useApp();
    const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);

    const productId = parseInt(id || '', 10);
    const product = products.find(p => p.id === productId);
    const canManage = hasPermission('envanter:yonet');

    const productStockItems = useMemo(() => {
        return stockItems.filter(i => i.productId === productId);
    }, [stockItems, productId]);
    
    const productMovements = useMemo(() => {
        return stockMovements
            .filter(m => m.productId === productId)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [stockMovements, productId]);

    if (!product) {
        return <Card title="Hata"><p>Ürün bulunamadı. Lütfen <Link to="/inventory/products">Ürünler listesine</Link> geri dönün.</p></Card>;
    }
    
    const stockInfo = getProductStockInfo(product.id);

    return (
        <>
            <div className="space-y-6">
                <Card>
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold">{product.name}</h2>
                            <div className="flex items-center gap-4 text-sm text-text-secondary dark:text-dark-text-secondary mt-1">
                                <span>SKU: {product.sku}</span>
                                <span>Kategori: {product.category}</span>
                            </div>
                        </div>
                        {canManage && (
                            <div className="flex gap-2">
                                <Button variant="secondary" onClick={() => setIsTransferModalOpen(true)}>Stok Transferi</Button>
                                <Button variant="secondary" onClick={() => setIsAdjustmentModalOpen(true)}>Stok Düzeltmesi</Button>
                                <Button onClick={() => setIsEditModalOpen(true)}>Düzenle</Button>
                            </div>
                        )}
                    </div>
                </Card>

                <div className="border-b border-slate-200 dark:border-dark-border">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button onClick={() => setActiveTab('overview')} className={`${activeTab === 'overview' ? 'border-primary-500 text-primary-600' : 'border-transparent text-text-secondary hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Genel Bakış</button>
                        <button onClick={() => setActiveTab('stock')} className={`${activeTab === 'stock' ? 'border-primary-500 text-primary-600' : 'border-transparent text-text-secondary hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Stok Kalemleri</button>
                        <button onClick={() => setActiveTab('history')} className={`${activeTab === 'history' ? 'border-primary-500 text-primary-600' : 'border-transparent text-text-secondary hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Hareket Geçmişi</button>
                    </nav>
                </div>

                <div>
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                           <Card><h4 className="text-text-secondary">Fiziksel Stok</h4><p className="text-3xl font-bold">{stockInfo.physical}</p></Card>
                           <Card><h4 className="text-text-secondary">Ayrılmış Stok</h4><p className="text-3xl font-bold">{stockInfo.committed}</p></Card>
                           <Card><h4 className="text-text-secondary">Kullanılabilir Stok</h4><p className={`text-3xl font-bold ${stockInfo.available <= product.lowStockThreshold ? 'text-red-500' : ''}`}>{stockInfo.available}</p></Card>
                           <Card><h4 className="text-text-secondary">Stok Değeri</h4><p className="text-3xl font-bold">${(stockInfo.physical * product.price).toLocaleString()}</p></Card>
                        </div>
                    )}
                     {activeTab === 'stock' && (
                        <Card title="Stok Kalemleri">
                           <div className="overflow-x-auto max-h-96">
                               <table className="w-full text-left">
                                   <thead className="border-b dark:border-dark-border sticky top-0 bg-card dark:bg-dark-card"><tr className="bg-slate-50 dark:bg-slate-900/50">
                                       <th className="p-3 font-semibold">Depo</th>
                                       <th className="p-3 font-semibold">Durum</th>
                                       <th className="p-3 font-semibold">Seri/Parti No</th>
                                       <th className="p-3 font-semibold text-right">Miktar</th>
                                       <th className="p-3 font-semibold">SKT</th>
                                   </tr></thead>
                                   <tbody>
                                       {productStockItems.map(item => (
                                           <tr key={item.id} className="border-b last:border-0 dark:border-dark-border">
                                               <td className="p-3">{warehouses.find(w => w.id === item.warehouseId)?.name}</td>
                                               <td className="p-3">{item.status}</td>
                                               <td className="p-3 font-mono text-sm">{item.serialNumber || item.batchNumber}</td>
                                               <td className="p-3 text-right font-semibold">{item.quantity || 1}</td>
                                               <td className="p-3">{item.expiryDate || '-'}</td>
                                           </tr>
                                       ))}
                                   </tbody>
                               </table>
                           </div>
                        </Card>
                    )}
                     {activeTab === 'history' && (
                        <Card title="Hareket Geçmişi">
                            <div className="overflow-x-auto max-h-96">
                                <table className="w-full text-left">
                                    <thead className="border-b dark:border-dark-border sticky top-0 bg-card dark:bg-dark-card"><tr className="bg-slate-50 dark:bg-slate-900/50">
                                        <th className="p-3 font-semibold">Tarih</th>
                                        <th className="p-3 font-semibold">Depo</th>
                                        <th className="p-3 font-semibold">Hareket Türü</th>
                                        <th className="p-3 font-semibold text-right">Miktar</th>
                                    </tr></thead>
                                    <tbody>
                                        {productMovements.map(move => (
                                            <tr key={move.id} className="border-b last:border-0 dark:border-dark-border">
                                                <td className="p-3 text-sm">{new Date(move.timestamp).toLocaleString('tr-TR')}</td>
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
                    )}
                </div>
            </div>

            {canManage && (
                <>
                    <ProductForm isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} product={product} />
                    <InventoryTransferForm isOpen={isTransferModalOpen} onClose={() => setIsTransferModalOpen(false)} productToTransfer={product} />
                    <InventoryAdjustmentForm isOpen={isAdjustmentModalOpen} onClose={() => setIsAdjustmentModalOpen(false)} productToAdjust={product} />
                </>
            )}
        </>
    );
};

export default ProductDetail;