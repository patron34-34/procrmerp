import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
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
            {React.cloneElement(icon, {className: 'h-5 w-5'})}
            {text}
        </NavLink>
    )
}

const Settings: React.FC = () => {
    return (
        <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-1/4 lg:w-1/5">
                <h2 className="text-xl font-bold mb-4 px-3">Ayarlar</h2>
                <nav className="space-y-4">
                    <div>
                        <h3 className="px-3 text-xs font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider mb-2">Genel</h3>
                        <div className="space-y-1">
                            <SettingsLink to="/admin/settings/general" text="Şirket Bilgileri" icon={ICONS.general} permission="ayarlar:genel-yonet"/>
                            <SettingsLink to="/admin/settings/appearance" text="Marka & Görünüm" icon={ICONS.appearance} permission="ayarlar:genel-yonet"/>
                            <SettingsLink to="/admin/settings/security" text="Güvenlik" icon={ICONS.security} permission="ayarlar:guvenlik-yonet" />
                        </div>
                    </div>
                     <div>
                        <h3 className="px-3 text-xs font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider mb-2">Kullanıcılar & Roller</h3>
                        <div className="space-y-1">
                            <SettingsLink to="/admin/settings/users" text="Kullanıcılar" icon={ICONS.employees} permission="kullanici:yonet" />
                            <SettingsLink to="/admin/settings/roles" text="Roller & İzinler" icon={ICONS.roles} permission="ayarlar:roller-yonet" />
                        </div>
                    </div>
                     <div>
                        <h3 className="px-3 text-xs font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider mb-2">Özelleştirme</h3>
                        <div className="space-y-1">
                            <SettingsLink to="/admin/settings/custom-fields" text="Özel Alanlar" icon={ICONS.customization} permission="ayarlar:genel-yonet" />
                            <SettingsLink to="/admin/settings/price-lists" text="Fiyat Listeleri" icon={ICONS.priceList} permission="ayarlar:genel-yonet" />
                            <SettingsLink to="/admin/settings/task-templates" text="Görev Şablonları" icon={ICONS.planner} permission="ayarlar:genel-yonet" />
                        </div>
                    </div>
                    <div>
                        <h3 className="px-3 text-xs font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider mb-2">Muhasebe</h3>
                        <div className="space-y-1">
                            <SettingsLink to="/admin/settings/accounting" text="Muhasebe Ayarları" icon={ICONS.accounting} permission="ayarlar:muhasebe-yonet" />
                            <SettingsLink to="/admin/settings/taxes" text="Vergi Oranları" icon={ICONS.tax} permission="ayarlar:vergi-yonet" />
                            <SettingsLink to="/admin/settings/cost-centers" text="Maliyet Merkezleri" icon={ICONS.costCenter} permission="ayarlar:maliyet-merkezi-yonet" />
                        </div>
                    </div>
                     <div>
                        <h3 className="px-3 text-xs font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider mb-2">Gelişmiş</h3>
                        <div className="space-y-1">
                            <SettingsLink to="/admin/settings/integrations" text="Entegrasyonlar" icon={ICONS.integrations} permission="ayarlar:genel-yonet" />
                            <SettingsLink to="/admin/settings/data" text="Veri Yönetimi" icon={ICONS.dataManagement} permission="ayarlar:genel-yonet" />
                        </div>
                    </div>
                </nav>
            </aside>
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default Settings;