

import React, { useState, useEffect, useRef } from 'react';
import { getWeekDays, isSameDay } from '../../utils/dateUtils';
import { CalendarEvent } from '../../types';
import { Task } from '../../types';

interface WeekViewProps {
    currentDate: Date;
    events: CalendarEvent[];
    onDateDrop: (task: Task, newDate: Date) => void;
    onNewTask: (date: Date) => void;
    onEventClick: (event: CalendarEvent, target: HTMLDivElement) => void;
    onDurationChange: (task: Task, newEndDate: Date) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ currentDate, events, onDateDrop, onNewTask, onEventClick, onDurationChange }) => {
    const weekDays = getWeekDays(currentDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const [currentTime, setCurrentTime] = useState(new Date());
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    const allDayEventsByDay: { [key: string]: CalendarEvent[] } = {};
    const timedEventsByDay: { [key: string]: CalendarEvent[] } = {};

    weekDays.forEach(day => {
        const dayKey = day.toISOString().split('T')[0];
        allDayEventsByDay[dayKey] = [];
        timedEventsByDay[dayKey] = [];
    });

    events.forEach(event => {
        const eventDay = new Date(event.date);
        eventDay.setHours(0,0,0,0);
        
        for (const day of weekDays) {
            const dayKey = day.toISOString().split('T')[0];
            const eventEnd = event.endDate ? new Date(event.endDate) : eventDay;
            eventEnd.setHours(23, 59, 59, 999);
            
            if (day >= eventDay && day <= eventEnd) {
                if (event.isAllDay) {
                    allDayEventsByDay[dayKey].push(event);
                } else {
                    timedEventsByDay[dayKey].push(event);
                }
            }
        }
    });

    const handleDragStart = (e: React.DragEvent, event: CalendarEvent) => {
        if (event.type === 'task') {
            e.dataTransfer.setData("task", JSON.stringify(event.data));
        }
    };

    const handleDrop = (e: React.DragEvent, day: Date, hour?: number) => {
        e.preventDefault();
        const taskJson = e.dataTransfer.getData("task");
        if (taskJson) {
            const task = JSON.parse(taskJson);
            const newDate = new Date(day);
            if (hour !== undefined) {
                newDate.setHours(hour, 0, 0, 0);
            }
            onDateDrop(task, newDate);
        }
    };
    
    const handleSlotClick = (day: Date, hour: number) => {
        const newDate = new Date(day);
        newDate.setHours(hour, 0, 0, 0);
        onNewTask(newDate);
    };
    
    const handleResizeStart = (e: React.MouseEvent, event: CalendarEvent) => {
        e.stopPropagation();
        const task = event.data as Task;
        const target = e.currentTarget.parentElement as HTMLDivElement;
        const initialHeight = target.offsetHeight;
        const startY = e.clientY;

        const doDrag = (e: MouseEvent) => {
            const newHeight = initialHeight + (e.clientY - startY);
            target.style.height = `${Math.max(32, newHeight)}px`; // Min height
        };

        const stopDrag = () => {
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopDrag);

            const finalHeight = target.offsetHeight;
            const hours = finalHeight / 64; // 64px per hour
            const newDurationMs = hours * 60 * 60 * 1000;
            const newEndDate = new Date(new Date(task.startDate!).getTime() + newDurationMs);
            onDurationChange(task, newEndDate);
            target.style.height = ''; // Reset style to be recalculated by React
        };

        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="grid grid-cols-[60px_1fr] flex-shrink-0">
                <div className="border-r border-b dark:border-dark-border h-20"></div> {/* Top-left corner */}
                <div className="grid grid-cols-7">
                    {weekDays.map(day => (
                        <div key={day.toISOString()} className="text-center p-2 border-r border-b dark:border-dark-border">
                            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{day.toLocaleDateString('tr-TR', { weekday: 'short' })}</p>
                            <p className={`text-2xl font-bold ${isSameDay(day, new Date()) ? 'text-primary-600' : ''}`}>{day.getDate()}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-[60px_1fr] flex-shrink-0 border-b dark:border-dark-border">
                <div className="flex items-center justify-center text-xs font-semibold text-text-secondary border-r dark:border-dark-border">Tüm Gün</div>
                 <div className="grid grid-cols-7">
                    {weekDays.map(day => {
                        const dayKey = day.toISOString().split('T')[0];
                        const dayEvents = allDayEventsByDay[dayKey];
                        return (
                            <div key={dayKey} className="p-1 border-r dark:border-dark-border min-h-[30px] space-y-1" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, day)}>
                                {dayEvents.map(event => (
                                    <div 
                                        key={`${event.type}-${event.data.id}-${event.ownerId}`}
                                        onClick={(e) => onEventClick(event, e.currentTarget as HTMLDivElement)}
                                        style={{ backgroundColor: event.color }}
                                        className={`p-1 text-xs rounded-md text-white truncate font-semibold cursor-pointer`}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="flex-grow overflow-auto" ref={gridRef}>
                <div className="grid grid-cols-[60px_1fr] min-w-[1200px]">
                    <div>
                        {hours.map(hour => (
                            <div key={hour} className="h-16 text-right pr-2 text-xs text-text-secondary dark:text-dark-text-secondary border-r dark:border-dark-border pt-1">
                                {hour > 0 && `${hour.toString().padStart(2, '0')}:00`}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7">
                        {weekDays.map(day => {
                            const dayKey = day.toISOString().split('T')[0];
                            const dayEvents = timedEventsByDay[dayKey];
                            return (
                                <div key={day.toISOString()} className="relative border-r dark:border-dark-border">
                                    {hours.map(hour => (
                                        <div
                                            key={hour}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => handleDrop(e, day, hour)}
                                            onClick={() => handleSlotClick(day, hour)}
                                            className="h-16 border-t dark:border-dark-border cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        ></div>
                                    ))}
                                     {isSameDay(day, currentTime) && (
                                        <div className="absolute left-0 right-0 h-0.5 bg-red-500 z-20" style={{ top: `${(currentTime.getHours() * 64) + (currentTime.getMinutes() / 60 * 64)}px` }}>
                                            <div className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-red-500"></div>
                                        </div>
                                    )}
                                    {dayEvents.map(event => {
                                        const eventStart = new Date(event.date);
                                        const top = (eventStart.getHours() * 64) + (eventStart.getMinutes() / 60 * 64);
                                        let durationHours = 1;
                                        if(event.endDate) {
                                            durationHours = (new Date(event.endDate).getTime() - event.date.getTime()) / (1000 * 60 * 60);
                                            durationHours = Math.max(0.5, durationHours); // min 30 mins
                                        }
                                        const height = durationHours * 64 - 4;

                                        return (
                                            <div
                                                key={`${event.type}-${event.data.id}-${event.data.originalDate || event.date}`}
                                                draggable={event.type === 'task'}
                                                onDragStart={(e) => handleDragStart(e, event)}
                                                onClick={(e) => { e.stopPropagation(); onEventClick(event, e.currentTarget as HTMLDivElement);}}
                                                className={`absolute left-1 right-1 p-1 rounded-lg text-white text-xs z-10 flex flex-col overflow-hidden`}
                                                style={{ top: `${top}px`, height: `${height}px`, backgroundColor: event.color }}
                                                title={event.title}
                                            >
                                                <p className="font-bold truncate">{event.title}</p>
                                                <p className="truncate">{eventStart.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
                                                <div 
                                                    onMouseDown={(e) => handleResizeStart(e, event)}
                                                    className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize"
                                                ></div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default WeekView;
