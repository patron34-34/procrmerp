import React, { useState, memo, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Logo, ICONS } from '../../constants';
import { useApp } from '../../context/AppContext';
import { Permission } from '../../types';

interface NavItemProps {
  to: string;
  text: string;
  icon: JSX.Element;
  permission: Permission;
  end?: boolean;
}

const NavItem: React.FC<NavItemProps> = memo(({ to, text, icon, permission, end }) => {
    const { hasPermission } = useApp();
    if (!hasPermission(permission)) return null;

    return (
        <li>
          <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center py-2 px-3 my-0.5 rounded-lg transition-colors duration-200 text-sm font-medium ${
                isActive
                  ? 'bg-primary-600/10 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400'
                  : 'text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-text-main dark:hover:text-white'
              }`
            }
          >
            {React.cloneElement(icon, { className: 'h-5 w-5' })}
            <span className="ml-3">{text}</span>
          </NavLink>
        </li>
    );
});

interface CollapsibleNavItemProps {
  text: string;
  icon: JSX.Element;
  children: React.ReactNode;
  basePaths: string[];
  permissions: Permission[];
}

const CollapsibleNavItem: React.FC<CollapsibleNavItemProps> = memo(({ text, icon, children, basePaths, permissions }) => {
  const location = useLocation();
  const { hasPermission } = useApp();
  
  const hasAccessToAnyChild = useMemo(() => 
    permissions.some(p => hasPermission(p)),
    [permissions, hasPermission]
  );
  
  const [isOpen, setIsOpen] = useState(basePaths.some(path => location.pathname.startsWith(path)));
  
  if (!hasAccessToAnyChild) return null;
  
  const isActive = basePaths.some(path => location.pathname.startsWith(path));

  return (
    <li>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between py-2 px-3 my-0.5 rounded-lg transition-colors duration-200 text-sm font-medium text-left ${
            isActive ? 'text-text-main dark:text-white' : 'text-text-secondary dark:text-slate-400'
        } hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-text-main dark:hover:text-white`}
      >
        <div className="flex items-center">
            {React.cloneElement(icon, { className: 'h-5 w-5' })}
            <span className="ml-3">{text}</span>
        </div>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
      </button>
      {isOpen && (
        <ul className="pl-4 py-1 space-y-0.5 border-l-2 border-slate-100 dark:border-slate-800 ml-4">
          {children}
        </ul>
      )}
    </li>
  );
});


const Sidebar: React.FC = () => {
    const { brandingSettings } = useApp();

    return (
        <aside className="w-64 bg-sidebar flex flex-col border-r border-border flex-shrink-0">
            <div className="flex items-center justify-center h-16 border-b border-border px-4">
                {brandingSettings.logoUrl ? (
                    <img src={brandingSettings.logoUrl} alt="Company Logo" className="h-8 object-contain" />
                ) : (
                    <Logo className="h-8 text-text-main" />
                )}
            </div>
            <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
                <div>
                     <h3 className="px-3 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">Ana Menü</h3>
                     <ul className="space-y-1">
                        <NavItem to="/" text="Kontrol Paneli" icon={ICONS.dashboard} permission="dashboard:goruntule" end />
                        <NavItem to="/customers" text="Müşteriler" icon={ICONS.customers} permission="musteri:goruntule" />
                        <CollapsibleNavItem text="Satış" icon={ICONS.sales} basePaths={['/sales']} permissions={['anlasma:goruntule', 'rapor:goruntule']}>
                            <NavItem to="/sales" text="Satış Hattı" icon={ICONS.sales} permission="anlasma:goruntule" end />
                            <NavItem to="/sales/leads" text="Potansiyel Müşteriler" icon={ICONS.customers} permission="anlasma:goruntule" />
                            <NavItem to="/sales/quotations" text="Teklifler" icon={ICONS.documents} permission="anlasma:goruntule" />
                            <NavItem to="/sales/my-commissions" text="Komisyonlarım" icon={ICONS.commission} permission="anlasma:goruntule" />
                            <NavItem to="/sales/analytics" text="Satış Analizi" icon={ICONS.analytics} permission="rapor:goruntule" />
                        </CollapsibleNavItem>
                        <NavItem to="/projects" text="Projeler" icon={ICONS.projects} permission="proje:goruntule" />
                        <NavItem to="/planner" text="Planlayıcı" icon={ICONS.planner} permission="gorev:goruntule" />
                        <NavItem to="/calendar" text="Takvim" icon={ICONS.calendar} permission="takvim:goruntule" />
                     </ul>
                </div>
                 <div>
                    <h3 className="px-3 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">Modüller</h3>
                     <ul className="space-y-1">
                        <CollapsibleNavItem text="Faturalandırma" icon={ICONS.invoices} basePaths={['/invoicing']} permissions={['fatura:goruntule', 'fatura:yonet', 'muhasebe:yonet', 'muhasebe:goruntule']}>
                            <NavItem to="/invoicing/dashboard" text="Kontrol Paneli" icon={ICONS.dashboard} permission="fatura:goruntule" />
                            
                            <CollapsibleNavItem text="Satış Faturaları" icon={ICONS.export} basePaths={['/invoicing/new', '/invoicing/drafts', '/invoicing/outgoing', '/invoicing/returns', '/invoicing/archive/outgoing']} permissions={['fatura:yonet', 'fatura:goruntule']}>
                                <NavItem to="/invoicing/new" text="Yeni Fatura Oluştur" icon={ICONS.add} permission="fatura:yonet" />
                                <NavItem to="/invoicing/drafts" text="Taslaklar" icon={ICONS.edit} permission="fatura:goruntule" />
                                <NavItem to="/invoicing/outgoing" text="Giden Faturalar" icon={ICONS.documents} permission="fatura:goruntule" />
                                <NavItem to="/invoicing/returns" text="Satış İadeleri" icon={ICONS.reverse} permission="fatura:yonet" />
                                <NavItem to="/invoicing/archive/outgoing" text="Giden Fatura Arşivi" icon={ICONS.archive} permission="fatura:goruntule" />
                            </CollapsibleNavItem>

                            <CollapsibleNavItem text="Gider Faturaları" icon={ICONS.import} basePaths={['/invoicing/incoming', '/invoicing/archive/incoming']} permissions={['muhasebe:yonet', 'muhasebe:goruntule']}>
                                <NavItem to="/invoicing/incoming" text="Gelen Faturalar" icon={ICONS.documents} permission="muhasebe:yonet" />
                                <NavItem to="/invoicing/archive/incoming" text="Gelen Fatura Arşivi" icon={ICONS.archive} permission="muhasebe:goruntule" />
                            </CollapsibleNavItem>
                        </CollapsibleNavItem>

                        <CollapsibleNavItem text="Envanter" icon={ICONS.inventory} basePaths={['/inventory', '/manufacturing']} permissions={['envanter:goruntule', 'envanter:yonet', 'satis-siparis:goruntule', 'depo:yonet', 'stok-hareketi:goruntule', 'sevkiyat:goruntule', 'toplama-listesi:goruntule']}>
                            <NavItem to="/inventory/dashboard" text="Kontrol Paneli" icon={ICONS.dashboard} permission="envanter:goruntule" />
                            <NavItem to="/inventory/products" text="Ürünler" icon={ICONS.list} permission="envanter:goruntule" />
                            <NavItem to="/inventory/suppliers" text="Tedarikçiler" icon={ICONS.suppliers} permission="envanter:goruntule" />
                            <NavItem to="/inventory/purchase-orders" text="Satın Alma" icon={ICONS.purchaseOrder} permission="envanter:yonet" />
                            <NavItem to="/inventory/sales-orders" text="Satış Siparişleri" icon={ICONS.salesOrder} permission="satis-siparis:goruntule" />
                            <NavItem to="/inventory/warehouses" text="Depolar" icon={ICONS.warehouse} permission="depo:yonet" />
                            <NavItem to="/inventory/movements" text="Stok Hareketleri" icon={ICONS.transfer} permission="stok-hareketi:goruntule" />
                            <NavItem to="/inventory/shipments" text="Sevkiyatlar" icon={ICONS.shipment} permission="sevkiyat:goruntule" />
                            <NavItem to="/inventory/pick-lists" text="Toplama Listeleri" icon={ICONS.pickList} permission="toplama-listesi:goruntule" />
                            <CollapsibleNavItem text="Üretim" icon={ICONS.manufacturing} basePaths={['/manufacturing']} permissions={['envanter:yonet']}>
                                <NavItem to="/manufacturing/boms" text="Ürün Reçeteleri" icon={ICONS.list} permission="envanter:yonet" />
                                <NavItem to="/manufacturing/work-orders" text="İş Emirleri" icon={ICONS.tasks} permission="envanter:yonet" />
                            </CollapsibleNavItem>
                        </CollapsibleNavItem>
                        
                        <CollapsibleNavItem text="İK" icon={ICONS.hr} basePaths={['/hr', '/my-team']} permissions={['ik:goruntule', 'ik:izin-yonet', 'ik:bordro-yonet', 'ik:performans-yonet']}>
                            <NavItem to="/hr" text="İK Paneli" icon={ICONS.dashboard} permission="ik:goruntule" end />
                            <NavItem to="/hr/employees" text="Çalışanlar" icon={ICONS.employees} permission="ik:goruntule" />
                            <NavItem to="/hr/leaves" text="İzin Yönetimi" icon={ICONS.leave} permission="ik:izin-yonet" />
                            <NavItem to="/hr/payroll" text="Bordro" icon={ICONS.payroll} permission="ik:bordro-yonet" />
                            <NavItem to="/my-team" text="Ekibim" icon={ICONS.team} permission="ik:goruntule" />
                        </CollapsibleNavItem>

                        <CollapsibleNavItem text="Muhasebe" icon={ICONS.accounting} basePaths={['/accounting', '/finance']} permissions={['muhasebe:goruntule', 'finans:goruntule', 'muhasebe:yonet']}>
                            <NavItem to="/accounting/dashboard" text="Kontrol Paneli" icon={ICONS.dashboard} permission="muhasebe:goruntule" />
                            <NavItem to="/accounting/chart-of-accounts" text="Hesap Planı" icon={ICONS.list} permission="muhasebe:goruntule" />
                            <NavItem to="/accounting/journal-entries" text="Yevmiye Kayıtları" icon={ICONS.ledger} permission="muhasebe:yonet" />
                            <NavItem to="/finance/bank-accounts" text="Banka Hesapları" icon={ICONS.bank} permission="finans:goruntule" />
                        </CollapsibleNavItem>
                        
                        <NavItem to="/reports" text="Raporlar" icon={ICONS.reports} permission="rapor:goruntule" />
                        <NavItem to="/support/tickets" text="Destek" icon={ICONS.support} permission="destek:goruntule" />
                        <NavItem to="/documents" text="Dokümanlar" icon={ICONS.documents} permission="dokuman:goruntule" />
                        <NavItem to="/automations" text="Otomasyonlar" icon={ICONS.magic} permission="otomasyon:goruntule" />
                     </ul>
                </div>
                <div>
                     <h3 className="px-3 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">Yönetim</h3>
                     <ul className="space-y-1">
                        <NavItem to="/admin/settings" text="Ayarlar" icon={ICONS.settings} permission="ayarlar:goruntule" />
                        <NavItem to="/admin/activity-log" text="Aktivite Kayıtları" icon={ICONS.list} permission="aktivite:goruntule" />
                     </ul>
                </div>
            </nav>
        </aside>
    );
};

export default memo(Sidebar);