import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ICONS } from '../../constants';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

interface CartPopoverProps {
  onClose: () => void;
}

const CartPopover: React.FC<CartPopoverProps> = ({ onClose }) => {
    const { cartItems, removeFromCart, updateCartQuantity, clearCart, customers, createSalesOrderFromCart } = useApp();
    const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || 0);
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = () => {
        if (selectedCustomerId > 0) {
            createSalesOrderFromCart(selectedCustomerId);
            onClose();
            navigate('/inventory/sales-orders');
        } else {
            alert('Lütfen bir müşteri seçin.');
        }
    };

    return (
        <div className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-lg z-20 border border-border dark:bg-dark-card dark:border-dark-border">
            <div className="p-4 border-b dark:border-dark-border">
                <h4 className="font-bold">Alışveriş Sepeti</h4>
            </div>
            <div className="max-h-80 overflow-y-auto p-4 space-y-3">
                {cartItems.length > 0 ? (
                    cartItems.map(item => (
                        <div key={item.productId} className="flex items-center gap-3">
                            <div className="flex-grow">
                                <p className="font-semibold text-sm truncate">{item.productName}</p>
                                <p className="text-xs text-text-secondary">${item.price.toFixed(2)}</p>
                            </div>
                            <input
                                type="number"
                                value={item.quantity}
                                onChange={e => updateCartQuantity(item.productId, parseInt(e.target.value, 10))}
                                className="w-16 p-1 text-center border rounded-md dark:bg-slate-700 dark:border-dark-border"
                                min="1"
                            />
                            <button onClick={() => removeFromCart(item.productId)} className="text-red-500 hover:text-red-700">{ICONS.trash}</button>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-text-secondary">Sepetiniz boş.</p>
                )}
            </div>
            {cartItems.length > 0 && (
                <div className="p-4 border-t dark:border-dark-border space-y-3">
                    <div className="flex justify-between font-semibold">
                        <span>Ara Toplam:</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                     <div>
                        <label className="text-sm font-medium">Müşteri</label>
                        <select value={selectedCustomerId} onChange={e => setSelectedCustomerId(Number(e.target.value))} className="w-full p-2 border rounded-md mt-1 dark:bg-slate-700 dark:border-dark-border">
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <Button onClick={handleCheckout} className="w-full justify-center" disabled={!selectedCustomerId}>Sipariş Oluştur</Button>
                    <Button onClick={clearCart} variant="secondary" className="w-full justify-center">Sepeti Temizle</Button>
                </div>
            )}
        </div>
    );
};

export default CartPopover;
