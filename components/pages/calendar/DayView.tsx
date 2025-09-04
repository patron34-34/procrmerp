import React, { useMemo, useState } from 'react';
import { CalendarEvent } from '../../../types';
import { isSameDay } from '../../../utils/dateUtils';

interface DayViewProps {
    date: Date;
    events: CalendarEvent[];
    onEventClick: (event: CalendarEvent, target: HTMLDivElement) => void;
    onEventDrop: (event: CalendarEvent, newDate: Date) => void;
    onNewTask: (date: Date) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_HEIGHT = 48;

const DayView: React.FC<DayViewProps> = ({ date, events, onEventClick, onEventDrop, onNewTask }) => {
    const [dragOverInfo, setDragOverInfo] = useState<{ hour: number } | null>(null);

    const handleDragStart = (e: React.DragEvent, event: CalendarEvent) => {
        e.dataTransfer.setData("calendarEvent", JSON.stringify(event));
    };

    const handleDragOver = (e: React.DragEvent, hour: number) => {
        e.preventDefault();
        setDragOverInfo({ hour });
    };

    const handleDrop = (e: React.DragEvent, hour: number) => {
        e.preventDefault();
        setDragOverInfo(null);
        const eventJson = e.dataTransfer.getData("calendarEvent");
        if (eventJson) {
            const event: CalendarEvent = JSON.parse(eventJson);
            const newDate = new Date(date);
            newDate.setHours(hour, 0, 0, 0);
            onEventDrop(event, newDate);
        }
    };

    const handleDoubleClick = (hour: number) => {
        const newDate = new Date(date);
        newDate.setHours(hour, 0, 0, 0);
        onNewTask(newDate);
    };

    return (
        <div className="flex border-t border-l dark:border-dark-border">
            <div className="w-16 flex-shrink-0">
                <div className="h-20 border-b dark:border-dark-border"></div>
                {HOURS.map(hour => (
                    <div key={hour} className="h-12 border-b dark:border-dark-border text-center text-xs pt-1 text-slate-400 relative -top-2">
                        {hour}:00
                    </div>
                ))}
            </div>
            <div className="flex-grow grid grid-cols-1">
                <div className="relative border-r dark:border-dark-border">
                    <div className="sticky top-0 bg-white dark:bg-dark-card z-10 text-center py-2 h-20 border-b dark:border-dark-border">
                        <p className="font-semibold">{date.toLocaleDateString('tr-TR', { weekday: 'long' })}</p>
                        <p className={`text-2xl font-bold ${isSameDay(date, new Date()) ? 'text-primary-600' : ''}`}>{date.getDate()}</p>
                    </div>
                    <div className="relative">
                        {HOURS.map(hour => (
                            <div
                                key={hour}
                                onDragOver={(e) => handleDragOver(e, hour)}
                                onDragLeave={() => setDragOverInfo(null)}
                                onDrop={(e) => handleDrop(e, hour)}
                                onDoubleClick={() => handleDoubleClick(hour)}
                                className={`h-12 border-b dark:border-dark-border transition-colors ${dragOverInfo?.hour === hour ? 'bg-primary-100 dark:bg-primary-900/50' : ''}`}
                            ></div>
                        ))}
                        {events.filter(e => isSameDay(new Date(e.date), date) && !e.isAllDay).map(event => {
                            const eventDate = new Date(event.date);
                            const top = eventDate.getHours() * HOUR_HEIGHT + (eventDate.getMinutes() / 60) * HOUR_HEIGHT;
                            const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(eventDate.getTime() + 60 * 60 * 1000);
                            const durationMinutes = (eventEndDate.getTime() - eventDate.getTime()) / (1000 * 60);
                            const height = Math.max(24, (durationMinutes / 60) * HOUR_HEIGHT);

                            return (
                                <div
                                    key={event.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, event)}
                                    ref={React.createRef<HTMLDivElement>()}
                                    onClick={(e) => { e.stopPropagation(); onEventClick(event, e.currentTarget); }}
                                    className="absolute left-1 right-1 p-1 rounded-md text-white text-xs cursor-pointer z-10"
                                    style={{ top: `${top}px`, backgroundColor: event.color, height: `${height}px` }}
                                >
                                    <p className="font-bold">{event.title}</p>
                                    <p>{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {eventEndDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DayView;