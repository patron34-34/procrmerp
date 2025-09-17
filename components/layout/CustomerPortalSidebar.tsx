import React from 'react';
import { NavLink } from 'react-router-dom';
import { Logo, ICONS } from '../../constants';
import { useApp } from '../../context/AppContext';

const NavItem: React.FC<{ to: string; text: string; icon: JSX.Element; end?: boolean; }> = ({ to, text, icon, end }) => (
    <li>
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
                `flex items-center py-3 px-4 my-1 rounded-lg transition-colors duration-200 text-sm font-medium ${
                    isActive
                        ? 'bg-primary-500/10 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400'
                        : 'text-text-secondary dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-white'
                }`
            }
        >
            {React.cloneElement(icon, { className: 'h-5 w-5' })}
            <span className="ml-4">{text}</span>
        </NavLink>
    </li>
);

const CustomerPortalSidebar: React.FC = () => {
    const { brandingSettings, currentUser } = useApp();

    return (
        <aside className="w-64 bg-sidebar dark:bg-dark-sidebar flex flex-col border-r border-border dark:border-dark-border flex-shrink-0">
            <div className="flex items-center justify-center h-16 border-b border-border dark:border-dark-border px-4">
                {brandingSettings.logoUrl ? (
                    <img src={brandingSettings.logoUrl} alt="Company Logo" className="h-8 object-contain" />
                ) : (
                    <Logo className="h-8 text-text-main dark:text-dark-text-main" />
                )}
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
                <h3 className="px-3 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">Müşteri Portalı</h3>
                <ul>
                    <NavItem to="/portal/customer/dashboard" text="Kontrol Paneli" icon={ICONS.dashboard} end />
                    <NavItem to="/portal/customer/invoices" text="Faturalarım" icon={ICONS.invoices} />
                    <NavItem to="/portal/customer/projects" text="Projelerim" icon={ICONS.projects} />
                    <NavItem to="/portal/customer/tickets" text="Destek Taleplerim" icon={ICONS.support} />
                    <NavItem to="/portal/customer/profile" text="Profilim" icon={ICONS.employees} />
                </ul>
            </nav>
            <div className="px-4 py-4 border-t border-border dark:border-dark-border mt-auto">
                 <div className="flex items-center gap-3">
                    <img src={currentUser.avatar} alt={currentUser.name} className="h-10 w-10 rounded-full" />
                    <div>
                        <p className="font-semibold text-sm">{currentUser.name}</p>
                        <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{currentUser.position}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default CustomerPortalSidebar;