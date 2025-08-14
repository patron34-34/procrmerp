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
              `flex items-center py-2.5 px-4 my-1 rounded-md transition-colors duration-200 text-sm font-medium ${
                isActive
                  ? 'bg-primary-600/10 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400'
                  : 'text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            {React.cloneElement(icon, { className: "h-5 w-5"})}
            <span className="ml-3">{text}</span>
          </NavLink>
        </li>
    );
};

interface CollapsibleMenuLink {
  to: string;
  text: string;
  end?: boolean;
  permission?: Permission;
}

interface CollapsibleMenuProps {
    title: string;
    icon: JSX.Element;
    links: CollapsibleMenuLink[];
    basePaths: string[];
}

const CollapsibleMenu: React.FC<CollapsibleMenuProps> = ({ title, icon, links, basePaths }) => {
    const { hasPermission } = useApp();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(basePaths.some(path => location.pathname.startsWith(path)));
    
    const filteredLinks = links.filter(link => !link.permission || hasPermission(link.permission));

    if (filteredLinks.length === 0) return null;

    return (
        <div className="pt-2">
             <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-2.5 px-4 text-left text-sm font-medium text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
                <span className="flex items-center gap-3">
                    {React.cloneElement(icon, { className: "h-5 w-5"})}
                    {title}
                </span>
                <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
             </button>
            {isOpen && (
                <ul className="pl-4 mt-1">
                {filteredLinks.map((link) => (
                    <li key={link.to}>
                        <NavLink
                            to={link.to}
                            end={link.end}
                            className={({ isActive }) =>
                            `flex items-center py-2 px-3 my-1 rounded-md transition-colors duration-200 text-sm font-medium ${
                                isActive
                                ? 'text-primary-600 dark:text-primary-400'
                                : 'text-text-secondary hover:text-text-main dark:hover:text-dark-text-main'
                            }`
                            }
                        >
                            <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
                            <span className="ml-4">{link.text}</span>
                        </NavLink>
                    </li>
                ))}
                </ul>
            )}
        </div>
    );
}

const Sidebar: React.FC = () => {
  const { brandingSettings } = useApp();
  return (
    <aside className="w-64 bg-sidebar dark:bg-dark-sidebar flex flex-col border-r border-border dark:border-dark-border flex-shrink-0">
      <div className="flex items-center justify-center h-16 border-b border-border dark:border-dark-border px-4">
        {brandingSettings.logoUrl ? (
            <img src={brandingSettings.logoUrl} alt="Company Logo" className="h-8 object-contain" />
        ) : (
            <Logo className="h-8 text-primary-600 dark:text-white" />
        )}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <NavItem to="/" text="Kontrol Paneli" icon={ICONS.dashboard} permission="dashboard:goruntule" end />
        <NavItem to="/planner" text="Planlayıcı" icon={ICONS.planner} permission="gorev:goruntule" />
        
        <CollapsibleMenu title="Müşteriler" icon={ICONS.customers} basePaths={['/customers', '/support']} links={[
            { to: '/customers', text: 'Müşteriler', permission: 'musteri:goruntule' },
            { to: '/support/tickets', text: 'Destek Talepleri', permission: 'destek:goruntule' },
        ]} />
        
        <CollapsibleMenu title="Satış & Sipariş" icon={ICONS.sales} basePaths={['/sales', '/inventory/sales-orders']} links={[
            { to: '/sales', text: 'Satış Hattı', permission: 'anlasma:goruntule' },
            { to: '/inventory/sales-orders', text: 'Satış Siparişleri', permission: 'satis-siparis:goruntule' },
        ]} />

        <CollapsibleMenu title="Operasyonlar" icon={ICONS.projects} basePaths={['/projects', '/documents', '/automations']} links={[
            { to: '/projects', text: 'Projeler', permission: 'proje:goruntule' },
            { to: '/documents', text: 'Dokümanlar', permission: 'dokuman:goruntule' },
            { to: '/automations', text: 'Otomasyon Kuralları', permission: 'otomasyon:goruntule' },
            { to: '/automations/scheduled-tasks', text: 'Planlanmış Görevler', permission: 'otomasyon:yonet' },
        ]} />

        <CollapsibleMenu title="Envanter" icon={ICONS.inventory} basePaths={['/inventory']} links={[
            { to: '/inventory/dashboard', text: 'Kontrol Paneli', permission: 'envanter:goruntule' },
            { to: '/inventory/products', text: 'Ürünler', permission: 'envanter:goruntule' },
            { to: '/inventory/stock-movements', text: 'Stok Hareketleri', permission: 'stok-hareketi:goruntule' },
            { to: '/inventory/shipments', text: 'Sevkiyatlar', permission: 'sevkiyat:goruntule' },
            { to: '/inventory/pick-lists', text: 'Toplama Listeleri', permission: 'toplama-listesi:goruntule' },
            { to: '/inventory/warehouses', text: 'Depolar', permission: 'depo:yonet' },
            { to: '/inventory/suppliers', text: 'Tedarikçiler', permission: 'envanter:goruntule' },
            { to: '/inventory/purchase-orders', text: 'S. Alma Siparişleri', permission: 'envanter:goruntule' },
        ]} />

        <CollapsibleMenu title="Muhasebe" icon={ICONS.accounting} basePaths={['/accounting', '/invoices']} links={[
            { to: '/accounting/dashboard', text: 'Muhasebe Paneli', permission: 'muhasebe:goruntule' },
            { to: '/accounting/reports', text: 'Raporlama', permission: 'rapor:goruntule' },
            { to: '/accounting/journal-entries', text: 'Yevmiye Kayıtları', permission: 'muhasebe:goruntule' },
            { to: '/accounting/chart-of-accounts', text: 'Hesap Planı', permission: 'muhasebe:goruntule' },
            { to: '/invoices', text: 'Satış Faturaları', permission: 'fatura:goruntule' },
            { to: '/accounting/bills', text: 'Gider Faturaları', permission: 'muhasebe:goruntule' },
            { to: '/accounting/bank-accounts', text: 'Banka Hesapları', permission: 'finans:goruntule' },
            { to: '/accounting/transactions', text: 'İşlemler', permission: 'finans:goruntule'},
        ]} />
        
        <CollapsibleMenu title="İnsan Kaynakları" icon={ICONS.hr} basePaths={['/hr']} links={[
            { to: '/hr', text: 'İK Paneli', end: true, permission: 'ik:goruntule' },
            { to: '/hr/employees', text: 'Çalışanlar', permission: 'ik:goruntule' },
            { to: '/hr/leaves', text: 'İzin Yönetimi', permission: 'ik:goruntule' },
            { to: '/hr/payroll', text: 'Bordro', permission: 'ik:bordro-yonet' },
            { to: '/hr/recruitment/jobs', text: 'İşe Alım', permission: 'ik:ise-alim-goruntule' },
        ]} />
        
        <NavItem to="/reports" text="Raporlar" icon={ICONS.reports} permission="rapor:goruntule" />

        <CollapsibleMenu title="Yönetim Paneli" icon={ICONS.adminPanel} basePaths={['/admin']} links={[
             { to: '/admin/dashboard', text: 'Admin Paneli', permission: 'ayarlar:goruntule' },
             { to: '/admin/activity-log', text: 'Aktivite Kayıtları', permission: 'aktivite:goruntule' },
             { to: '/admin/settings', text: 'Ayarlar', permission: 'ayarlar:goruntule' },
        ]} />
      </nav>
    </aside>
  );
};

export default Sidebar;