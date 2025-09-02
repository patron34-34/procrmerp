import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ICONS } from '../../../constants';
import { CalendarEvent } from '../../../types';
import { useApp } from '../../../context/AppContext';

interface EventPopoverProps {
    event: CalendarEvent;
    target: HTMLDivElement;
    onClose: () => void;
}

const EventPopover: React.FC<EventPopoverProps> = ({ event, target, onClose }) => {
    const popoverRef = useRef<HTMLDivElement>(null);
    const { employees } = useApp();
    const owner = employees.find(e => e.id === event.ownerId);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node) && !target.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose, target]);

    const targetRect = target.getBoundingClientRect();
    const popoverStyle: React.CSSProperties = {
        position: 'absolute',
        top: `${targetRect.bottom + window.scrollY + 5}px`,
        left: `${targetRect.left + window.scrollX}px`,
        width: '280px',
    };
    
    const getDetailLink = () => {
        switch (event.type) {
            case 'project': return `/projects/${event.data.id}`;
            case 'deal': return `/deals/${event.data.id}`;
            case 'invoice': return `/invoices`;
            case 'task': return `/planner`;
            default: return '/';
        }
    };

    const getRelatedCustomerLink = () => {
        if (event.data.customerId) {
            return `/customers/${event.data.customerId}`;
        }
        return null;
    }

    const customerLink = getRelatedCustomerLink();
    const customerName = event.data.customerName || (event.type === 'project' && event.data.client);

    return (
        <div ref={popoverRef} style={popoverStyle} className="z-50 bg-card dark:bg-dark-card rounded-lg shadow-xl border dark:border-dark-border">
             <div className="p-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 flex-1 pr-2">
                        <span className={`w-3 h-3 rounded-full flex-shrink-0`} style={{ backgroundColor: event.color }}></span>
                        <h3 className="font-bold text-lg leading-tight">{event.title}</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 -mt-1 -mr-1">
                        {ICONS.close}
                    </button>
                </div>
                
                 {owner && (
                    <div className="flex items-center gap-2 mt-3">
                        <img src={owner.avatar} alt={owner.name} className="w-6 h-6 rounded-full" />
                        <span className="text-sm font-semibold">{owner.name}</span>
                    </div>
                )}
                
                <div className="mt-3 text-sm text-text-secondary dark:text-dark-text-secondary">
                    <p className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {event.date.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    <p className="flex items-center gap-2 mt-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {event.isAllDay ? 'Tüm gün' : event.date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>

                <div className="mt-4 pt-3 border-t dark:border-dark-border flex justify-between items-center">
                    <Link to={getDetailLink()} onClick={onClose} className="text-primary-600 hover:underline font-semibold text-sm">
                        Detayları Gör →
                    </Link>
                    {customerLink && customerName && (
                        <Link to={customerLink} onClick={onClose} className="text-sm text-text-secondary hover:underline">
                            {customerName}
                        </Link>
                    )}
                </div>
             </div>
        </div>
    );
};

// FIX: Add default export to make the component a module.
export default EventPopover;
