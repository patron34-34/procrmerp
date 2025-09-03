import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarEvent, EventType } from '../../types';
import MonthView from './calendar/MonthView';
import WeekView from './calendar/WeekView';
import AgendaView from './calendar/AgendaView';
import CalendarUserFilter from '../calendar/CalendarUserFilter';
import Card from '../ui/Card';
import EventPopover from './calendar/EventPopover';
import Button from '../ui/Button';

type ViewMode = 'month' | 'week' | 'agenda';

const Calendar: React.FC = () => {
    const { projects, deals, invoices, tasks, currentUser, employees } = useApp();
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedUsers, setSelectedUsers] = useState<number[]>([currentUser.id]);
    const [popoverEvent, setPopoverEvent] = useState<{ event: CalendarEvent, target: HTMLDivElement } | null>(null);

    const allEvents = useMemo(() => {
        const events: CalendarEvent[] = [];

        projects.forEach(p => {
            events.push({
                id: `project-${p.id}`,
                type: 'project',
                date: new Date(p.deadline),
                title: `Proje Bitiş: ${p.name}`,
                color: '#f97316',
                isAllDay: true,
                data: p,
                ownerId: p.teamMemberIds[0] || 0,
            });
        });

        deals.forEach(d => {
            events.push({
                id: `deal-${d.id}`,
                type: 'deal',
                date: new Date(d.closeDate),
                title: `Fırsat Kapanış: ${d.title}`,
                color: '#3b82f6',
                isAllDay: true,
                data: d,
                ownerId: d.assignedToId,
            });
        });

        invoices.forEach(i => {
            events.push({
                id: `invoice-${i.id}`,
                type: 'invoice',
                date: new Date(i.dueDate),
                title: `Fatura Vadesi: ${i.invoiceNumber}`,
                color: '#ef4444',
                isAllDay: true,
                data: i,
                ownerId: 0,
            });
        });
        
        tasks.forEach(t => {
            events.push({
                id: `task-${t.id}`,
                type: 'task',
                date: new Date(t.dueDate),
                title: t.title,
                color: '#8b5cf6',
                isAllDay: false,
                data: t,
                ownerId: t.assignedToId
            })
        })

        return events;
    }, [projects, deals, invoices, tasks]);
    
    const filteredEvents = useMemo(() => {
        if (selectedUsers.length === employees.length) return allEvents; // 'all users' is selected
        return allEvents.filter(event => selectedUsers.includes(event.ownerId));
    }, [allEvents, selectedUsers, employees.length]);

    const changeMonth = (amount: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };
    
    const changeWeek = (amount: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + (7 * amount));
            return newDate;
        });
    };
    
    const handleEventClick = (event: CalendarEvent, target: HTMLDivElement) => {
        setPopoverEvent({ event, target });
    };

    const renderView = () => {
        switch (viewMode) {
            case 'month':
                return <MonthView date={currentDate} events={filteredEvents} onEventClick={handleEventClick} />;
            case 'week':
                return <WeekView date={currentDate} events={filteredEvents} onEventClick={handleEventClick} />;
            case 'agenda':
                return <AgendaView date={currentDate} events={filteredEvents} onEventClick={handleEventClick} />;
        }
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                 <div className="flex items-center gap-2">
                    <button onClick={() => viewMode === 'month' ? changeMonth(-1) : changeWeek(-1)} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">&lt;</button>
                    <h2 className="text-xl font-bold">{currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}</h2>
                    <button onClick={() => viewMode === 'month' ? changeMonth(1) : changeWeek(1)} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">&gt;</button>
                    <Button variant="secondary" size="md" onClick={() => setCurrentDate(new Date())}>Bugün</Button>
                </div>
                 <div className="flex items-center gap-4">
                    <CalendarUserFilter selectedUsers={selectedUsers} onSelectionChange={setSelectedUsers} />
                    <div className="p-1 bg-slate-200 dark:bg-slate-700 rounded-md">
                        <Button size="sm" variant={viewMode === 'month' ? 'primary' : 'secondary'} onClick={() => setViewMode('month')}>Ay</Button>
                        <Button size="sm" variant={viewMode === 'week' ? 'primary' : 'secondary'} onClick={() => setViewMode('week')}>Hafta</Button>
                        <Button size="sm" variant={viewMode === 'agenda' ? 'primary' : 'secondary'} onClick={() => setViewMode('agenda')}>Ajanda</Button>
                    </div>
                </div>
            </div>
            {renderView()}
            {popoverEvent && (
                <EventPopover
                    event={popoverEvent.event}
                    target={popoverEvent.target}
                    onClose={() => setPopoverEvent(null)}
                />
            )}
        </Card>
    );
};

export default Calendar;
