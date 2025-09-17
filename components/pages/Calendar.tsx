import React, { useState, useMemo, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarEvent, EventType, Task, Deal } from '../../types';
import MonthView from './calendar/MonthView';
import WeekView from './calendar/WeekView';
import AgendaView from './calendar/AgendaView';
import DayView from './calendar/DayView'; 
import CalendarUserFilter from '../calendar/CalendarUserFilter';
import Card from '../ui/Card';
import EventPopover from '../pages/calendar/EventPopover';
import Button from '../ui/Button';
import { ICONS } from '../../constants';
import TaskFormModal from '../tasks/TaskFormModal';
import SmartScheduleModal from '../calendar/SmartScheduleModal';

type ViewMode = 'month' | 'week' | 'day' | 'agenda';

const EVENT_TYPES: { type: EventType, label: string }[] = [
    { type: 'task', label: 'Görevler' },
    { type: 'deal', label: 'Anlaşmalar' },
    { type: 'project', label: 'Projeler' },
    { type: 'invoice', label: 'Faturalar' },
    { type: 'appointment', label: 'Toplantılar' }
];

const Calendar: React.FC = () => {
    const { projects, deals, invoices, tasks, currentUser, employees, updateTask, updateDeal } = useApp();
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedUsers, setSelectedUsers] = useState<number[]>([currentUser.id]);
    const [popoverEvent, setPopoverEvent] = useState<{ event: CalendarEvent, target: HTMLDivElement } | null>(null);
    const [enabledEventTypes, setEnabledEventTypes] = useState<Set<EventType>>(new Set(['task', 'deal', 'project', 'invoice', 'appointment']));
    const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
    const [quickAddData, setQuickAddData] = useState<Partial<Task> | null>(null);
    const [isSmartScheduleOpen, setIsSmartScheduleOpen] = useState(false);

    const allEvents = useMemo(() => {
        const events: CalendarEvent[] = [];

        projects.forEach(p => {
            events.push({ id: `project-${p.id}`, type: 'project', date: new Date(p.deadline), title: `Proje Bitiş: ${p.name}`, color: '#f97316', isAllDay: true, data: p, ownerId: p.teamMemberIds[0] || 0 });
        });

        deals.forEach(d => {
            events.push({ id: `deal-${d.id}`, type: 'deal', date: new Date(d.closeDate), title: `Fırsat Kapanış: ${d.title}`, color: '#3b82f6', isAllDay: true, data: d, ownerId: d.assignedToId });
        });

        invoices.forEach(i => {
            events.push({ id: `invoice-${i.id}`, type: 'invoice', date: new Date(i.dueDate), title: `Fatura Vadesi: ${i.invoiceNumber}`, color: '#ef4444', isAllDay: true, data: i, ownerId: 0 });
        });
        
        tasks.forEach(t => {
            events.push({ id: `task-${t.id}`, type: t.title.toLowerCase().includes('toplantı') ? 'appointment' : 'task', date: new Date(t.startDate || t.dueDate), endDate: new Date(t.dueDate), title: t.title, color: '#8b5cf6', isAllDay: !t.startDate, data: t, ownerId: t.assignedToId });
        });

        return events;
    }, [projects, deals, invoices, tasks]);
    
    const filteredEvents = useMemo(() => {
        const userFiltered = selectedUsers.length === employees.length ? allEvents : allEvents.filter(event => event.ownerId === 0 || selectedUsers.includes(event.ownerId));
        return userFiltered.filter(event => enabledEventTypes.has(event.type));
    }, [allEvents, selectedUsers, employees.length, enabledEventTypes]);
    
    const changeDate = (amount: number, unit: 'month' | 'week' | 'day') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            if (unit === 'month') newDate.setMonth(newDate.getMonth() + amount);
            if (unit === 'week') newDate.setDate(newDate.getDate() + 7 * amount);
            if (unit === 'day') newDate.setDate(newDate.getDate() + amount);
            return newDate;
        });
    };
    
    const handleEventDrop = (event: CalendarEvent, newDate: Date) => {
        if (event.type === 'task') {
            const task = event.data as Task;
            updateTask({ ...task, dueDate: newDate.toISOString().split('T')[0] });
        } else if (event.type === 'deal') {
            const deal = event.data as Deal;
            updateDeal({ ...deal, closeDate: newDate.toISOString().split('T')[0] });
        }
    };
    
    const handleNewTask = (date: Date) => {
        setQuickAddData({ startDate: date.toISOString().split('T')[0], dueDate: date.toISOString().split('T')[0] });
        setIsTaskFormOpen(true);
    };

    const handleToggleEventType = (type: EventType) => {
        setEnabledEventTypes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(type)) newSet.delete(type);
            else newSet.add(type);
            return newSet;
        });
    };

    const renderView = () => {
        switch (viewMode) {
            case 'month':
                return <MonthView date={currentDate} events={filteredEvents} onEventClick={(e, t) => setPopoverEvent({event: e, target: t})} onEventDrop={handleEventDrop} onNewTask={handleNewTask} />;
            case 'week':
                return <WeekView date={currentDate} events={filteredEvents} onEventClick={(e, t) => setPopoverEvent({event: e, target: t})} onEventDrop={handleEventDrop} onNewTask={handleNewTask} />;
            case 'day':
                return <DayView date={currentDate} events={filteredEvents} onEventClick={(e, t) => setPopoverEvent({event: e, target: t})} onEventDrop={handleEventDrop} onNewTask={handleNewTask} />;
            case 'agenda':
                return <AgendaView date={currentDate} events={filteredEvents} onEventClick={(e, t) => setPopoverEvent({event: e, target: t})} />;
        }
    };

    return (
        <>
            <Card>
                <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" onClick={() => changeDate(-1, viewMode === 'month' ? 'month' : viewMode === 'week' ? 'week' : 'day')}>&lt;</Button>
                        <h2 className="text-xl font-bold">{currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}</h2>
                        <Button variant="secondary" size="sm" onClick={() => changeDate(1, viewMode === 'month' ? 'month' : viewMode === 'week' ? 'week' : 'day')}>&gt;</Button>
                        <Button variant="secondary" size="md" onClick={() => setCurrentDate(new Date())}>Bugün</Button>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button onClick={() => setIsSmartScheduleOpen(true)}><span className="flex items-center gap-2">{ICONS.magic} Akıllı Zamanlama</span></Button>
                        <CalendarUserFilter selectedUsers={selectedUsers} onSelectionChange={setSelectedUsers} />
                        <div className="p-1 bg-slate-200 dark:bg-slate-700 rounded-md">
                            <Button size="sm" variant={viewMode === 'month' ? 'primary' : 'secondary'} onClick={() => setViewMode('month')}>Ay</Button>
                            <Button size="sm" variant={viewMode === 'week' ? 'primary' : 'secondary'} onClick={() => setViewMode('week')}>Hafta</Button>
                            <Button size="sm" variant={viewMode === 'day' ? 'primary' : 'secondary'} onClick={() => setViewMode('day')}>Gün</Button>
                            <Button size="sm" variant={viewMode === 'agenda' ? 'primary' : 'secondary'} onClick={() => setViewMode('agenda')}>Ajanda</Button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 items-center mb-4 border-t pt-4 dark:border-dark-border">
                    <span className="text-sm font-semibold">Göster:</span>
                    {EVENT_TYPES.map(({ type, label }) => (
                        <label key={type} className="flex items-center gap-2 text-sm cursor-pointer">
                            <input type="checkbox" checked={enabledEventTypes.has(type)} onChange={() => handleToggleEventType(type)} className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500"/>
                            {label}
                        </label>
                    ))}
                </div>
                {renderView()}
                {popoverEvent && <EventPopover event={popoverEvent.event} target={popoverEvent.target} onClose={() => setPopoverEvent(null)} />}
            </Card>
            {isTaskFormOpen && <TaskFormModal isOpen={isTaskFormOpen} onClose={() => setIsTaskFormOpen(false)} task={null} prefilledData={quickAddData} onSubmit={(data, subtasks) => { useApp().addTask(data, subtasks); setIsTaskFormOpen(false);}} />}
            {isSmartScheduleOpen && <SmartScheduleModal isOpen={isSmartScheduleOpen} onClose={() => setIsSmartScheduleOpen(false)} />}
        </>
    );
};

export default Calendar;