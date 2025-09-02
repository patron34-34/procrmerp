import React from 'react';
import { CalendarEvent } from '../../../types';
import { getCalendarGrid, isSameDay } from '../../../utils/dateUtils';

interface MonthViewProps {
    date: Date;
    events: CalendarEvent[];
    onEventClick: (event: CalendarEvent, target: HTMLDivElement) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ date, events, onEventClick }) => {
    const calendarGrid = getCalendarGrid(date.getFullYear(), date.getMonth());
    const weekdayHeaders = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

    const getEventsForDay = (day: Date): CalendarEvent[] => {
        return events.filter(event => isSameDay(event.date, day));
    };

    return (
        <div className="grid grid-cols-7 border-l dark:border-dark-border">
             <div className="grid grid-cols-7 col-span-7 border-t dark:border-dark-border">
                {weekdayHeaders.map(day => (
                    <div key={day} className="text-center font-semibold text-text-secondary dark:text-dark-text-secondary p-2 border-r dark:border-dark-border">{day}</div>
                ))}
            </div>
            {calendarGrid.flat().map((day, index) => {
                if (!day) return <div key={index} className="border-r border-b dark:border-dark-border min-h-[120px]"></div>;

                const dayEvents = getEventsForDay(day);
                const isToday = isSameDay(day, new Date());
                const isCurrentMonth = day.getMonth() === date.getMonth();

                return (
                    <div
                        key={index}
                        className={`border-r border-b dark:border-dark-border min-h-[120px] p-2 flex flex-col ${isCurrentMonth ? '' : 'bg-slate-50 dark:bg-slate-800/20'}`}
                    >
                        <span className={`font-semibold self-start mb-1 ${isToday ? 'bg-primary-500 text-white rounded-full w-7 h-7 flex items-center justify-center' : ''} ${!isCurrentMonth ? 'text-slate-400' : ''}`}>
                            {day.getDate()}
                        </span>
                        <div className="flex-grow space-y-1 overflow-hidden">
                            {dayEvents.slice(0, 3).map(event => (
                                <div
                                    key={event.id}
                                    ref={React.createRef<HTMLDivElement>()}
                                    onClick={(e) => onEventClick(event, e.currentTarget)}
                                    className="p-1 rounded-md text-white text-xs truncate cursor-pointer"
                                    style={{ backgroundColor: event.color }}
                                >
                                    {event.isAllDay ? '' : event.date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) + ' '}
                                    {event.title}
                                </div>
                            ))}
                            {dayEvents.length > 3 && (
                                <div className="text-xs text-primary-600 font-semibold cursor-pointer">
                                    + {dayEvents.length - 3} daha
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MonthView;