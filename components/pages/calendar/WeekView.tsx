import React, { useMemo } from 'react';
import { CalendarEvent } from '../../../types';
import { getWeekDays, isSameDay } from '../../../utils/dateUtils';

interface WeekViewProps {
    date: Date;
    events: CalendarEvent[];
    onEventClick: (event: CalendarEvent, target: HTMLDivElement) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const WeekView: React.FC<WeekViewProps> = ({ date, events, onEventClick }) => {
    const weekDays = useMemo(() => getWeekDays(date), [date]);

    return (
        <div className="flex border-t border-l dark:border-dark-border">
            <div className="w-16 flex-shrink-0">
                {/* Spacer for header */}
                <div className="h-20 border-b dark:border-dark-border"></div>
                {HOURS.map(hour => (
                    <div key={hour} className="h-12 border-b dark:border-dark-border text-center text-xs pt-1 text-slate-400 relative -top-2">
                        {hour}:00
                    </div>
                ))}
            </div>
            <div className="flex-grow grid grid-cols-7">
                {weekDays.map((day, dayIndex) => (
                    <div key={dayIndex} className="relative border-r dark:border-dark-border">
                         <div className="sticky top-0 bg-white dark:bg-dark-card z-10 text-center py-2 h-20 border-b dark:border-dark-border">
                            <p className="font-semibold">{day.toLocaleDateString('tr-TR', { weekday: 'short' })}</p>
                            <p className={`text-2xl font-bold ${isSameDay(day, new Date()) ? 'text-primary-600' : ''}`}>{day.getDate()}</p>
                        </div>
                        {HOURS.map(hour => (
                            <div key={hour} className="h-12 border-b dark:border-dark-border"></div>
                        ))}
                        {events.filter(e => isSameDay(e.date, day) && !e.isAllDay).map(event => {
                            const top = 80 + (event.date.getHours() * 48 + event.date.getMinutes() * 0.8); // 80 for header, 48px per hour
                            return (
                                <div
                                    key={event.id}
                                    ref={React.createRef<HTMLDivElement>()}
                                    onClick={(e) => onEventClick(event, e.currentTarget)}
                                    className="absolute left-1 right-1 p-1 rounded-md text-white text-xs cursor-pointer z-10"
                                    style={{ top: `${top}px`, backgroundColor: event.color, minHeight: '24px' }}
                                >
                                    {event.title}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeekView;