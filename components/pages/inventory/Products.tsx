
import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Product } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import EmptyState from '../../ui/EmptyState';
import ConfirmationModal from '../../ui/ConfirmationModal';
import { ICONS } from '../../../constants';
import ProductForm from '../../inventory/ProductForm';
import { Link } from 'react-router-dom';
import InventoryTransferForm from '../../inventory/InventoryTransferForm';
import InventoryAdjustmentForm from '../../inventory/InventoryAdjustmentForm';
import { useNotification } from '../../../context/NotificationContext';


const Products: React.FC = () => {
    const { products, deleteProduct, hasPermission, getProductStockInfo, addToCart } = useApp();
    const { addToast } = useNotification();
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [isTransferFormOpen, setIsTransferFormOpen] = useState(false);
    const [isAdjustmentFormOpen, setIsAdjustmentFormOpen] = useState(false);
    
    const [activeProduct, setActiveProduct] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const canManageInventory = hasPermission('envanter:yonet');
    
    const openModalForNew = () => {
        if (!canManageInventory) return;
        setActiveProduct(null);
        setIsProductFormOpen(true);
    };

    const openModalForEdit = (product: Product) => {
        if (!canManageInventory) return;
        setActiveProduct(product);
        setIsProductFormOpen(true);
    };
    
    const openTransferForProduct = (product: Product) => {
        setActiveProduct(product);
        setIsTransferFormOpen(true);
    };

    const openAdjustmentForProduct = (product: Product) => {
        setActiveProduct(product);
        setIsAdjustmentFormOpen(true);
    };

    const handleDeleteRequest = (product: Product) => {
        setProductToDelete(product);
    };

    const handleDeleteConfirm = () => {
        if(productToDelete) {
            deleteProduct(productToDelete.id);
            setProductToDelete(null);
        }
    };
    
    const handleAddToCart = (product: Product) => {
        const stockInfo = getProductStockInfo(product.id);
        if (stockInfo.available < 1) {
            addToast("Stokta ürün bulunmuyor.", "warning");
            return;
        }
        addToCart(product, 1);
        addToast(`${product.name} sepete eklendi.`, "success");
    };

    const filteredProducts = useMemo(() => {
        return products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);
    
    const actionButtonClasses = "p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors";

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
                        className="w-full md:w-1/3 p-2 border border-border rounded-md dark:bg-slate-700 dark:border-dark-border"
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
                                    <th className="p-4 font-semibold text-right">Mevcut Stok</th>
                                    <th className="p-4 font-semibold w-32 text-center">Eylemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => {
                                    const stockInfo = getProductStockInfo(product.id);
                                    return (
                                    <tr key={product.id} className="border-b border-border dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                                        <td className="p-4 font-mono">{product.sku}</td>
                                        <td className="p-4 font-medium">
                                            <Link to={`/inventory/products/${product.id}`} className="hover:underline text-primary-600">
                                                {product.name}
                                            </Link>
                                        </td>
                                        <td className="p-4 text-text-secondary dark:text-dark-text-secondary">{product.category}</td>
                                        <td className="p-4 text-right font-mono">${product.price.toLocaleString()}</td>
                                        <td className={`p-4 text-right font-mono font-semibold ${stockInfo.available <= product.lowStockThreshold ? 'text-red-500' : ''}`}>{stockInfo.available}</td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleAddToCart(product)} className={`${actionButtonClasses} hover:text-green-600`} title="Sepete Ekle">{ICONS.salesOrder}</button>
                                                {canManageInventory && (
                                                    <>
                                                        <button onClick={() => openModalForEdit(product)} className={`${actionButtonClasses} hover:text-primary-600`} title="Düzenle">{ICONS.edit}</button>
                                                        <button onClick={() => handleDeleteRequest(product)} className={`${actionButtonClasses} hover:text-red-600`} title="Sil">{ICONS.trash}</button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState
                            icon={ICONS.inventory}
                            title="Henüz Ürün Yok"
                            description="İlk ürününüzü ekleyerek envanterinizi yönetmeye başlayın."
                            action={canManageInventory ? <Button onClick={openModalForNew}>Ürün Ekle</Button> : undefined}
                        />
                    )}
                </div>
            </Card>

            {canManageInventory && (
                <>
                <ProductForm 
                   isOpen={isProductFormOpen}
                   onClose={() => setIsProductFormOpen(false)}
                   product={activeProduct}
                />
                <InventoryTransferForm
                    isOpen={isTransferFormOpen}
                    onClose={() => setIsTransferFormOpen(false)}
                    productToTransfer={activeProduct}
                />
                <InventoryAdjustmentForm
                    isOpen={isAdjustmentFormOpen}
                    onClose={() => setIsAdjustmentFormOpen(false)}
                    productToAdjust={activeProduct}
                />
                <ConfirmationModal
                    isOpen={!!productToDelete}
                    onClose={() => setProductToDelete(null)}
                    onConfirm={handleDeleteConfirm}
                    title="Ürünü Sil"
                    message={`'${productToDelete?.name}' adlı ürünü kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve tüm stok hareketlerini etkiler.`}
                />
                </>
            )}
        </>
    );
};

export default Products;
