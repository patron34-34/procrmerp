import React, { useState } from 'react';
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

const NavItem: React.FC<NavItemProps> = ({ to, text, icon, permission, end }) => {
    const { hasPermission } = useApp();
    if (!hasPermission(permission)) return null;

    return (
        <li>
          <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center py-2.5 px-4 my-1 rounded-lg transition-colors duration-200 text-sm font-medium ${
                isActive
                  ? 'bg-primary-500/10 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400'
                  : 'text-text-secondary hover:bg-slate-100 dark:hover:bg-dark-border'
              }`
            }
          >
            {React.cloneElement(icon, { className: 'h-5 w-5' })}
            <span className="ml-4">{text}</span>
          </NavLink>
        </li>
    );
};

interface CollapsibleNavItemProps {
  text: string;
  icon: JSX.Element;
  children: React.ReactNode;
  basePaths: string[];
}

const CollapsibleNavItem: React.FC<CollapsibleNavItemProps> = ({ text, icon, children, basePaths }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(basePaths.some(path => location.pathname.startsWith(path)));

  return (
    <li>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2.5 px-4 my-1 rounded-lg transition-colors duration-200 text-sm font-medium text-text-secondary hover:bg-slate-100 dark:hover:bg-dark-border"
      >
        <div className="flex items-center">
            {icon}
            <span className="ml-4">{text}</span>
        </div>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
      </button>
      {isOpen && (
        <ul className="pl-8 py-1 space-y-1">
          {children}
        </ul>
      )}
    </li>
  );
};


const Sidebar: React.FC = () => {
    const { brandingSettings } = useApp();

    return (
        <aside className="w-64 bg-sidebar dark:bg-dark-sidebar flex flex-col border-r border-border dark:border-dark-border flex-shrink-0">
            <div className="flex items-center justify-center h-16 border-b border-border dark:border-dark-border px-4">
                {brandingSettings.logoUrl ? (
                    <img src={brandingSettings.logoUrl} alt="Company Logo" className="h-8 object-contain" />
                ) : (
                    <Logo className="h-8 text-text-main dark:text-dark-text-main" />
                )}
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                <ul>
                    <NavItem to="/" text="Kontrol Paneli" icon={ICONS.dashboard} permission="dashboard:goruntule" end />
                    <NavItem to="/customers" text="Müşteriler" icon={ICONS.customers} permission="musteri:goruntule" />
                    <NavItem to="/sales" text="Satış" icon={ICONS.sales} permission="anlasma:goruntule" />
                    <NavItem to="/projects" text="Projeler" icon={ICONS.projects} permission="proje:goruntule" />
                    <NavItem to="/planner" text="Planlayıcı" icon={ICONS.planner} permission="gorev:goruntule" />
                    <NavItem to="/calendar" text="Takvim" icon={ICONS.calendar} permission="takvim:goruntule" />
                    
                    <CollapsibleNavItem text="Faturalandırma" icon={ICONS.invoices} basePaths={['/invoicing']}>
                        <NavItem to="/invoicing/new" text="Fatura Oluştur" icon={ICONS.add} permission="fatura:yonet" />
                        <NavItem to="/invoicing/drafts" text="Taslak Faturalar" icon={ICONS.edit} permission="fatura:goruntule" />
                        <NavItem to="/invoicing/outgoing" text="Giden Faturalar" icon={ICONS.export} permission="fatura:goruntule" />
                        <NavItem to="/invoicing/incoming" text="Gelen Faturalar (Gider)" icon={ICONS.import} permission="muhasebe:yonet" />
                        <NavItem to="/invoicing/archive/outgoing" text="Giden Arşivi" icon={ICONS.warehouse} permission="fatura:goruntule" />
                        <NavItem to="/invoicing/archive/incoming" text="Gelen Arşivi" icon={ICONS.warehouse} permission="muhasebe:yonet" />
                    </CollapsibleNavItem>

                    <CollapsibleNavItem text="Envanter" icon={ICONS.inventory} basePaths={['/inventory', '/sales/shipments', '/sales/pick-lists']}>
                        <NavItem to="/inventory/dashboard" text="Kontrol Paneli" icon={ICONS.dashboard} permission="envanter:goruntule" />
                        <NavItem to="/inventory/products" text="Ürünler" icon={ICONS.list} permission="envanter:goruntule" />
                        <NavItem to="/inventory/suppliers" text="Tedarikçiler" icon={ICONS.suppliers} permission="envanter:goruntule" />
                        <NavItem to="/inventory/purchase-orders" text="Satın Alma Siparişleri" icon={ICONS.purchaseOrder} permission="envanter:yonet" />
                        <NavItem to="/inventory/sales-orders" text="Satış Siparişleri" icon={ICONS.salesOrder} permission="satis-siparis:goruntule" />
                        <NavItem to="/sales/shipments" text="Sevkiyatlar" icon={ICONS.shipment} permission="sevkiyat:goruntule" />
                        <NavItem to="/sales/pick-lists" text="Toplama Listeleri" icon={ICONS.pickList} permission="toplama-listesi:goruntule" />
                        <NavItem to="/inventory/stock-movements" text="Stok Hareketleri" icon={ICONS.transfer} permission="stok-hareketi:goruntule" />
                        <NavItem to="/inventory/warehouses" text="Depolar" icon={ICONS.warehouse} permission="depo:yonet" />
                    </CollapsibleNavItem>

                    <CollapsibleNavItem text="Üretim" icon={ICONS.manufacturing} basePaths={['/manufacturing']}>
                        <NavItem to="/manufacturing/boms" text="Ürün Reçeteleri" icon={ICONS.list} permission="envanter:yonet" />
                        <NavItem to="/manufacturing/work-orders" text="İş Emirleri" icon={ICONS.tasks} permission="envanter:yonet" />
                    </CollapsibleNavItem>
                    
                    <CollapsibleNavItem text="İnsan Kaynakları" icon={ICONS.hr} basePaths={['/hr', '/my-team']}>
                        <NavItem to="/hr" text="İK Paneli" icon={ICONS.dashboard} permission="ik:goruntule" end />
                        <NavItem to="/hr/employees" text="Çalışanlar" icon={ICONS.employees} permission="ik:goruntule" />
                        <NavItem to="/hr/leaves" text="İzin Yönetimi" icon={ICONS.leave} permission="ik:izin-yonet" />
                        <NavItem to="/hr/payroll" text="Bordro" icon={ICONS.payroll} permission="ik:bordro-yonet" />
                        <NavItem to="/hr/performance" text="Performans" icon={ICONS.analytics} permission="ik:performans-yonet" />
                        <NavItem to="/hr/recruitment/jobs" text="İşe Alım" icon={ICONS.search} permission="ik:ise-alim-yonet" />
                        <NavItem to="/hr/onboarding/workflows" text="Oryantasyon" icon={ICONS.tasks} permission="ik:oryantasyon-yonet" />
                        <NavItem to="/hr/expense-management" text="Masraf Yönetimi" icon={ICONS.expenses} permission="ik:masraf-yonet" />
                        <NavItem to="/hr/asset-management" text="Varlık Yönetimi" icon={ICONS.asset} permission="ik:varlik-yonet" />
                        <NavItem to="/hr/reports" text="İK Raporları" icon={ICONS.reports} permission="ik:rapor-goruntule" />
                        <NavItem to="/my-team" text="Ekibim" icon={ICONS.team} permission="ik:goruntule" />
                    </CollapsibleNavItem>

                    <CollapsibleNavItem text="Finans" icon={ICONS.bank} basePaths={['/finance']}>
                        <NavItem to="/finance/bank-accounts" text="Banka Hesapları" icon={ICONS.bank} permission="finans:yonet" />
                        <NavItem to="/finance/transactions" text="Giderler" icon={ICONS.expenses} permission="finans:yonet" />
                        <NavItem to="/finance/budgets" text="Bütçeler" icon={ICONS.budget} permission="muhasebe:butce-yonet" />
                        <NavItem to="/finance/bank-reconciliation" text="Banka Mutabakatı" icon={ICONS.check} permission="muhasebe:mutabakat-yap" />
                    </CollapsibleNavItem>

                    <CollapsibleNavItem text="Muhasebe" icon={ICONS.accounting} basePaths={['/accounting']}>
                        <NavItem to="/accounting/dashboard" text="Kontrol Paneli" icon={ICONS.dashboard} permission="muhasebe:goruntule" />
                        <NavItem to="/accounting/chart-of-accounts" text="Hesap Planı" icon={ICONS.list} permission="muhasebe:goruntule" />
                        <NavItem to="/accounting/journal-entries" text="Yevmiye Kayıtları" icon={ICONS.ledger} permission="muhasebe:yonet" />
                        <NavItem to="/accounting/recurring-journal-entries" text="Tekrarlanan Kayıtlar" icon={ICONS.reverse} permission="muhasebe:tekrarlanan-yonet" />
                        <NavItem to="/accounting/reports" text="Raporlar" icon={ICONS.reports} permission="rapor:goruntule" />
                    </CollapsibleNavItem>
                    
                    <NavItem to="/reports" text="Raporlar" icon={ICONS.reports} permission="rapor:goruntule" />
                    <NavItem to="/support/tickets" text="Destek" icon={ICONS.support} permission="destek:goruntule" />
                    <NavItem to="/documents" text="Dokümanlar" icon={ICONS.documents} permission="dokuman:goruntule" />
                    <NavItem to="/automations" text="Otomasyonlar" icon={ICONS.magic} permission="otomasyon:goruntule" />
                    
                    <CollapsibleNavItem text="Yönetim" icon={ICONS.adminPanel} basePaths={['/admin']}>
                        <NavItem to="/admin/dashboard" text="Kontrol Paneli" icon={ICONS.dashboard} permission="ayarlar:goruntule" />
                        <NavItem to="/admin/activity-log" text="Aktivite Kayıtları" icon={ICONS.list} permission="aktivite:goruntule" />
                        <NavItem to="/admin/settings" text="Ayarlar" icon={ICONS.security} permission="ayarlar:goruntule" />
                    </CollapsibleNavItem>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;