import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ICONS } from '../../constants';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';
import { Notification } from '../../types';

const Notifications: React.FC = () => {
    const { notifications, markNotificationAsRead, clearAllNotifications, deleteAllNotifications } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const [hasNew, setHasNew] = useState(false);
    
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

    useEffect(() => {
        if (unreadCount > 0) {
            setHasNew(true);
            const timer = setTimeout(() => setHasNew(false), 2000); // Animation duration
            return () => clearTimeout(timer);
        }
    }, [unreadCount]);


    const getTypeIcon = (type: string) => {
        const baseClasses = "w-5 h-5 mr-3 flex-shrink-0";
        switch (type) {
            case 'success': return <div className={`${baseClasses} text-green-500`}>{ICONS.check}</div>;
            case 'warning': return <div className={`${baseClasses} text-yellow-500`}>{ICONS.notification}</div>;
            case 'error': return <div className={`${baseClasses} text-red-500`}>{ICONS.close}</div>;
            default: return <div className={`${baseClasses} text-blue-500`}>{ICONS.notification}</div>;
        }
    }

    const handleNotificationClick = (notification: Notification) => {
        markNotificationAsRead(notification.id);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={notificationRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
            >
                <span className="relative inline-flex">
                    {ICONS.notification}
                    {unreadCount > 0 && (
                        <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
                            <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                        </span>
                    )}
                </span>
            </button>
            
            {isOpen && (
                <div className="absolute right-0 mt-3 w-96 bg-card rounded-xl shadow-lg z-20 border border-border">
                    <div className="p-4 border-b border-border flex justify-between items-center">
                        <h4 className="font-bold">Bildirimler ({unreadCount})</h4>
                        {unreadCount > 0 && <button onClick={clearAllNotifications} className="text-sm text-primary-600 hover:underline">Tümünü Okundu İşaretle</button>}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                           notifications.map(n => (
                               <Link
                                 key={n.id}
                                 to={n.link || '#'}
                                 onClick={() => handleNotificationClick(n)}
                                 className={`block p-3 border-b border-border last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${!n.read ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
                               >
                                   <div className="flex items-start">
                                       {getTypeIcon(n.type)}
                                       <div className="flex-1">
                                           {n.title && <p className="font-semibold text-sm">{n.title}</p>}
                                           <p className="text-sm text-text-secondary">{n.message}</p>
                                           <p className="text-xs text-slate-400 mt-1">{new Date(n.timestamp).toLocaleString('tr-TR')}</p>
                                       </div>
                                       {!n.read && (
                                          <div className="w-2.5 h-2.5 mt-1 ml-2 rounded-full bg-primary-500 flex-shrink-0" title="Okunmadı"></div>
                                       )}
                                   </div>
                               </Link>
                           ))
                        ) : (
                            <p className="p-8 text-center text-text-secondary">Yeni bildirim yok.</p>
                        )}
                    </div>
                     <div className="p-2 border-t border-border text-center">
                        <button onClick={deleteAllNotifications} className="text-sm text-slate-500 hover:text-red-500 w-full">Tüm Bildirimleri Sil</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;