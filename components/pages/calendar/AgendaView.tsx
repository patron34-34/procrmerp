import React, { useMemo } from 'react';
import { CalendarEvent } from '../../../types';

interface AgendaViewProps {
    date: Date;
    events: CalendarEvent[];
    onEventClick: (event: CalendarEvent, target: HTMLDivElement) => void;
}

const AgendaView: React.FC<AgendaViewProps> = ({ events, onEventClick }) => {
    const groupedEvents = useMemo(() => {
        const groups: { [key: string]: CalendarEvent[] } = {};
        const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        sortedEvents.forEach(event => {
            const dateKey = new Date(event.date).toISOString().split('T')[0];
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(event);
        });
        return groups;
    }, [events]);

    return (
        <div className="max-h-[600px] overflow-y-auto">
            {Object.keys(groupedEvents).map(dateKey => (
                <div key={dateKey} className="flex items-start gap-4 py-4 border-b dark:border-dark-border">
                    <div className="w-24 text-center flex-shrink-0">
                        <p className="font-bold text-lg">{new Date(dateKey + 'T00:00:00').toLocaleDateString('tr-TR', { weekday: 'long' })}</p>
                        <p className="text-3xl font-light">{new Date(dateKey + 'T00:00:00').getDate()}</p>
                        <p className="text-sm text-text-secondary">{new Date(dateKey + 'T00:00:00').toLocaleDateString('tr-TR', { month: 'long' })}</p>
                    </div>
                    <div className="flex-1 space-y-2">
                        {groupedEvents[dateKey].map(event => (
                            <div
                                key={event.id}
                                ref={React.createRef<HTMLDivElement>()}
                                onClick={(e) => onEventClick(event, e.currentTarget)}
                                className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer"
                            >
                                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: event.color }}></span>
                                <span className="w-20 text-sm font-semibold">
                                    {event.isAllDay ? 'Tüm gün' : new Date(event.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span className="flex-1">{event.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AgendaView;
