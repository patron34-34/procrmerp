import React from 'react';
import { NavLink } from 'react-router-dom';
import { Logo, ICONS } from '../../constants';
import { useApp } from '../../context/AppContext';

const PortalSidebar: React.FC = () => {
    const { brandingSettings, currentUser } = useApp();

    const navItemClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center py-3 px-4 my-1 rounded-lg transition-colors duration-200 text-sm font-medium ${
            isActive
                ? 'bg-primary-500/10 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400'
                : 'text-text-secondary dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-white'
        }`;

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
                <ul>
                    <li>
                        <NavLink to="/portal/dashboard" className={navItemClasses} end>
                            {ICONS.dashboard}
                            <span className="ml-4">Kontrol Paneli</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/portal/payslips" className={navItemClasses}>
                            {ICONS.payroll}
                            <span className="ml-4">Maaş Pusulalarım</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/portal/leaves" className={navItemClasses}>
                            {ICONS.leave}
                            <span className="ml-4">İzin Taleplerim</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/portal/expenses" className={navItemClasses}>
                            {ICONS.expenses}
                            <span className="ml-4">Masraflarım</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/portal/assets" className={navItemClasses}>
                            {ICONS.asset}
                            <span className="ml-4">Varlıklarım</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile" className={navItemClasses}>
                            {ICONS.employees}
                            <span className="ml-4">Profilim</span>
                        </NavLink>
                    </li>
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

export default PortalSidebar;