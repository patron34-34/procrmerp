import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import GlobalSearch from './GlobalSearch';
import Notifications from './Notifications';
import { useApp } from '../../context/AppContext';
import { Employee } from '../../types';
import CartPopover from '../cart/CartPopover';

const Header: React.FC = () => {
  const location = useLocation();
  const params = useParams<{ id?: string, accountId?: string }>();
  // FIX: Get customers from useApp now
  const { customers, projects, deals, currentUser, employees, setCurrentUser, accounts, journalEntries, budgets, purchaseOrders, pickLists, salesOrders, itemCount } = useApp();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

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
        '/inventory/products': 'Ürünler',
        '/inventory/suppliers': 'Tedarikçiler',
        '/inventory/purchase-orders': 'Satın Alma Siparişleri',
        '/inventory/sales-orders': 'Satış Siparişleri',
        '/inventory/shipments': 'Sevkiyatlar',
        '/inventory/pick-lists': 'Toplama Listeleri',
        '/hr': 'İK Kontrol Paneli',
        '/hr/employees': 'Çalışanlar',
        '/hr/leaves': 'İzin Yönetimi',
        '/hr/organization-chart': 'Organizasyon Şeması',
        '/profile': 'Profilim',
        '/finance/bank-accounts': 'Banka Hesapları',
        '/finance/transactions': 'İşlemler',
        '/accounting/dashboard': 'Muhasebe Paneli',
        '/accounting/chart-of-accounts': 'Hesap Planı',
        '/accounting/journal-entries': 'Yevmiye Kayıtları',
        '/reports': 'Raporlar',
        '/reports/sales': 'Satış Performansı Raporu',
        '/reports/invoices': 'Fatura Durum Raporu',
        '/reports/expenses': 'Gider Analizi Raporu',
        '/support/tickets': 'Destek Talepleri',
        '/admin/activity-log': 'Aktivite Kayıtları',
        '/admin/settings': 'Ayarlar',
        '/access-denied': 'Erişim Engellendi'
    };
    
    // Find a matching key for settings pages
    if (path.startsWith('/admin/settings')) return 'Ayarlar';


    return pageTitles[path] || 'Kontrol Paneli';
  }
  
  const title = getPageTitle();

  return (
    <header className="h-16 bg-sidebar border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
      <div>
        <h1 className="text-xl font-bold text-text-main">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <GlobalSearch />
        <Notifications />
        <div className="relative" ref={cartRef}>
            <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative text-text-secondary hover:text-primary-600 dark:hover:text-primary-400"
                aria-label="Sepeti Görüntüle"
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {itemCount}
                    </span>
                )}
            </button>
            {isCartOpen && <CartPopover onClose={() => setIsCartOpen(false)} />}
        </div>
        <div className="relative" ref={userMenuRef}>
            <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center">
              <div className="text-right hidden sm:block">
                  <span className="font-semibold block text-sm text-text-main">{currentUser.name}</span>
                  <span className="text-xs text-text-secondary">{currentUser.role}</span>
              </div>
              <img
                className="h-9 w-9 rounded-full object-cover ml-3"
                src={currentUser.avatar}
                alt="Kullanıcı avatarı"
              />
            </button>
            {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card rounded-xl shadow-lg z-20 border border-border">
                    <div className="p-2">
                        <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="w-full text-left flex items-center gap-3 px-2 py-2 text-sm text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                           Profilim
                        </Link>
                    </div>
                    <div className="p-2 border-t border-border">
                        <p className="text-xs font-semibold text-text-secondary px-2">Kullanıcı Değiştir</p>
                    </div>
                    <ul className="max-h-60 overflow-y-auto p-2">
                        {employees.map(user => (
                            <li key={user.id}>
                                <button onClick={() => handleUserChange(user)} className="w-full text-left flex items-center gap-3 px-2 py-2 text-sm text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                                   <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                                   <div>
                                     <p className="font-medium text-text-main">{user.name}</p>
                               