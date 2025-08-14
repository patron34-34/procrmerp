

import React, { useState, useMemo } from 'react';
import { getCalendarGrid, getWeekdayHeaders, isSameDay } from '../../utils/dateUtils';
import { CalendarEvent } from '../../types';
import { Task } from '../../types';

interface MonthViewProps {
    currentDate: Date;
    events: CalendarEvent[];
    onDateDrop: (task: Task, newDate: Date) => void;
    onNewTask: (date: Date) => void;
    onEventClick: (event: CalendarEvent, target: HTMLDivElement) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ currentDate, events, onDateDrop, onNewTask, onEventClick }) => {
    const calendarGrid = useMemo(() => getCalendarGrid(currentDate.getFullYear(), currentDate.getMonth()), [currentDate]);
    const weekdayHeaders = getWeekdayHeaders();
    const [dragOverDate, setDragOverDate] = useState<Date | null>(null);

    const getEventsForDay = (day: Date): CalendarEvent[] => {
        return events.filter(event => {
            const eventStart = new Date(event.date);
            eventStart.setHours(0,0,0,0);
            const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;
            eventEnd.setHours(23,59,59,999);
            const checkDay = new Date(day);
            checkDay.setHours(12,0,0,0);
            return checkDay >= eventStart && checkDay <= eventEnd;
        });
    };

    const handleDragStart = (e: React.DragEvent, event: CalendarEvent) => {
        if (event.type === 'task') {
            e.dataTransfer.setData("task", JSON.stringify(event.data));
        } else {
            e.preventDefault();
        }
    };
    
    const handleDragOver = (e: React.DragEvent, day: Date) => {
        e.preventDefault();
        setDragOverDate(day);
    };

    const handleDrop = (e: React.DragEvent, day: Date) => {
        e.preventDefault();
        const taskJson = e.dataTransfer.getData("task");
        if (taskJson) {
            const task = JSON.parse(taskJson);
            onDateDrop(task, day);
        }
        setDragOverDate(null);
    };

    return (
        <div className="grid grid-cols-7 h-full" style={{gridTemplateRows: 'auto 1fr 1fr 1fr 1fr 1fr 1fr'}}>
            {weekdayHeaders.map(day => (
                <div key={day} className="text-center font-semibold text-text-secondary dark:text-dark-text-secondary p-2 border-b border-r dark:border-dark-border">{day}</div>
            ))}
            {calendarGrid.flat().map((day, index) => {
                if (!day) return <div key={index} className="border-r border-b dark:border-dark-border"></div>;

                const dayEvents = getEventsForDay(day);
                const isToday = isSameDay(day, new Date());
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isDragOver = dragOverDate && isSameDay(day, dragOverDate);

                return (
                    <div
                        key={index}
                        onDragOver={(e) => handleDragOver(e, day)}
                        onDragLeave={() => setDragOverDate(null)}
                        onDrop={(e) => handleDrop(e, day)}
                        onClick={() => onNewTask(day)}
                        className={`border-r border-b p-2 flex flex-col transition-colors dark:border-dark-border cursor-pointer ${isCurrentMonth ? '' : 'bg-slate-50 dark:bg-slate-800/20 text-slate-400'} ${isDragOver ? 'bg-primary-100 dark:bg-primary-900/50' : ''}`}
                    >
                        <span className={`font-semibold self-start ${isToday ? 'bg-primary-500 text-white rounded-full w-7 h-7 flex items-center justify-center' : ''}`}>
                            {day.getDate()}
                        </span>
                        <div className="mt-1 overflow-y-auto text-xs space-y-1 flex-grow">
                            {dayEvents.slice(0, 3).map((event) => (
                                <div 
                                    key={`${event.type}-${event.data.id}-${event.data.originalDate || event.date}`}
                                    draggable={event.type === 'task'}
                                    onDragStart={(e) => handleDragStart(e, event)}
                                    onClick={(e) => { 
                                        e.stopPropagation();
                                        onEventClick(event, e.currentTarget as HTMLDivElement);
                                    }}
                                    className="p-1 rounded-md truncate"
                                    style={event.isAllDay ? { backgroundColor: event.color, color: 'white' } : {}}
                                >
                                    {event.isAllDay 
                                        ? <span className="font-semibold">{event.title}</span>
                                        : <div className="flex items-center gap-1.5">
                                            <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: event.color }}></span>
                                            <span className="text-text-secondary dark:text-dark-text-secondary">{event.date.toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</span>
                                            <span className="truncate text-text-main dark:text-dark-text-main">{event.title}</span>
                                          </div>
                                    }
                                </div>
                            ))}
                            {dayEvents.length > 3 && <div className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">+ {dayEvents.length - 3} daha</div>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
export default MonthView;
