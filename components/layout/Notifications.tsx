import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ICONS } from '../../constants';
import Button from '../ui/Button';

const Notifications: React.FC = () => {
    const { notifications, markNotificationAsRead, clearAllNotifications } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    
    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getTypeIcon = (type: string) => {
        const baseClasses = "w-5 h-5 mr-3";
        switch (type) {
            case 'success': return <svg className={`${baseClasses} text-green-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
            case 'warning': return <svg className={`${baseClasses} text-yellow-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
            case 'error': return <svg className={`${baseClasses} text-red-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
            default: return <svg className={`${baseClasses} text-blue-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        }
    }

    return (
        <div className="relative" ref={notificationRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
            >
                {ICONS.notification}
                {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </button>
            
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-card rounded-lg shadow-xl z-20 border border-slate-200 dark:bg-dark-card dark:border-dark-border">
                    <div className="p-4 border-b border-slate-200 dark:border-dark-border flex justify-between items-center">
                        <h4 className="font-bold">Bildirimler</h4>
                        <button onClick={clearAllNotifications} className="text-sm text-primary-600 hover:underline">Tümünü Okundu İşaretle</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                           notifications.map(n => (
                               <div 
                                 key={n.id} 
                                 className={`p-3 border-b border-slate-100 dark:border-slate-700 flex items-start ${!n.read ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
                               >
                                    {getTypeIcon(n.type)}
                                    <div className="flex-1">
                                        <p className="text-sm text-text-main dark:text-dark-text-main">{n.message}</p>
                                        <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">{n.timestamp}</p>
                                    </div>
                                    {!n.read && (
                                       <button onClick={() => markNotificationAsRead(n.id)} className="ml-2 w-2 h-2 mt-1 rounded-full bg-primary-500" title="Okundu olarak işaretle"></button>
                                    )}
                               </div>
                           ))
                        ) : (
                            <p className="p-4 text-center text-text-secondary dark:text-dark-text-secondary">Yeni bildirim yok.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;
