import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ICONS } from '../../constants';
import { useApp } from '../../context/AppContext';
import { Permission } from '../../types';

interface SettingsLinkProps {
    to: string;
    text: string;
    icon: JSX.Element;
    permission?: Permission;
}

const SettingsLink: React.FC<SettingsLinkProps> = ({ to, text, icon, permission }) => {
    const { hasPermission } = useApp();
    if (permission && !hasPermission(permission)) {
        return null;
    }

    return (
         <NavLink
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-100 text-text-main dark:bg-slate-800 dark:text-dark-text-main'
                  : 'text-text-secondary hover:bg-slate-100 dark:text-dark-text-secondary dark:hover:bg-slate-800'
              }`
            }
          >
            {icon}
            {text}
        </NavLink>
    )
}

interface CollapsibleSettingsGroupProps {
    title: string;
    links: { to: string; text: string; icon: JSX.Element; permission?: Permission; }[];
    basePaths: string[];
}

const CollapsibleSettingsGroup: React.FC<CollapsibleSettingsGroupProps> = ({ title, links, basePaths }) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(basePaths.some(path => location.pathname.startsWith(path)));
    const { hasPermission } = useApp();

    const filteredLinks = links.filter(link => !link.permission || hasPermission(link.permission));
    if (filteredLinks.length === 0) return null;

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center px-3 py-2 text-left text-text-main dark:text-dark-text-main font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
            >
                <span>{title}</span>
                <svg className={`w-4 h-4 text-text-secondary transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
            {isOpen && (
                <div className="pl-4 mt-1 space-y-1">
                    {filteredLinks.map(link => (
                        <SettingsLink key={link.to} {...link} />
                    ))}
                </div>
            )}
        </div>
    );
};


const Settings: React.FC = () => {
    return (
        <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-1/4 lg:w-1/5">
                <h2 className="text-xl font-bold mb-4 px-3">Ayarlar</h2>
                <nav className="space-y-2">
                    <CollapsibleSettingsGroup 
                        title="Genel"
                        basePaths={['/admin/settings/general', '/admin/settings/appearance', '/admin/settings/security']}
                        links={[
                            { to: "/admin/settings/general", text: "Şirket Bilgileri", icon: ICONS.general, permission: "ayarlar:genel-yonet"},
                            { to: "/admin/settings/appearance", text: "Marka & Görünüm", icon: ICONS.appearance, permission: "ayarlar:genel-yonet"},
                            { to: "/admin/settings/security", text: "Güvenlik", icon: ICONS.security, permission: "ayarlar:guvenlik-yonet" }
                        ]}
                    />
                    <CollapsibleSettingsGroup 
                        title="Kullanıcılar & Roller"
                        basePaths={['/admin/settings/users', '/admin/settings/roles']}
                        links={[
                            { to: "/admin/settings/users", text: "Kullanıcılar", icon: ICONS.employees, permission: "kullanici:yonet" },
                            { to: "/admin/settings/roles", text: "Roller & İzinler", icon: ICONS.roles, permission: "ayarlar:roller-yonet" }
                        ]}
                    />
                     <CollapsibleSettingsGroup 
                        title="Özelleştirme"
                        basePaths={['/admin/settings/custom-fields', '/admin/settings/price-lists', '/admin/settings/task-templates']}
                        links={[
                            { to: "/admin/settings/custom-fields", text: "Özel Alanlar", icon: ICONS.customization, permission: "ayarlar:genel-yonet" },
                            { to: "/admin/settings/price-lists", text: "Fiyat Listeleri", icon: ICONS.priceList, permission: "ayarlar:genel-yonet" },
                            { to: "/admin/settings/task-templates", text: "Görev Şablonları", icon: ICONS.planner, permission: "ayarlar:genel-yonet" }
                        ]}
                    />
                     <CollapsibleSettingsGroup 
                        title="Muhasebe & Finans"
                        basePaths={['/admin/settings/accounting', '/admin/settings/taxes', '/admin/settings/cost-centers', '/admin/settings/counters', '/admin/settings/payroll']}
                        links={[
                            { to: "/admin/settings/accounting", text: "Muhasebe Ayarları", icon: ICONS.accounting, permission: "ayarlar:muhasebe-yonet" },
                            { to: "/admin/settings/taxes", text: "Vergi Oranları", icon: ICONS.tax, permission: "ayarlar:vergi-yonet" },
                            { to: "/admin/settings/cost-centers", text: "Maliyet Merkezleri", icon: ICONS.costCenter, permission: "ayarlar:maliyet-merkezi-yonet" },
                            { to: "/admin/settings/counters", text: "Sayaçlar", icon: ICONS.counters, permission: "ayarlar:muhasebe-yonet" },
                            { to: "/admin/settings/payroll", text: "İK & Bordro Ayarları", icon: ICONS.payroll, permission: "ayarlar:ik-bordro-yonet" },
                        ]}
                    />
                     <CollapsibleSettingsGroup 
                        title="Gelişmiş"
                        basePaths={['/admin/settings/integrations', '/admin/settings/data']}
                        links={[
                           { to: "/admin/settings/integrations", text: "Entegrasyonlar", icon: ICONS.integrations, permission: "ayarlar:genel-yonet" },
                           { to: "/admin/settings/data", text: "Veri Yönetimi", icon: ICONS.dataManagement, permission: "ayarlar:genel-yonet" }
                        ]}
                    />
                </nav>
            </aside>
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default Settings;