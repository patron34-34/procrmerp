import React, { useState, useRef, useEffect, memo } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import GlobalSearch from './GlobalSearch';
import Notifications from './Notifications';
import { useApp } from '../../context/AppContext';
import { Employee } from '../../types';
import CartPopover from '../cart/CartPopover';
import { ICONS } from '../../constants';

const Header: React.FC = () => {
  const location = useLocation();
  const params = useParams<{ id?: string, accountId?: string }>();
  const { customers, projects, deals, currentUser, employees, setCurrentUser, accounts, journalEntries, budgets, purchaseOrders, pickLists, salesOrders, itemCount, notifications } = useApp();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserChange = (user: Employee) => {
    setCurrentUser(user);
    setIsUserMenuOpen(false);
  }

  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path.startsWith('/customers/')) {
        const customerId = parseInt(params.id || '', 10);
        const customer = customers.find(c => c.id === customerId);
        return customer ? customer.name : 'Müşteri Detayı';
    }
    if (path.startsWith('/projects/')) {
        const projectId = parseInt(params.id || '', 10);
        const project = projects.find(p => p.id === projectId);
        return project ? `Proje: ${project.name}` : 'Proje Detayı';
    }
    if (path.startsWith('/deals/')) {
        const dealId = parseInt(params.id || '', 10);
        const deal = deals.find(d => d.id === dealId);
        return deal ? `Anlaşma: ${deal.title}` : 'Anlaşma Detayı';
    }
     if (path.startsWith('/inventory/sales-orders/')) {
        const orderId = parseInt(params.id || '', 10);
        const order = salesOrders.find(o => o.id === orderId);
        return order ? `Sipariş: ${order.orderNumber}` : 'Satış Siparişi Detayı';
    }
    if (path.startsWith('/hr/employees/')) {
        const employeeId = parseInt(params.id || '', 10);
        const employee = employees.find(e => e.id === employeeId);
        return employee ? employee.name : 'Çalışan Detayı';
    }
    if (path.startsWith('/accounting/journal-entries/')) {
        if (path.endsWith('/edit') || path.endsWith('/new')) {
             return path.endsWith('/edit') ? 'Yevmiye Fişini Düzenle' : 'Yeni Yevmiye Kaydı';
        }
        const entryId = parseInt(params.id || '', 10);
        const entry = journalEntries.find(e => e.id === entryId);
        return entry ? `Yevmiye: ${entry.entryNumber}` : 'Yevmiye Detayı';
    }
     if (path.startsWith('/accounting/budgets/')) {
        const budgetId = parseInt(params.id || '', 10);
        const budget = budgets.find(b => b.id === budgetId);
        return budget ? `Bütçe: ${budget.name}` : 'Bütçe Detayı';
    }
     if (path.startsWith('/accounting/reports/general-ledger/')) {
        const accountId = parseInt(params.accountId || '', 10);
        const account = accounts.find(a => a.id === accountId);
        return account ? `Muavin: ${account.name}` : 'Defter-i Kebir';
    }
    if (path.startsWith('/inventory/purchase-orders/')) {
        if (path.endsWith('/new')) return 'Yeni Satın Alma Siparişi';
        if (path.includes('/edit')) {
            const poId = parseInt(params.id || '', 10);
            const po = purchaseOrders.find(p => p.id === poId);
            return po ? `S.A. Düzenle: ${po.poNumber}` : 'S.A. Siparişi Düzenle';
        }
    }
    if (path.startsWith('/inventory/pick-lists/')) {
        const pickListId = parseInt(params.id || '', 10);
        const pickList = pickLists.find(p => p.id === pickListId);
        return pickList ? `Toplama Listesi: ${pickList.pickListNumber}` : 'Toplama Listesi Detayı';
    }


    const pageTitles: { [key: string]: string } = {
        '/': 'Kontrol Paneli',
        '/customers': 'Müşteriler',
        '/sales': 'Satış Hattı',
        '/projects': 'Projeler',
        '/planner': 'Planlayıcı',
        '/documents': 'Doküman Yönetimi',
        '/invoicing/outgoing': 'Giden Faturalar',
    };
    return pageTitles[path] || 'ProFusion';
  };

  return (
    <header className="flex items-center justify-between h-16 px-8 bg-sidebar border-b border-border flex-shrink-0">
        <h1 className="text-2xl font-bold text-text-main">{getPageTitle()}</h1>

        <div className="flex items-center gap-4">
            <GlobalSearch />
            
            <div className="relative" ref={cartRef}>
                <button onClick={() => setIsCartOpen(!isCartOpen)} className="relative text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">
                    {ICONS.salesOrder}
                    {itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                            {itemCount}
                        </span>
                    )}
                </button>
                {isCartOpen && <CartPopover onClose={() => setIsCartOpen(false)} />}
            </div>

            <Notifications />

            <div className="relative" ref={userMenuRef}>
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2">
                    <img src={currentUser.avatar} alt={currentUser.name} className="h-9 w-9 rounded-full" />
                    <span className="hidden md:inline text-sm font-medium">{currentUser.name}</span>
                </button>
                {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-lg z-20 border border-border py-1">
                        <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800">Profilim</Link>
                        <div className="border-t border-border my-1"></div>
                        {employees.map(user => (
                            <button key={user.id} onClick={() => handleUserChange(user)} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800">
                                Geçiş yap: {user.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </header>
  );
};

export default memo(Header);