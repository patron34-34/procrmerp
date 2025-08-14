

import React from 'react';
import { getWeekDays } from '../../utils/dateUtils';
import { CalendarEvent } from '../../types';
import { useApp } from '../../context/AppContext';

interface AgendaViewProps {
    currentDate: Date;
    events: CalendarEvent[];
    onEventClick: (event: CalendarEvent, target: HTMLDivElement) => void;
}

const AgendaView: React.FC<AgendaViewProps> = ({ currentDate, events, onEventClick }) => {
    const weekDays = getWeekDays(currentDate);
    const { employees } = useApp();

    return (
        <div className="p-4 space-y-4">
            {weekDays.map(day => {
                const dayEvents = events.filter(event => {
                    const eventStart = new Date(event.date);
                    eventStart.setHours(0,0,0,0);
                    const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;
                    eventEnd.setHours(23,59,59,999);
                    const checkDay = new Date(day);
                    checkDay.setHours(12,0,0,0);
                    return checkDay >= eventStart && checkDay <= eventEnd;
                }).sort((a,b) => a.date.getTime() - b.date.getTime());

                return (
                    <div key={day.toISOString()}>
                        <h3 className="font-bold text-lg mb-2 pb-2 border-b dark:border-dark-border">
                            {day.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </h3>
                        {dayEvents.length > 0 ? (
                            <div className="space-y-2">
                                {dayEvents.map(event => {
                                    const owner = employees.find(e => e.id === event.ownerId);
                                    return (
                                        <div 
                                            key={`${event.type}-${event.data.id}-${event.ownerId}`} 
                                            onClick={(e) => onEventClick(event, e.currentTarget as HTMLDivElement)}
                                            className={`p-3 rounded-md bg-slate-50 dark:bg-slate-800/50 cursor-pointer border-l-4`}
                                            style={{ borderLeftColor: event.color }}
                                        >
                                            <div className="flex justify-between">
                                                <div>
                                                    <p className="font-semibold">{event.title}</p>
                                                    {owner && <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{owner.name}</p>}
                                                </div>
                                                <p className="text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">
                                                    {event.isAllDay ? 'Tüm Gün' : event.date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-text-secondary dark:text-dark-text-secondary p-4 text-center">Bu gün için etkinlik yok.</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default AgendaView;
