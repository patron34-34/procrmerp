import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { Product, StockItem, StockItemStatus } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import EmptyState from '../../ui/EmptyState';
import ConfirmationModal from '../../ui/ConfirmationModal';
import { ICONS } from '../../../constants';
import ProductForm from '../../inventory/ProductForm';
import { Link } from 'react-router-dom';
import InventoryTransferForm from '../../inventory/InventoryTransferForm';
import InventoryAdjustmentForm from '../../inventory/InventoryAdjustmentForm';


const Products: React.FC = () => {
    const { products, deleteProduct, hasPermission, warehouses, getProductStockInfo } = useApp();
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [isTransferFormOpen, setIsTransferFormOpen] = useState(false);
    const [isAdjustmentFormOpen, setIsAdjustmentFormOpen] = useState(false);
    
    const [activeProduct, setActiveProduct] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);


    const canManageInventory = hasPermission('envanter:yonet');
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const openModalForNew = () => {
        if (!canManageInventory) return;
        setActiveProduct(null);
        setIsProductFormOpen(true);
    };

    const openModalForEdit = (product: Product) => {
        if (!canManageInventory) return;
        setActiveProduct(product);
        setIsProductFormOpen(true);
        setOpenMenuId(null);
    };
    
    const openTransferForProduct = (product: Product) => {
        setActiveProduct(product);
        setIsTransferFormOpen(true);
        setOpenMenuId(null);
    };

    const openAdjustmentForProduct = (product: Product) => {
        setActiveProduct(product);
        setIsAdjustmentFormOpen(true);
        setOpenMenuId(null);
    };

    const handleDeleteRequest = (product: Product) => {
        setProductToDelete(product);
        setOpenMenuId(null);
    };

    const handleDeleteConfirm = () => {
        if(productToDelete) {
            deleteProduct(productToDelete.id);
            setProductToDelete(null);
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getWarehouseName = (id: number) => warehouses.find(w => w.id === id)?.name || 'Bilinmeyen Depo';

    return (
        <>
            <Card
                title="Tüm Ürünler"
                action={canManageInventory ? <Button onClick={openModalForNew}><span className="flex items-center gap-2">{ICONS.add} Yeni Ürün</span></Button> : undefined}
            >
                <div className="mb-4">
                    <input 
                        type="text"
                        placeholder="Ürün, SKU veya kategori ara..."
                        className="w-full md:w-1/3 p-2 border-border"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto">
                    {filteredProducts.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="border-b dark:border-dark-border">
                                <tr className="bg-slate-50 dark:bg-slate-900/50">
                                    <th className="p-4 font-semibold">SKU</th>
                                    <th className="p-4 font-semibold">Ürün Adı</th>
                                    <th className="p-4 font-semibold">Kategori</th>
                                    <th className="p-4 font-semibold text-right">Fiyat</th>
                                    <th className="p-4 font-semibold text-right">Kullanılabilir Stok</th>
                                    {canManageInventory && <th className="p-4 font-semibold w-20 text-center">Eylemler</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => {
                                    const stockInfo = getProductStockInfo(product.id);
                                    return (
                                    <tr key={product.id} className="border-b border-border dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                                        <td className="p-4 font-mono text-sm">{product.sku}</td>
                                        <td className="p-4 font-medium">
                                            <Link to={`/inventory/products/${product.id}`} className="hover:text-primary-600 dark:hover:text-primary-400 hover:underline">
                                                {product.name}
                                            </Link>
                                        </td>
                                        <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{product.category}</td>
                                        <td className="p-4 font-semibold text-text-main dark:text-dark-text-main text-right">${product.price.toLocaleString()}</td>
                                        <td className={`p-4 font-semibold text-right ${stockInfo.available <= product.lowStockThreshold ? 'text-red-500' : ''}`}>
                                            <div className="group/tooltip relative text-right">
                                                <span>{stockInfo.available}</span>
                                                <div className="absolute bottom-full mb-2 right-0 w-48 bg-slate-800 text-white text-xs rounded-lg p-2 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10">
                                                    <h5 className="font-bold mb-1 border-b border-slate-600 pb-1">Stok Detayı</h5>
                                                    <div className="flex justify-between"><span>Fiziksel Stok:</span> <span>{stockInfo.physical}</span></div>
                                                    <div className="flex justify-between"><span>Ayrılmış Miktar:</span> <span>{stockInfo.committed}</span></div>
                                                    <div className="flex justify-between font-bold"><span>Kullanılabilir:</span> <span>{stockInfo.available}</span></div>
                                                </div>
                                            </div>
                                        </td>
                                        {canManageInventory && <td className="p-4 text-center">
                                            <div className="relative">
                                                <button onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)} className="text-slate-500 hover:text-slate-700 p-1 rounded-full">
                                                     {ICONS.ellipsisVertical}
                                                </button>
                                                {openMenuId === product.id && (
                                                    <div ref={menuRef} className="absolute right-0 mt-2 w-56 bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-md shadow-lg z-20">
                                                        <ul className="py-1">
                                                            <li><button onClick={() => openModalForEdit(product)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800">{ICONS.edit} Düzenle</button></li>
                                                            <li><button onClick={() => openTransferForProduct(product)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800">{ICONS.transfer} Stok Transferi</button></li>
                                                            <li><button onClick={() => openAdjustmentForProduct(product)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800">{ICONS.adjustment} Stok Düzeltmesi</button></li>
                                                            <li><button onClick={() => handleDeleteRequest(product)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800">{ICONS.trash} Sil</button></li>
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </td>}
                                    </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState
                            icon={ICONS.products}
                            title="Henüz Ürün Yok"
                            description="İlk ürününüzü ekleyerek envanterinizi yönetmeye başlayın."
                            action={canManageInventory ? <Button onClick={openModalForNew}>Ürün Ekle</Button> : undefined}
                        />
                    )}
                </div>
            </Card>

            {canManageInventory && (
                <>
                <ProductForm isOpen={isProductFormOpen} onClose={() => setIsProductFormOpen(false)} product={activeProduct} />
                <InventoryTransferForm isOpen={isTransferFormOpen} onClose={() => setIsTransferFormOpen(false)} productToTransfer={activeProduct} />
                <InventoryAdjustmentForm isOpen={isAdjustmentFormOpen} onClose={() => setIsAdjustmentFormOpen(false)} productToAdjust={activeProduct} />
                </>
            )}

            {canManageInventory && <ConfirmationModal 
                isOpen={!!productToDelete}
                onClose={() => setProductToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Ürünü Sil"
                message={`'${productToDelete?.name}' adlı ürünü kalıcı olarak silmek istediğinizden emin misiniz?`}
            />}
        </>
    );
};

export default Products;